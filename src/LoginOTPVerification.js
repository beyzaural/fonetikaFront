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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const LoginOTPVerification = ({ navigation, route }) => {
  const { otpSessionToken, identifier, deliveryMethod, email, password } =
    route.params;

  const [currentIdentifier, setCurrentIdentifier] = useState(identifier);
  const [currentOtpSessionToken, setCurrentOtpSessionToken] =
    useState(otpSessionToken);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [currentDeliveryMethod, setCurrentDeliveryMethod] =
    useState(deliveryMethod);

  const deliveryMethodMapping = {
    phone: "telefon",
    email: "e-posta",
  };

  const otherMethod = currentDeliveryMethod === "phone" ? "email" : "phone";

  useEffect(() => {
    const timer = setTimeout(() => setResendEnabled(true), 120000);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli tek seferlik kodu girin.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/validate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: currentIdentifier, otp }),
      });

      const data = await response.json();
      if (
        !data.success ||
        !data.data?.accessToken ||
        !data.data?.refreshToken
      ) {
        Alert.alert("Hata", "Yanlış kod. Lütfen tekrar girin.");
        return;
      }

      if (data.data?.accessToken) {
        await AsyncStorage.setItem("token", data.data.accessToken); // ✅ Store as "token"
        console.log("Token stored successfully:", data.data.accessToken);
      } else {
        console.warn("No token received after OTP verification");
      }

      Alert.alert("Başarı", "Giriş Başarılı!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu lütfen tekrar deneyiniz.");
    }
  };

  const handleResendOTP = async (newMethod = currentDeliveryMethod) => {
    if (!resendEnabled) return;
    setLoading(true);
    setResendEnabled(false);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deliveryMethod: newMethod }),
      });

      const data = await response.json();
      if (
        data.success &&
        data.data &&
        data.data.otpSessionToken &&
        data.data.identifier
      ) {
        setCurrentOtpSessionToken(data.data.otpSessionToken);
        setCurrentIdentifier(data.data.identifier);
        setCurrentDeliveryMethod(newMethod);

        Alert.alert("Başarı", `Tek seferlik kod ${newMethod} ile gönderildi`);
        setTimeout(() => setResendEnabled(true), 120000);
      } else {
        Alert.alert("Hata", data.message || "Kod gönderilemedi.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Two-Factor Authentication</Text>
      <Text style={styles.subtitleText}>
        Please enter the 6-digit OTP sent to your {currentDeliveryMethod}.
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

      <Pressable
        onPress={() => handleResendOTP(currentDeliveryMethod)}
        style={[
          styles.secondaryButton,
          (!resendEnabled || loading) && styles.disabledButton,
        ]}
        disabled={!resendEnabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Tek seferlik kod {deliveryMethodMapping[currentDeliveryMethod]} ile
            gönder
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => handleResendOTP(otherMethod)}
        style={[
          styles.secondaryButton,
          (!resendEnabled || loading) && styles.disabledButton,
        ]}
        disabled={!resendEnabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Tek seferlik kod {deliveryMethodMapping[otherMethod]} ile gönder
          </Text>
        )}
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
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "gray",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
