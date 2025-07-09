"use client";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";

interface SignupPageProps {
  logo: any;
  onGoToLogin?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  primaryColor?: string;
  redirectTo?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  logo,
  onGoToLogin,
  backgroundColor = "#FFFFFF",
  titleColor = "#111827",
  cardShadowColor = "#000",
  primaryColor = "#22C55E",
  redirectTo = "/home",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", terms: "", general: "" });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const { signUp } = useAuth();
  const router = useRouter();
  const validateEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

  const handleNameChange = (text: string) => {
    setName(text);
    if (touched.name) {
      if (!text.trim()) {
        setErrors(prev => ({ ...prev, name: "Name is required" }));
      } else {
        setErrors(prev => ({ ...prev, name: "" }));
      }
    }
  };

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
      } else if (text.length < 6) {
        setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }

    if (touched.confirmPassword && confirmPassword) {
      if (text !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (touched.confirmPassword) {
      if (!text) {
        setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
      } else if (text !== password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
    } else {
      setErrors(prev => ({ ...prev, name: "" }));
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
    } else if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
    } else if (confirmPassword !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSignUp = async () => {
    if (isLoading) return;
    let hasErrors = false;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "", terms: "", general: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }
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
    } else if (password.length < 6) {
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

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and policy";
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
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => router.push(redirectTo), 1000);
      } else {
        setErrors(prev => ({ ...prev, general: result.message || "Sign up failed. Please try again." }));
      }
    } catch {
      setErrors(prev => ({ ...prev, general: "An unexpected error occurred. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && validateEmail(email.trim()) && password.length >= 6 && confirmPassword === password && agreeToTerms;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inner}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.titleOutside, { color: titleColor }]}>Create your account</Text>

          <View style={[styles.card, { shadowColor: cardShadowColor }]}>
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
            {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

            {/* Name */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Name</Text>
              <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Jon Smith"
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

            {/* Email */}
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
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="off"
                  editable={!isLoading}
                />
              </View>
              {errors.email ? <Text style={styles.helperText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" style={styles.iconRight} />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.helperText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.iconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                  <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" style={styles.iconRight} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.helperText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreeToTerms ? { backgroundColor: primaryColor } : styles.checkboxInactive]}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                disabled={isLoading}
              >
                {agreeToTerms && <Ionicons name="checkmark" size={12} color="white" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={[styles.link, { color: primaryColor }]}>terms & policy</Text>
              </Text>
            </View>
            {errors.terms ? <Text style={styles.helperText}>{errors.terms}</Text> : null}

            <TouchableOpacity
              style={[styles.signUpButton, isFormValid && !isLoading ? { backgroundColor: primaryColor } : styles.signInDisabled]}
              onPress={handleSignUp}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.signInText}>SIGN UP</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={onGoToLogin}>
              <Text style={[styles.signupLink, { color: primaryColor }]}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  inner: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: "center",
  },
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
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 6, justifyContent: "center", alignItems: "center", marginRight: 12 },
  checkboxInactive: { borderWidth: 1.5, borderColor: "#9CA3AF" },
  termsText: { color: "#4B5563", fontSize: 14, lineHeight: 20 },
  link: { fontWeight: "600" },
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
  signInDisabled: { backgroundColor: "#D1D5DB" },
  signInText: { color: "white", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
  signupRow: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  signupText: { color: "#6B7280", fontSize: 14 },
  signupLink: { fontWeight: "700", fontSize: 14 },
  success: { color: "#16A34A", textAlign: "center", marginBottom: 8, fontSize: 15, fontWeight: "600" },
  errorText: { color: "#EF4444", textAlign: "center", marginBottom: 8, fontSize: 15, fontWeight: "500" },
});