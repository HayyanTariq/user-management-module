"use client";
import React, { useState } from "react";
import { SignupPage } from "./SignupPage";
import LoginPage from "./LoginPage";

interface AuthSystemProps {
  logo: any;
  title?: string;
  backgroundColor?: string;
  primaryColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  redirectTo?: string;
}

export default function AuthSystem({
  logo,
  title = "Sign in to your account",
  backgroundColor = "#FFFFFF",
  primaryColor = "#22C55E",
  titleColor = "#111827",
  cardShadowColor = "#000",
  redirectTo = "/home",
}: AuthSystemProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return mode === "login" ? (
    <LoginPage
      logo={logo}
      title={title}
      backgroundColor={backgroundColor}
      primaryColor={primaryColor}
      titleColor={titleColor}
      cardShadowColor={cardShadowColor}
      redirectTo={redirectTo}
      onGoToSignup={() => setMode("signup")}
    />
  ) : (
    <SignupPage
      logo={logo}
      backgroundColor={backgroundColor}
      primaryColor={primaryColor}
      titleColor={titleColor}
      cardShadowColor={cardShadowColor}
      redirectTo={redirectTo}
      onGoToLogin={() => setMode("login")}
    />
  );
}