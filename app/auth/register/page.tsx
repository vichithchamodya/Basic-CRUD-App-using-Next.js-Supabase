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

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-100">
              Create Account
            </h2>
            <p className="text-gray-400">Join us today and get started</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  {...register("fullName")}
                />
                <p className="text-red-400 text-sm mt-1">
                  {errors.fullName?.message}
                </p>
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                  {...register("email")}
                />
                <p className="text-red-400 text-sm mt-1">
                  {errors.email?.message}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                />
                <p className="text-red-400 text-sm mt-1">
                  {errors.phone?.message}
                </p>
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Gender
                </label>
                <select className="input-field" {...register("gender")}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <p className="text-red-400 text-sm mt-1">
                  {errors.gender?.message}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <p className="text-red-400 text-sm mt-1">
                  {errors.password?.message}
                </p>
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  {...register("confirm_password")}
                />
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirm_password?.message}
                </p>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
