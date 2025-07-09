"use client";
import React, { useState } from "react";
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
import { useRouter } from "expo-router";

interface LoginPageProps {
  logo: any;
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  primaryColor?: string;
  onGoToSignup?: () => void;
  redirectTo?: string;
}

export default function LoginPage({
  title = "Sign in to your account",
  logo,
  backgroundColor = "#FFFFFF",
  titleColor = "#111827",
  cardShadowColor = "#000",
  primaryColor = "#22C55E",
  onGoToSignup,
  redirectTo = "/home",
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const { signIn } = useAuth();
  const router = useRouter();
  const validateEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      if (!text.trim()) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!validateEmail(text.trim())) {
        setErrors(prev => ({ ...prev, email: "Enter a valid @gmail.com email" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      if (!text) {
        setErrors(prev => ({ ...prev, password: "Password is required" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
    } else if (!validateEmail(email.trim())) {
      setErrors(prev => ({ ...prev, email: "Enter a valid @gmail.com email" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleSignIn = async () => {
    if (isLoading) return;
    let hasErrors = false;
    const newErrors = { email: "", password: "", general: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Enter a valid @gmail.com email";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.success) {
        router.push(redirectTo);
      } else {
        setErrors(prev => ({ ...prev, general: result.message || "Sign in failed." }));
      }
    } catch {
      setErrors(prev => ({ ...prev, general: "Unexpected error occurred." }));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() && password && validateEmail(email.trim());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titleOutside, { color: titleColor }]}>{title}</Text>

            <View style={[styles.card, { shadowColor: cardShadowColor }]}>
              {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

              {/* Email input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. yourname@gmail.com"
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
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" style={styles.iconRight} />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.helperText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.signInButton, isFormValid && !isLoading ? { backgroundColor: primaryColor } : styles.signInDisabled]}
                onPress={handleSignIn}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.signInText}>SIGN IN</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or</Text>

            {/* Google Sign In Button */}
            <TouchableOpacity style={styles.googleButton}>
              <AntDesign name="google" size={20} color="#EA4335" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onGoToSignup}>
                <Text style={[styles.signupLink, { color: primaryColor }]}>SIGN UP</Text>
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
  signInButton: {
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
  signInDisabled: { backgroundColor: "#D1D5DB" },
  signInText: { color: "white", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
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
  signupRow: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  signupText: { color: "#6B7280", fontSize: 14 },
  signupLink: { fontWeight: "700", fontSize: 14 },
});