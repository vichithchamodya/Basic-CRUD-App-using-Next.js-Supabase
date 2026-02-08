"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppUtils";

const formSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid Email Value")
    .required("Email value is required"),
  phone: yup.string().required("Phone number is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Gender is not allowed"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password is of minimum 6 characters"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Password didn't match"),
});

export default function Register() {
  const router = useRouter();
  const { setIsLoading } = myAppHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (formdata: {
    fullName: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
  }) => {
    //console.log(formdata)
    setIsLoading(true);
    const { fullName, email, password, gender, phone } = formdata;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          gender,
          phone,
        },
      },
    });

    if (error) {
      toast.error("Failed to register user");
    } else {
      toast.success("User registered successfully");
      setIsLoading(false);
      router.push("/auth/login");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 mt-12">
        <h2 className="text-center text-3xl font-bold mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("fullName")}
              />
              <p className="text-red-600 text-sm mt-1">
                {errors.fullName?.message}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              <p className="text-red-600 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("phone")}
              />
              <p className="text-red-600 text-sm mt-1">
                {errors.phone?.message}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("gender")}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-red-600 text-sm mt-1">
                {errors.gender?.message}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              <p className="text-red-600 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("confirm_password")}
              />
              <p className="text-red-600 text-sm mt-1">
                {errors.confirm_password?.message}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <a
            onClick={handleLoginRedirect}
            className="text-blue-600 hover:underline cursor-pointer font-semibold"
          >
            Login
          </a>
        </p>
      </div>

      <Footer />
    </>
  );
}
