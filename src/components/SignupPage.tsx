// SignupPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface SignupPageProps {
  logo: any;
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  primaryColor?: string;
  onGoToLogin?: () => void;
  redirectTo?: string;
  onNavigateToHome?: () => void;
}

export function SignupPage({
  title = "Create your account",
  logo,
  backgroundColor = "#FFFFFF",
  titleColor = "#111827",
  cardShadowColor = "#000",
  primaryColor = "#22C55E",
  onGoToLogin,
  redirectTo = "/home",
  onNavigateToHome,
}: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { signUp, signInWithGoogle } = useAuth();

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID", // Replace with your Google Web Client ID
      offlineAccess: true,
    });
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setIsLoading(true);
      const result = await signInWithGoogle(userInfo.idToken!);
      if (result.success) {
        console.log("Google Sign-In successful, calling onNavigateToHome");
        onNavigateToHome?.();
      } else {
        setErrors((prev) => ({ ...prev, general: result.message || "Google Sign-In failed" }));
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setErrors((prev) => ({ ...prev, general: "Google Sign-In error" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (touched.name) {
      if (!text.trim()) {
        setErrors((prev) => ({ ...prev, name: "Full name is required" }));
      } else if (text.trim().length < 2) {
        setErrors((prev) => ({ ...prev, name: "Name must be at least 2 characters" }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      if (!text.trim()) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else if (!validateEmail(text.trim())) {
        setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      if (!text) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else if (!validatePassword(text)) {
        setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (touched.confirmPassword) {
      if (!confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password" }));
      } else if (text !== confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (touched.confirmPassword) {
      if (!text) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password" }));
      } else if (password !== text) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }));
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Full name is required" }));
    } else if (name.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: "Name must be at least 2 characters" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!validateEmail(email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    } else if (!validatePassword(password)) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    setTouched((prev) => ({ ...prev, confirmPassword: true }));
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password" }));
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSignUp = async () => {
    if (isLoading) return;

    let hasErrors = false;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "", general: "" };

    if (!name.trim()) {
      newErrors.name = "Full name is required";
      hasErrors = true;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Enter a valid email address";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(name.trim(), email.trim(), password);
      if (result.success) {
        console.log("Sign-Up successful, calling onNavigateToHome");
        if (onNavigateToHome) {
          onNavigateToHome();
        } else {
          console.log("No onNavigateToHome provided, redirect to:", redirectTo);
        }
      } else {
        setErrors((prev) => ({ ...prev, general: result.message || "Sign up failed." }));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({ ...prev, general: "Unexpected error occurred." }));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    validateEmail(email.trim()) &&
    validatePassword(password) &&
    password === confirmPassword &&
    name.trim().length >= 2;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titleOutside, { color: titleColor }]}>{title}</Text>

            <View style={[styles.card, { shadowColor: cardShadowColor }]}>
              {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

              {/* Name input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={handleNameChange}
                    onBlur={handleNameBlur}
                    autoCapitalize="words"
                    autoComplete="off"
                    editable={!isLoading}
                  />
                </View>
                {errors.name ? <Text style={styles.helperText}>{errors.name}</Text> : null}
              </View>

              {/* Email input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. yourname@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="off"
                    editable={!isLoading}
                  />
                </View>
                {errors.email ? <Text style={styles.helperText}>{errors.email}</Text> : null}
              </View>

              {/* Password input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    autoCapitalize="none"
                    autoComplete="off"
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                      style={styles.iconRight}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.helperText}>{errors.password}</Text> : null}
              </View>

              {/* Confirm Password input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    autoCapitalize="none"
                    autoComplete="off"
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                      style={styles.iconRight}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? <Text style={styles.helperText}>{errors.confirmPassword}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, isFormValid && !isLoading ? { backgroundColor: primaryColor } : styles.signUpDisabled]}
                onPress={handleSignUp}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.signUpText}>CREATE ACCOUNT</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or</Text>

            {/* Google Sign Up Button */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <AntDesign name="google" size={20} color="#EA4335" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={onGoToLogin}>
                <Text style={[styles.loginLink, { color: primaryColor }]}>SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "flex-start", paddingHorizontal: 24, paddingTop: 20 },
  inner: { width: "100%" },
  logo: { width: 80, height: 80, alignSelf: "center", marginBottom: 12 },
  titleOutside: { fontSize: 20, fontWeight: "600", marginBottom: 16, textAlign: "center", letterSpacing: 0.3 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
  },
  errorText: { color: "#DC2626", textAlign: "center", marginBottom: 8 },
  inputBox: { marginBottom: 16 },
  label: { color: "#374151", fontSize: 14, marginBottom: 6, fontWeight: "500" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  input: { flex: 1, height: 48, fontSize: 15, color: "#1F2937", fontWeight: "400" },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  helperText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 6,
    fontWeight: "500",
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpDisabled: { backgroundColor: "#D1D5DB" },
  signUpText: { color: "white", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
  orText: { textAlign: "center", color: "#6B7280", marginBottom: 16, fontSize: 14, fontWeight: "500" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
  loginRow: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  loginText: { color: "#6B7280", fontSize: 14 },
  loginLink: { fontWeight: "700", fontSize: 14 },
});