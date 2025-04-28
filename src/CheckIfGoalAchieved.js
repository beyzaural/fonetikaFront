import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const checkDailyGoalAchieved = async (todayCount, dailyGoal) => {
  const today = new Date().toISOString().split("T")[0];
  const alertShownKey = `goalAlertShown_${today}`;

  const alreadyShown = await AsyncStorage.getItem(alertShownKey);

  if (!alreadyShown && todayCount >= dailyGoal) {
    Alert.alert("Tebrikler! 🎉", "Bugünkü hedefini tamamladın!");
    await AsyncStorage.setItem(alertShownKey, "true");
  }
};
