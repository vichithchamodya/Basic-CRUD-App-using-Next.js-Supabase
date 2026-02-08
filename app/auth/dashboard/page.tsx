"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

interface ProductType {
  id?: number;
  title: string;
  content?: string;
  cost?: string;
  banner_image?: string | File | null;
}

const formSchema = yup.object().shape({
  title: yup.string().required("Product title is required"),
  content: yup.string().required("Description is required"),
  cost: yup.string().required("Product cost is required"),
  banner_image: yup.mixed().nullable(),
});

export default function Dashboard() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const {
    setAuthToken,
    setIsLoggedIn,
    isLoggedIn,
    setUserProfile,
    setIsLoading,
  } = myAppHook();
  const router = useRouter();

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error("Failed to get user data");
        router.push("/auth/login");
        return;
      }

      setIsLoading(true);
      if (data.session?.access_token) {
        console.log(data);
        setAuthToken(data.session?.access_token);
        setUserId(data.session?.user.id);
        localStorage.setItem("access_token", data.session?.access_token);
        setIsLoggedIn(true);
        setUserProfile({
          name: data.session.user?.user_metadata.fullName,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        });
        //toast.success("User logged in successfully");
        localStorage.setItem(
          "user_profile",
          JSON.stringify({
            name: data.session.user?.user_metadata.fullName,
            email: data.session.user?.user_metadata.email,
            gender: data.session.user?.user_metadata.gender,
            phone: data.session.user?.user_metadata.phone,
          }),
        );

        fetchProductsFromTable(data.session.user.id);
      }
      setIsLoading(false);
    };

    handleLoginSession();

    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Upload Banner Image
  const uploadImageFile = async (file: File) => {
    // banner.jpg

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      toast.error("Failed to upload banner image");
      return null;
    }

    return supabase.storage.from("product-images").getPublicUrl(fileName).data
      .publicUrl;
  };

  // Form Submit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFormSubmit = async (formData: any) => {
    setIsLoading(true);

    let imagePath = formData.banner_image;

    if (formData.banner_image instanceof File) {
      imagePath = await uploadImageFile(formData.banner_image);
      if (!imagePath) return;
    }

    if (editId) {
      // Edit Operation
      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          banner_image: imagePath,
        })
        .match({
          id: editId,
          user_id: userId,
        });

      if (error) {
        toast.error("Failed to update product data");
      } else {
        toast.success("Product has been updated successfully");
      }
    } else {
      // Add Operation
      const { error } = await supabase.from("products").insert({
        ...formData,
        user_id: userId,
        banner_image: imagePath,
      });

      if (error) {
        toast.error("Failed to Add Product");
      } else {
        toast.success("Successfully Product has been created!");
      }
      reset();
    }

    setPreviewImage(null);
    fetchProductsFromTable(userId!);
    setIsLoading(false);
  };

  const fetchProductsFromTable = async (userId: string) => {
    setIsLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      setProducts(data);
    }

    setIsLoading(false);
  };

  // Edit Data
  const handleEditData = (product: ProductType) => {
    console.log(product);
    setValue("title", product.title);
    setValue("content", product.content || "");
    setValue("cost", product.cost || "");
    if (product.banner_image && typeof product.banner_image === "string") {
      setPreviewImage(product.banner_image);
    }
    setEditId(product.id!);
  };

  // Delete Product Operation
  const handleDeleteProduct = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("products").delete().match({
          id: id,
          user_id: userId,
        });

        if (error) {
          toast.error("Failed to delete product");
        } else {
          toast.success("Product deleted successfully");
          fetchProductsFromTable(userId!);
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your products</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Add/Edit Product Form */}
          <div className="lg:col-span-5">
            <div className="card sticky top-4">
              <h3 className="text-lg font-bold mb-4 text-gray-100 flex items-center">
                {editId ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Product
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Product
                  </>
                )}
              </h3>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Product Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter product title"
                    {...register("title")}
                  />
                  {errors.title?.message && (
                    <small className="text-red-400 text-xs block mt-1">
                      {errors.title?.message}
                    </small>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Enter product description"
                    {...register("content")}
                  ></textarea>
                  {errors.content?.message && (
                    <small className="text-red-400 text-xs block mt-1">
                      {errors.content?.message}
                    </small>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                    {...register("cost")}
                  />
                  {errors.cost?.message && (
                    <small className="text-red-400 text-xs block mt-1">
                      {errors.cost?.message}
                    </small>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Product Image
                  </label>
                  {previewImage && (
                    <div className="mb-2">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={120}
                        height={120}
                        className="rounded-md shadow-md object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="input-field text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={(event) => {
                      if (event.target.files && event.target.files[0]) {
                        setValue("banner_image", event.target.files[0]);
                        setPreviewImage(
                          URL.createObjectURL(event.target.files[0]),
                        );
                      }
                    }}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className={
                      editId ? "btn-primary flex-1" : "btn-success flex-1"
                    }
                  >
                    {editId ? "Update" : "Add"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        reset();
                        setPreviewImage(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-7">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Products
                  {products && products.length > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {products.length}
                    </span>
                  )}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-300">
                        Title
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-300">
                        Description
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-300">
                        Price
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-300">
                        Image
                      </th>
                      <th className="px-3 py-2 text-center font-medium text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.length > 0 ? (
                      products.map((product, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-3 py-3 font-medium text-gray-100">
                            {product.title}
                          </td>
                          <td className="px-3 py-3 text-gray-400 max-w-xs truncate">
                            {product.content}
                          </td>
                          <td className="px-3 py-3 text-gray-100 font-medium">
                            ${product.cost}
                          </td>
                          <td className="px-3 py-3">
                            {product.banner_image &&
                            typeof product.banner_image === "string" ? (
                              <Image
                                src={product.banner_image}
                                alt={product.title}
                                width={50}
                                height={50}
                                className="rounded-md shadow-sm object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditData(product)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-all"
                                title="Edit product"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id!)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-all"
                                title="Delete product"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <svg
                            className="w-12 h-12 text-gray-600 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-gray-400 font-medium">
                            No products yet
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Create your first product to get started
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
