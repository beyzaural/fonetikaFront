import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
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
        await AsyncStorage.setItem("token", data.token);
      } else {
        console.warn("No token received in login response"); // ✅ Log missing token
      }
      if (!response.ok) {
        console.error("Login Error:", data);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.container}>
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
                <Text style={styles.labelText}>Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    placeholder="Şifrenizi girin."
                    style={styles.textInputStyle}
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={25}
                      color="gray"
                    />
                  </TouchableOpacity>
                  <Text
                    style={styles.forgotPasswordLink}
                    onPress={() => navigation.navigate("ForgotPasswordScreen")}
                  >
                    Şifremi unuttum
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>
                  Giriş kodunuzu nasıl teslim almak istersiniz?
                </Text>
                <View style={styles.radioGroup}>
                  <Pressable
                    onPress={() => setDeliveryMethod("email")}
                    style={[
                      styles.radioOption,
                      deliveryMethod === "email" && styles.radioOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        deliveryMethod === "email" && styles.radioTextSelected,
                      ]}
                    >
                      Mail
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDeliveryMethod("phone")}
                    style={[
                      styles.radioOption,
                      deliveryMethod === "phone" && styles.radioOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        deliveryMethod === "phone" && styles.radioTextSelected,
                      ]}
                    >
                      Telefon
                    </Text>
                  </Pressable>
                </View>
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
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  passwordBottomRow: {
    position: "absolute",
    bottom: 6,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // or use marginRight in children if gap not supported
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

  labelText: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "white", // To "mask" the input border
    fontSize: 16,
    paddingBottom: 5,
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

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 5,
  },

  inputContainer: {
    marginBottom: 25,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black", // Green color like in the design
  },
  kaydolText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
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
    fontSize: 20,
  },
  passwordInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    width: "100%",
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },

  forgotPasswordLink: {
    position: "absolute",
    bottom: 6,
    right: 12,
    fontSize: 14,
    color: "#FF3B30",
    textDecorationLine: "underline",
    backgroundColor: "white",
    paddingHorizontal: 4,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  radioOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },

  radioOptionSelected: {
    backgroundColor: "#E8E8E8",
  },

  radioText: {
    fontSize: 18,
    color: "#555",
  },

  radioTextSelected: {
    fontWeight: "bold",
    color: "black",
  },
});
