import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const LoginOTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState("");
  const { otpSessionToken, identifier, deliveryMethod } = route.params;

  console.log("OTP Session Token Received:", otpSessionToken); // ✅ Debugging
  console.log("Identifier:", identifier, "Delivery Method:", deliveryMethod);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP.");
      return;
    }

    console.log("Sending OTP Verification Request with:", {
      otpSessionToken,
      otp,
      identifier,
    });

    try {
      const response = await fetch(`${API_URL}/auth/validate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otpSessionToken,
          otp,
          identifier,
        }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", data);

      // ✅ Ensure `data` and `data.data` exist before accessing tokens
      if (
        !data.success ||
        !data.data ||
        !data.data.accessToken ||
        !data.data.refreshToken
      ) {
        console.error("ERROR: Invalid response from backend!", data);
        Alert.alert("Error", "Invalid server response. Please try again.");
        return;
      }

      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      console.log("Storing Tokens:", { accessToken, refreshToken });

      // ✅ Ensure tokens are not undefined before storing
      if (!accessToken || !refreshToken) {
        throw new Error("Received undefined tokens from server.");
      }

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      Alert.alert("Success", "Login successful!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("OTP Verification Request Error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Two-Factor Authentication</Text>
      <Text style={styles.subtitleText}>
        Please enter the 6-digit OTP sent to your {deliveryMethod}.
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="000000"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={6}
        onChangeText={setOtp}
        value={otp}
      />

      <Pressable onPress={handleVerifyOTP} style={styles.button}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </Pressable>
    </View>
  );
};

export default LoginOTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    fontSize: 24,
    padding: 10,
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
