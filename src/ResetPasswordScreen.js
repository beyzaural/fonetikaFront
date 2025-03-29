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
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Your password has been reset.");
        navigation.navigate("Login"); // Redirect back to login
      } else {
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reset password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your new password below to reset your account.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />

      <Pressable onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
