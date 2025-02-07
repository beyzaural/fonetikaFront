import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const OTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState("");
  const { phone, tempToken, email, otpSessionToken, isLogin } = route.params;
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120); // 30 seconds cooldown

  useEffect(() => {
    let countdown;
    if (resendDisabled) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP.");
      return;
    }

    try {
      let endpoint = isLogin ? "/auth/validate-otp" : "/auth/verify-phone";
      let requestBody = isLogin
        ? { otpSessionToken, otp } // Login OTP verification
        : { phone, otp }; // Registration OTP verification

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", data);

      if (response.ok) {
        if (isLogin) {
          Alert.alert("Success", "OTP verified successfully!");
          navigation.navigate("Home"); // ✅ Login Success → Go to Home
        } else {
          navigation.navigate("EmailVerification", { email, tempToken }); // ✅ Registration Success → Go to Email Verification
        }
      } else {
        Alert.alert("Error", data.message || "OTP verification failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setTimer(120); // Reset timer to 2 minutes

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json(); // ✅ Parse JSON safely
      if (data.success) {
        Alert.alert("Success", data.message);
      } else {
        Alert.alert("Error", data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while resending OTP.");
      console.error("OTP Resend Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {isLogin ? "Verify Your Login" : "Verify Your Phone Number"}
      </Text>
      <Text style={styles.subtitleText}>
        Please enter the 6-digit OTP sent to your{" "}
        {isLogin ? "email/phone" : "phone"}.
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
        <Text style={styles.buttonText}>Verify</Text>
      </Pressable>

      <Pressable
        onPress={handleResendOTP}
        style={[
          styles.resendButton,
          resendDisabled && { backgroundColor: "#ccc" },
        ]}
        disabled={resendDisabled}
      >
        <Text style={styles.buttonText}>
          {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </Text>
      </Pressable>
    </View>
  );
};

export default OTPVerification;

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
  resendButton: {
    backgroundColor: "#000",
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
