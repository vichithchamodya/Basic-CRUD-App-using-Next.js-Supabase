"use client";

import Loader from "@/components/Loader";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

interface AppUtilsType {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  setAuthToken: (state: string | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: (state: UserProfile | null) => void;
  setIsLoading: (state: boolean) => void;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<null | string>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userProfileStr = localStorage.getItem("user_profile");
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
      if (userProfileStr) {
        setUserProfile(JSON.parse(userProfileStr));
      }
    }
  }, []);

  return (
    <AppUtilsContext.Provider
      value={{
        isLoggedIn,
        setAuthToken,
        setIsLoggedIn,
        userProfile,
        setUserProfile,
        setIsLoading,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AppUtilsContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppUtilsContext);
  if (!context) {
    throw new Error(
      "App Utils functions must be wrapped inside AppUtils Provider",
    );
  }
  return context;
};
