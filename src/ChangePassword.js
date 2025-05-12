import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "./utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavBar from "./BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";

const ChangePassword = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8080";
  
  useEffect(() => {
    const loadEmail = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    };
    loadEmail();
  }, []);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/auth/password/forgot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      Alert.alert("Başarılı", "Kod e-posta adresinize gönderildi.");
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
        `${API_BASE}/auth/password/validate-reset-otp`,
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
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/auth/password/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken, newPassword }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      await logout();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e) {
      Alert.alert("Hata", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Şifre Değiştir</Text>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {step === 1 && (
            <>
              <Text style={styles.label}>E-posta:</Text>
              <View style={styles.card}>
                <LinearGradient
                  colors={["#d6d5b3", "#FFFFFF"]}
                  start={{ x: 4, y: 0 }}
                  end={{ x: 0, y: 0.2 }}
                  style={styles.cardGradient}
                >
                  <Text style={styles.emailText}>{email}</Text>
                </LinearGradient>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleSendOtp}
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
                    <Text style={styles.buttonText}>Kodu Gönder</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Kodu Girin</Text>
              <View style={styles.card}>
                <LinearGradient
                  colors={["#d6d5b3", "#FFFFFF"]}
                  start={{ x: 4, y: 0 }}
                  end={{ x: 0, y: 0.2 }}
                  style={styles.cardGradient}
                >
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    placeholder="Mailinize gönderilen kodu giriniz"
                    placeholderTextColor="#666"
                  />
                </LinearGradient>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleVerifyOtp}
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

          {step === 3 && (
            <>
              <Text style={styles.label}>Yeni Şifrenizi Girin</Text>
              <View style={styles.card}>
                <LinearGradient
                  colors={["#d6d5b3", "#FFFFFF"]}
                  start={{ x: 4, y: 0 }}
                  end={{ x: 0, y: 0.2 }}
                  style={styles.cardGradient}
                >
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="Yeni şifrenizi giriniz"
                    placeholderTextColor="#666"
                  />
                </LinearGradient>
              </View>
              <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
              <View style={styles.card}>
                <LinearGradient
                  colors={["#d6d5b3", "#FFFFFF"]}
                  start={{ x: 4, y: 0 }}
                  end={{ x: 0, y: 0.2 }}
                  style={styles.cardGradient}
                >
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Yeni şifrenizi tekrar giriniz"
                    placeholderTextColor="#666"
                  />
                </LinearGradient>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleResetPassword}
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
                    <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 15,
    position: "relative",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  card: {
    width: "100%",
    height: 60,
    marginBottom: 30,
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  emailText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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

export default ChangePassword;
