import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ResetPasswordScreen = ({ route, navigation }) => {
  const { resetToken } = route.params || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!password) {
      Alert.alert("Hata", "Lütfen yeni parolanızı girin.");
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen boş alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Parolalar uyuşmuyor.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Başarı", "Parolanız değiştirildi.");
        navigation.navigate("Login");
        Alert.alert("Error", data.message || "Parola değiştirilemedi.");
      }
    } catch (error) {
      Alert.alert("Hata", "Parola değiştirilemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parola sıfırlama</Text>
      <Text style={styles.subtitle}>Yeni parolanızı girin.</Text>

      <TextInput
        style={styles.input}
        placeholder="Yeni parola"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TextInput
        style={styles.input}
        placeholder="Yeni parola (tekrar)"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      <Pressable onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>Parolayı sıfırla</Text>
      </Pressable>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
