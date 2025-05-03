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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const EmailOTPVerification = () => {
  const router = useRouter();
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120);

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

  const handleVerifyEmailOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP.");
      return;
    }

    try {
      // Step 1: Verify email OTP
      const verifyResponse = await fetch(`${API_URL}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.success) {
        // Step 2: Get tempToken to call finalize-registration
        const tempToken = await AsyncStorage.getItem("tempToken");
        if (!tempToken) {
          Alert.alert("Error", "Temporary token not found.");
          return;
        }

        const decoded = JSON.parse(atob(tempToken.split(".")[1]));
        const userId = decoded.userId;

        // Step 3: Finalize registration (enable user, create courses, etc.)
        const finalizeResponse = await fetch(
          `${API_URL}/auth/finalize-registration?userId=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tempToken}`,
            },
          }
        );

        const finalizeData = await finalizeResponse.json();
        if (finalizeResponse.ok && finalizeData.success) {
          // ✅ Save real token for future auth-required screens
          await AsyncStorage.setItem("token", finalizeData.data.accessToken);
          await AsyncStorage.setItem(
            "refreshToken",
            finalizeData.data.refreshToken
          );

          router.replace("/record");
        } else {
          Alert.alert("Error", finalizeData.message || "Hata.");
        }
      } else {
        Alert.alert("Error", verifyData.message || "Kod doğrulanamadı.");
      }
    } catch (error) {
      Alert.alert("Hata", "Lütfen tekrar deneyin");
      console.error(error);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setTimer(120);

    try {
      const response = await fetch(
        `${API_URL}/auth/resend-verification-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Başarılı", "Kod tekrar gönderildi.");
      } else {
        Alert.alert("Hata", data.message || "Kod gönderilemedi.");
      }
    } catch (error) {
      Alert.alert("Hata", "Kod gönderilemedi.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Email Verification</Text>
      <Text style={styles.subtitleText}>
        Enter the 6-digit OTP sent to {email}.
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

      <Pressable onPress={handleVerifyEmailOTP} style={styles.button}>
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

export default EmailOTPVerification;

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
    marginBottom: 15,
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
