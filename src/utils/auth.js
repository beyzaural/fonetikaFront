const jwtDecodeLib = require("jwt-decode");
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check if the module has a default export; otherwise, use the imported object directly.
const decodeFunction =
  typeof jwtDecodeLib === "function" ? jwtDecodeLib : jwtDecodeLib.default;

export const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    console.log("Token retrieved:", token);
    if (!token) return null;

    const decoded = decodeFunction(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
