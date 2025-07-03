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
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

interface LoginPageProps {
  logo: any; // required
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  primaryColor?: string;
  onGoToSignup?: () => void;
}

export default function LoginPage({
  title = "Sign in to your account",
  logo,
  backgroundColor = "#FFFFFF",
  titleColor = "#111827",
  cardShadowColor = "#000",
  primaryColor = "#22C55E",
  onGoToSignup,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const { signIn } = useAuth();
  const validateEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

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
      if (!result.success) {
        setErrors((prev) => ({ ...prev, general: result.message || "Sign in failed." }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, general: "Unexpected error occurred." }));
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
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. yourname@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>
              {/* Password input */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" style={styles.iconRight} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.signInButton, isFormValid && !isLoading ? { backgroundColor: primaryColor } : styles.signInDisabled]}
                onPress={handleSignIn}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.signInText}>SIGN IN</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}><AntDesign name="google" size={22} color="#EA4335" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}><FontAwesome name="facebook" size={22} color="#1877F2" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}><FontAwesome name="github" size={22} color="black" /></TouchableOpacity>
            </View>

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
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  inner: { width: "100%" },
  logo: { width: 100, height: 120, alignSelf: "center", marginBottom: 16 },
  titleOutside: { fontSize: 18, fontWeight: "400", marginBottom: 16, textAlign: "center" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  errorText: { color: "#DC2626", textAlign: "center", marginBottom: 12 },
  inputBox: { marginBottom: 16 },
  label: { color: "#4B5563", fontSize: 14, marginBottom: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: { flex: 1, height: 48, fontSize: 16, color: "#111827" },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
  signInButton: { borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 8, width: "100%" },
  signInDisabled: { backgroundColor: "#D1D5DB" },
  signInText: { color: "white", fontSize: 16, fontWeight: "600" },
  orText: { textAlign: "center", color: "#6B7280", marginBottom: 16 },
  socialRow: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
  socialButton: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  signupRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  signupText: { color: "#6B7280" },
  signupLink: { fontWeight: "600" },
});
