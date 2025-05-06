import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const Startup = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      console.log("🪙 Token from storage:", token);
      const token = await AsyncStorage.getItem("token");
      console.log("🪙 Token from storage:", token);

      if (!token) {
        console.log("🔓 No token, going to Login");
        navigation.replace("Login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("✅ Token decoded:", decoded);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.log("⏰ Token expired");
          await AsyncStorage.removeItem("token");
          navigation.replace("Login");
        } else {
          console.log("🔐 Token valid, going to Home");
          navigation.replace("Home");
        }
      } catch (e) {
        console.error("❌ Invalid token:", e);
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
      }
    };

    checkToken();
  }, []);

  return null; // You can replace this with a splash screen if desired
};

export default Startup;
