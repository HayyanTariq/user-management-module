"use client";
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import { SignupPage } from "./SignupPage";

interface AuthSystemProps {
  logo: any;  // required
  title?: string;
  backgroundColor?: string;
  primaryColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
}

export default function AuthSystem(props: AuthSystemProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (mode === "login") {
    return (
      <LoginPage
        {...props}
        onGoToSignup={() => setMode("signup")}
      />
    );
  }

  return (
    <SignupPage
      {...props}
      onGoToLogin={() => setMode("login")}
    //   onGoBack={() => setMode("login")}
    />
  );
}
