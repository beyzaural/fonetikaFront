// src/Startup.js
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const Startup = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.replace("Login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          await AsyncStorage.removeItem("token");
          navigation.replace("Login");
        } else {
          navigation.replace("Home");
        }
      } catch (e) {
        console.error("Invalid token:", e);
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
      }
    };

    checkToken();
  }, []);

  return null; // or a splash screen
};

export default Startup;
