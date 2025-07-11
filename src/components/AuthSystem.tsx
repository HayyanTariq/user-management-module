"use client";
import React, { useState } from "react";

import LoginPage from "./LoginPage";
import { SignupPage } from "./SignupPage";


interface AuthSystemProps {
  logo: any;
  title?: string;
  backgroundColor?: string;
  primaryColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  redirectTo?: string;
  onNavigateToHome?: () => void;
}

export default function AuthSystem({
  logo,
  title = "Sign in to your account",
  backgroundColor = "#FFFFFF",
  primaryColor = "#22C55E",
  titleColor = "#111827",
  cardShadowColor = "#000",
  redirectTo = "/home",
  onNavigateToHome,
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
      onNavigateToHome={onNavigateToHome}
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
      onNavigateToHome={onNavigateToHome}
    />
  );
}