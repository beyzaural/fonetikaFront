import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;
import jwtDecode from "jwt-decode";

const EmailVerification = ({ navigation, route }) => {
  const { email } = route.params;
  const [tempToken, setTempToken] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120); // 2 minutes cooldown

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("tempToken");
      if (!storedToken) {
        Alert.alert(
          "Hata",
          "Kimlik doğrulama eksik. Lütfen tekrar kayıt olun."
        );
        navigation.navigate("Register"); // veya giriş ekranı
      } else {
        setTempToken(storedToken);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkVerificationStatus(); // checks every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

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

  const decodeToken = (token) => {
    try {
      console.log("Token to decode:", token); // Log the token for debugging
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const checkVerificationStatus = async () => {
    if (!tempToken) return;

    try {
      const response = await fetch(
        `${API_URL}/auth/check-verification?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.data?.verified) {
        console.log("✅ Email verified! Proceeding to finalize...");
        finalizeRegistration(); // ✅ direkt burada çağır
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  const handleResendEmail = async () => {
    setResendDisabled(true);
    setTimer(120); // Reset timer to 2 minutes

    try {
      console.log("Attempting to resend verification email to:", email);
      const response = await fetch(
        `${API_URL}/auth/resend-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("Resend Email Response:", data);
      if (data.success) {
        Alert.alert("Success", "A new verification email has been sent.");
      } else {
        Alert.alert("Error", data.message || "Failed to resend email.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while resending email.");
      console.error("Email Resend Error:", error);
    }
  };

  const finalizeRegistration = async () => {
    const decoded = decodeToken(tempToken);
    if (!decoded || !decoded.userId) {
      console.error("Invalid token: Cannot extract userId");
      return;
    }
    const userId = decoded.userId; // Extracted userId
    try {
      console.log("Finalizing Registration with Token:", tempToken); // Debug
      const response = await fetch(
        `${API_URL}/auth/finalize-registration?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("Finalize Registration Response:", data);
      if (data.success) {
        await AsyncStorage.removeItem("tempToken"); // optional cleanup
        navigation.navigate("GoalSelection");
      } else {
        console.error("Finalize Registration Failed:", data.message);
      }
    } catch (error) {
      console.error("Error finalizing registration:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Verify Your Email</Text>
      <Text style={styles.subtitleText}>
        A verification link has been sent to {email}. Please check your email.
      </Text>

      <ActivityIndicator size="large" color="black" />

      <Text style={styles.pendingText}>Waiting for verification...</Text>

      <Pressable
        onPress={handleResendEmail}
        style={[styles.button, resendDisabled && { backgroundColor: "#ccc" }]}
        disabled={resendDisabled}
      >
        <Text style={styles.buttonText}>
          {resendDisabled ? `Resend in ${timer}s` : "Resend Verification Email"}
        </Text>
      </Pressable>
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  pendingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
