const jwtDecodeLib = require("jwt-decode");
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import jwtDecode from "jwt-decode";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

// Check if the module has a default export; otherwise, use the imported object directly.
const decodeFunction =
  typeof jwtDecodeLib === "function" ? jwtDecodeLib : jwtDecodeLib.default;

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("refreshToken");
  await AsyncStorage.removeItem("userInfo");
};

export const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) return null;

    const decoded = decodeFunction(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserIdFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.sub || decoded.userId;
    }
  } catch (e) {
    console.error("Token decoding error:", e);
  }
  return null;
};

// New function to fetch user profile
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeFunction(token);
    const userId = decoded.userId;

    // Fetch the profile from the backend using the userId
    const response = await fetch(`${API_URL}/users/profile?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Error fetching profile:", response.status);
      return null;
    }

    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};
export const checkVowelProfileCompleted = async () => {
  try {
    const savedProgress = await AsyncStorage.getItem("voiceRecordingProgress");
    if (!savedProgress) return false;
    const { recordedWords } = JSON.parse(savedProgress);
    return recordedWords.length >= 42; // all 45 words done?
  } catch (error) {
    console.error("Error checking profile status:", error);
    return false; // default to not completed
  }
};
