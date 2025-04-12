const jwtDecodeLib = require("jwt-decode");
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

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
