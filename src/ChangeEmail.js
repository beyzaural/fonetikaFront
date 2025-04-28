import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";
import { LinearGradient } from "expo-linear-gradient";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ChangeEmail = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldOtp, setOldOtp] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setOldEmail(payload.email);
      setToken(token);
    };
    load();
  }, []);

  const sendOtpToOld = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/email/send-old-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: oldEmail }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      Alert.alert("Başarılı", "OTP e-posta adresinize gönderildi.");
      setStep(1.5);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOldOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/email/verify-old`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: oldEmail,
          otp: oldOtp,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setStep(2);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtpToNew = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/email/send-new-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      Alert.alert("Başarılı", "OTP yeni e-posta adresinize gönderildi.");
      setStep(3);
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/email/verify-new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldEmail,
          newEmail,
          otp: newOtp,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      Alert.alert("Başarılı", "E-posta adresiniz güncellendi.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8f8f8", "#ffffff"]}
        style={styles.backgroundGradient}
      />
      {/* Top Section */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Mailini Değiştir</Text>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {step === 1 && (
          <>
            <Text style={styles.label}>Mevcut E-posta:</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.emailText}>{oldEmail}</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={sendOtpToOld}
              disabled={loading}
            >
              <LinearGradient
                colors={["#0a7ea4", "#0a7ea4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kod Gönder</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {step === 1.5 && (
          <>
            <Text style={styles.label}>
              Mevcut e-posta'nıza gönderilen kodu girin:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={oldOtp}
                onChangeText={setOldOtp}
                keyboardType="numeric"
                placeholder="Size gönderilen kodu giriniz"
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={verifyOldOtp}
              disabled={loading}
            >
              <LinearGradient
                colors={["#0a7ea4", "#0a7ea4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Doğrula</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.label}>Yeni E-posta:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                style={styles.input}
                placeholder="Yeni e-posta adresiniz"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={sendOtpToNew}
              disabled={loading}
            >
              <LinearGradient
                colors={["#0a7ea4", "#0a7ea4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kod Gönder</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.label}>
              Yeni e-posta adresinize gönderilen kodu girin
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={newOtp}
                onChangeText={setNewOtp}
                style={styles.input}
                placeholder="Mailinize gönderilen kodu giriniz"
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={verifyOtp}
              disabled={loading}
            >
              <LinearGradient
                colors={["#0a7ea4", "#0a7ea4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Doğrula</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(214, 213, 179, 0.2)",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  emailContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
  },
  emailText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#0a7ea4",
  },
  buttonGradient: {
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ChangeEmail;
