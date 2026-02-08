"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";

export const dynamic = 'force-dynamic';

export default function Profile() {
  const { userProfile } = myAppHook();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-5 text-gray-100">Profile</h2>
        {userProfile ? (
          <div className="card">
            <p className="mb-3 text-gray-100">
              <strong className="font-semibold text-gray-300">Name:</strong>{" "}
              {userProfile?.name}
            </p>
            <p className="mb-3 text-gray-100">
              <strong className="font-semibold text-gray-300">Email:</strong>{" "}
              {userProfile?.email}
            </p>
            <p className="mb-3 text-gray-100">
              <strong className="font-semibold text-gray-300">Phone:</strong>{" "}
              {userProfile?.phone}
            </p>
            <p className="text-gray-100">
              <strong className="font-semibold text-gray-300">Gender:</strong>{" "}
              {userProfile?.gender}
            </p>
          </div>
        ) : (
          <p className="text-center mt-12 text-gray-400">No Profile Found</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
