"use client";

import Link from "next/link";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
  const router = useRouter();

  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("User logged out successfully");
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            href={isLoggedIn ? "/auth/dashboard" : "/auth/login"}
            className="text-white text-xl font-bold tracking-tight hover:text-blue-400 transition"
          >
            Basic CRUD App
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/profile"
                className="text-gray-300 hover:text-white transition"
              >
                Profile
              </Link>
              <button
                onClick={handleUserLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
