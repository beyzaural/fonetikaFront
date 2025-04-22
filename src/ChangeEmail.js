import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ChangeEmail = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otpOld, setOtpOld] = useState("");
  const [otpNew, setOtpNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadUserInfo = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setOldEmail(payload.email);
      setToken(token);
    };
    loadUserInfo();
  }, []);

  const sendOtpToOld = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/email/send-old-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: oldEmail }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("OTP Gönderildi", `${oldEmail} adresinize OTP gönderildi.`);
      setStep(2);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOldOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/email/verify-old`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: oldEmail, otp: otpOld }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("Doğrulandı", "Eski e-posta doğrulandı.");
      setStep(3);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtpToNewEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/email/send-new-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("OTP Gönderildi", "Yeni e-posta adresinize OTP gönderildi.");
      setStep(4);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyNewOtpAndChangeEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/email/verify-new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldEmail,
          newEmail,
          otp: otpNew,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("Başarılı", "E-posta adresiniz güncellendi.");
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButton}>
            <Image
              source={require("../assets/images/backspace.png")}
              style={styles.backIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mailini Değiştir</Text>
        </View>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.label}>Mevcut E-posta:</Text>
          <Text style={styles.emailText}>{oldEmail}</Text>
          <TouchableOpacity style={styles.button} onPress={sendOtpToOld}>
            <Text style={styles.buttonText}>OTP Gönder</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>Eski E-posta OTP</Text>
          <TextInput
            value={otpOld}
            onChangeText={setOtpOld}
            style={styles.input}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={verifyOldOtp}>
            <Text style={styles.buttonText}>Doğrula</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.label}>Yeni E-posta</Text>
          <TextInput
            value={newEmail}
            onChangeText={setNewEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={sendOtpToNewEmail}>
            <Text style={styles.buttonText}>Devam Et</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.label}>Yeni E-posta OTP</Text>
          <TextInput
            value={otpNew}
            onChangeText={setOtpNew}
            style={styles.input}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={verifyNewOtpAndChangeEmail}
          >
            <Text style={styles.buttonText}>E-posta Güncelle</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  label: { fontSize: 18, marginBottom: 10 },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
    fontWeight: "500",
  },
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
