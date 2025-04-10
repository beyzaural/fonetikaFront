import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ResetOTPVerification = ({ navigation, route }) => {
  const { identifier } = route.params;
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Hata!", "Lütfen altı haneli kodu giriniz.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/auth/password/validate-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, otp }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.data?.resetToken) {
        navigation.navigate("ResetPasswordScreen", {
          resetToken: data.data.resetToken,
        });
      } else {
        Alert.alert("Hata", data.message || "Geçersiz kod.");
      }
    } catch (error) {
      Alert.alert("Hata", "Kod doğrulanamadı, tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setTimer(120);

    try {
      const response = await fetch(`${API_URL}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Başarı", "Tek seferlik kod mailinize gönderildi.");
      } else {
        Alert.alert("Error", data.message || "Tek seferlik kod gönderilemedi.");
      }
    } catch (error) {
      Alert.alert("Hata", "Tek seferlik kod gönderilemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Verify OTP</Text>
      <Text style={styles.subtitleText}>
        Mailinize gönderilen altı haneli tek seferlik kodu giriniz.
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

      <Pressable
        onPress={handleVerifyOTP}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Doğrula</Text>
        )}
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
          {resendDisabled
            ? `Kodu ${timer}s saniye içinde bir daha gönder`
            : "Tekrar gönder"}
        </Text>
      </Pressable>
    </View>
  );
};

export default ResetOTPVerification;

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
