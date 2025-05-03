import React, { useState } from "react";
import Constants from "expo-constants";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();
      if (data.success && data.data?.otpSessionToken && data.data?.identifier) {
        router.push({
          pathname: "/reset-otp-verification",
          params: { identifier: email },
        });
      } else {
        Alert.alert("Error", data.message || "Could not start reset flow.");
      }
    } catch (error) {
      Alert.alert("Error", "Request failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a one-time code to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <Pressable onPress={handleForgotPassword} style={styles.button}>
        <Text style={styles.buttonText}>Send OTP to Email</Text>
      </Pressable>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
