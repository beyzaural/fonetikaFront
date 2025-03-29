import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("phone"); // Default to phone

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen mail ve şifrenizi giriniz.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deliveryMethod }),
      });

      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem("token", data.token); // ✅ Save token
        console.log("Token stored successfully:", data.token);
      } else {
        console.warn("No token received in login response"); // ✅ Log missing token
      }
      if (!response.ok) {
        console.error("Login Error:", data); // ✅ Log error response
        Alert.alert(
          "Giriş Başarısız!",
          data.message || "Yanlış mail ya da şifre."
        );
        return;
      }

      const otpSessionToken = data.data.otpSessionToken;
      const identifier = data.data.identifier;

      navigation.navigate("LoginOTPVerification", {
        otpSessionToken: otpSessionToken,
        identifier: identifier,
        deliveryMethod: deliveryMethod,
        email: email,
        password: password,
      });
    } catch (error) {
      Alert.alert(
        "Giriş Başarısız!",
        "Yanlış mail ya da şifre, lütfen tekrar deneyiniz."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Image
          source={require("../assets/images/login2.png")}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.titleText}>Hesabınıza giriş yapın </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}> Email </Text>
          <TextInput
            placeholder="Mail adresinizi girin."
            style={styles.textInputStyle}
            placeholderTextColor="#888"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}> Password </Text>
          <TextInput
            placeholder="Şifrenizi girin."
            style={styles.textInputStyle}
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* Forgot Password Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.forgotPasswordText}>Şifrenizi mi unuttunuz?</Text>
        </TouchableOpacity>

        {/* Delivery Method Selection */}
        <View style={{ marginBottom: 10 }}>
          <Text
            style={[
              styles.labelText,
              { textAlign: "center", marginBottom: 10 },
            ]}
          >
            Tek seferlik giriş kodunu almak istediğiniz yolu seçin.
          </Text>
        </View>

        <View style={styles.radioContainer}>
          <Pressable
            onPress={() => setDeliveryMethod("email")}
            style={[
              styles.radioButton,
              deliveryMethod === "email" && styles.radioSelected,
            ]}
          >
            <Text>Mail</Text>
          </Pressable>
          <Pressable
            onPress={() => setDeliveryMethod("phone")}
            style={[
              styles.radioButton,
              deliveryMethod === "phone" && styles.radioSelected,
            ]}
          >
            <Text>Telefon</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [styles.button]}
        >
          <Text style={styles.kaydolText}>Giriş Yap</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={({ pressed }) => [
            styles.registerButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.registerText}>Kaydol</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    backgroundColor: "#white", // Light grey background
    //paddingVertical: 20,
    justifyContent: "center",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 35,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    color: "black",
    opacity: 0.8,
  },
  topImage: {
    marginTop: 30,
    width: 550, // Adjust the image width
    height: 500, // Adjust the image height
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  labelText: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "white", // To "mask" the input border
    fontSize: 14,
    color: "#555",
    zIndex: 1, // Ensure label stays above the border
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    width: "100%",
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 14, // Placeholder starts 10 padding from the left
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: "#E8E8E8",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black", // Green color like in the design
  },
  kaydolText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white", // Different background color
    borderWidth: 2, // Add a border for differentiation
    borderColor: "black", // Matching border color
    marginTop: 10, // Add spacing between buttons
  },

  registerText: {
    fontWeight: "bold",
    color: "black", // Make text black to contrast with white button
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: "center",
    color: "blue",
    marginBottom: 20,
    fontSize: 16,
  },
});
