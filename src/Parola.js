import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Parola = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-load email from local storage
  useEffect(() => {
    const loadEmail = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.sub);
    };
    loadEmail();
  }, []);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/auth/password/forgot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("Başarılı", "OTP e-posta adresinize gönderildi.");
      setStep(2);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/auth/password/validate-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, otp }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setResetToken(data.data.resetToken);
      setStep(3);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/auth/password/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken, newPassword }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifre Değiştir</Text>

      {step === 1 && (
        <>
          <Text style={styles.label}>E-posta: {email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>OTP Gönder</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>OTP'yi Girin</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Doğrula</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.label}>Yeni Şifrenizi Girin</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default Parola;
