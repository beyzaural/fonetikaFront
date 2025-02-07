import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

import Constants from "expo-constants";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("phone"); // Default to phone

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deliveryMethod }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!data.data || !data.data.otpSessionToken || !data.data.identifier) {
        console.error(
          "ERROR: Missing otpSessionToken or identifier from backend response!",
          data
        );
        Alert.alert(
          "Error",
          "OTP token or identifier is missing. Please try again."
        );
        return;
      }

      const otpSessionToken = data.data.otpSessionToken;
      const identifier = data.data.identifier; // ✅ Extract identifier (phone or email)
      console.log("Extracted OTP Session Token:", otpSessionToken);
      console.log("Identifier:", identifier);

      navigation.navigate("LoginOTPVerification", {
        otpSessionToken: otpSessionToken,
        identifier: identifier, // ✅ Send correct identifier
        deliveryMethod: deliveryMethod,
      });
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Image
          source={require("../assets/images/login2.png")} // Adjust the path to your hello.png
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
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            style={styles.textInputStyle}
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* Delivery Method Selection */}
        <Text style={styles.labelText}>Choose Delivery Method:</Text>
        <View style={styles.radioContainer}>
          <Pressable
            onPress={() => setDeliveryMethod("email")}
            style={[
              styles.radioButton,
              deliveryMethod === "email" && styles.radioSelected,
            ]}
          >
            <Text>Email</Text>
          </Pressable>
          <Pressable
            onPress={() => setDeliveryMethod("phone")}
            style={[
              styles.radioButton,
              deliveryMethod === "phone" && styles.radioSelected,
            ]}
          >
            <Text>Phone</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [styles.button]}
        >
          <Text style={styles.kaydolText}>Giriş Yap</Text>
        </Pressable>

        {/* Link to Register */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>
            Hesabınız yoksa <Text style={styles.highlightText}>kaydolun</Text>
          </Text>
        </TouchableOpacity>
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
});
