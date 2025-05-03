// app/startup.js
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useRouter } from "expo-router";

const Startup = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        } else {
          router.replace("/home");
        }
      } catch (e) {
        console.error("Invalid token:", e);
        await AsyncStorage.removeItem("token");
        router.replace("/login");
      }
    };

    checkToken();
  }, []);

  return null; // Or show a splash/loading screen here
};

export default Startup;
