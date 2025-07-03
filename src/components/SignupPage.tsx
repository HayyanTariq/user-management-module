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
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

interface SignupPageProps {
  logo: any;
  onGoToLogin?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  cardShadowColor?: string;
  primaryColor?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  logo,
  onGoToLogin,
  backgroundColor = "#FFFFFF",
  titleColor = "#111827",
  cardShadowColor = "#000",
  primaryColor = "#22C55E",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", terms: "", general: "" });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const { signUp } = useAuth();
  const validateEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);

  const handleSignUp = async () => {
    if (isLoading) return;
    let hasErrors = false;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "", terms: "", general: "" };

    if (!name.trim()) { newErrors.name = "Name is required"; hasErrors = true; }
    if (!email.trim()) { newErrors.email = "Email is required"; hasErrors = true; }
    else if (!validateEmail(email.trim())) { newErrors.email = "Enter valid @gmail.com email"; hasErrors = true; }

    if (!password) { newErrors.password = "Password is required"; hasErrors = true; }
    else if (password.length < 6) { newErrors.password = "Must be at least 6 chars"; hasErrors = true; }

    if (!confirmPassword) { newErrors.confirmPassword = "Confirm password"; hasErrors = true; }
    else if (password !== confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; hasErrors = true; }

    if (!agreeToTerms) { newErrors.terms = "Agree to terms"; hasErrors = true; }

    if (hasErrors) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(name.trim(), email.trim(), password);
      if (result.success) {
        setSuccessMessage("Account created! Redirecting...");
      } else {
        setErrors((prev) => ({ ...prev, general: result.message || "Sign up failed" }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, general: "Unexpected error" }));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && email && validateEmail(email) && password.length >= 6 && confirmPassword === password && agreeToTerms;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titleOutside, { color: titleColor }]}>Create your account</Text>

            <View style={[styles.card, { shadowColor: cardShadowColor }]}>
              {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
              {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

              {/* Name */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Jon Smith"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

              {/* Email */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>

              {/* Password */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>

              {/* Confirm Password */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>

              {/* Terms */}
              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    agreeToTerms ? { backgroundColor: primaryColor } : styles.checkboxInactive,
                  ]}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                  disabled={isLoading}
                >
                  {agreeToTerms && <Ionicons name="checkmark" size={12} color="white" />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I agree to <Text style={[styles.link, { color: primaryColor }]}>terms & policy</Text>
                </Text>
              </View>
              {errors.terms ? <Text style={styles.inputError}>{errors.terms}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  isFormValid && !isLoading ? { backgroundColor: primaryColor } : styles.signInDisabled,
                ]}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  inputBox: { marginBottom: 16 },
  label: { color: "#4B5563", fontSize: 14, marginBottom: 4 },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { width: 16, height: 16, borderRadius: 4, justifyContent: "center", alignItems: "center", marginRight: 8 },
  checkboxInactive: { borderWidth: 1, borderColor: "#9CA3AF" },
  termsText: { color: "#4B5563", fontSize: 12 },
  link: { fontWeight: "500" },
  signUpButton: { borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 8, width: "100%" },
  signInDisabled: { backgroundColor: "#D1D5DB" },
  signInText: { color: "white", fontSize: 16, fontWeight: "600" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  signupText: { color: "#6B7280" },
  signupLink: { fontWeight: "600" },
  success: { color: "#16A34A", textAlign: "center", marginBottom: 12 },
  errorText: { color: "#DC2626", textAlign: "center", marginBottom: 12 },
  inputError: { color: "#DC2626", fontSize: 12, marginTop: -8, marginBottom: 8 },
});

