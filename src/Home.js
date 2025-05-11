import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getUserProfile, getUserIdFromToken } from "./utils/auth";
import BottomNavBar from "./BottomNavBar";
import ProgressBar from "./ProgressBar";
import GoalRing from "./GoalRing";
import Icon from "react-native-vector-icons/FontAwesome5"; // flame is available here

import { checkVowelProfileCompleted } from "./utils/auth"; // 👈 import
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl || "http://localhost:8080";

const Home = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("");
  const [userDailyGoal, setUserDailyGoal] = useState(null);
  const [weeklyLoginDays, setWeeklyLoginDays] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("🔍 Fetching user data...");
      try {
        const userId = await getUserIdFromToken();
        console.log("✅ Got userId from token:", userId);
        if (userId) {
          setUserId(userId);
        }

        const userProfile = await getUserProfile();
        console.log("📦 User profile received:", userProfile);
        if (userProfile?.username) {
          setUserName(userProfile.username);
          setUserDailyGoal(userProfile.dailyGoal);
          console.log(
            "✅ Set username and dailyGoal:",
            userProfile.username,
            userProfile.dailyGoal
          );
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        console.log("❌ No userId available, skipping progress fetch");
        return;
      }
      try {
        console.log("🔍 Fetching progress for userId:", userId);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("❌ No token available");
          return;
        }
        const res = await axios.get(`${API_URL}/api/progress/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📦 Progress data received:", res.data);
        setUserProgress(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch progress:", err);
        if (err.response) {
          console.error("📡 Response status:", err.response.status);
          console.error("📡 Response data:", err.response.data);
        }
      }
    };
    fetchProgress();
  }, [userId]);

  const [dictionTip, setDictionTip] = useState(null);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    const fetchDictionTip = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/diction-tip`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data?.message) {
          setDictionTip(res.data.message);
          checkTipShownToday();
        }
      } catch (err) {
        console.error("Günün ipucu alınamadı:", err);
      }
    };
    fetchDictionTip();
  }, []);

  const checkTipShownToday = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const lastShownDate = await AsyncStorage.getItem("lastTipDate");

    if (lastShownDate !== today) {
      // Henüz bugün gösterilmedi
      setShowTip(true);
      await AsyncStorage.setItem("lastTipDate", today);

      // Otomatik kaybolma
      setTimeout(() => setShowTip(false), 10000);
    } else {
      // Bugün zaten gösterildi
      setShowTip(false);
    }
  };

  const today = Number(userProgress?.todayCount);
  const goal = Number(userDailyGoal);
  const progress = !isNaN(today) && !isNaN(goal) && goal > 0 ? today / goal : 0;
  console.log("🎯 dailyGoal:", Number(userDailyGoal));
  console.log(
    "📊 progress:",
    Number(userProgress?.todayCount) / Number(userProgress?.dailyGoal)
  );
  const getStreakColor = (streak) => {
    if (streak >= 7) return "#4CAF50"; // Green
    if (streak > 0) return "#FFA500"; // Orange
    return "#9E9E9E"; // Gray
  };
  const handleRestrictedNavigation = async (targetPage) => {
    const isCompleted = await checkVowelProfileCompleted();
    if (!isCompleted) {
      Alert.alert(
        "Ses Profili Eksik",
        "Diksiyon alıştırmalarına başlamak için ses profilinizi tamamlamanız gerekiyor. Lütfen gerekli kelimeleri kaydederek ses profilinizi oluşturun.\n\nBunu yapmak için Ayarlar > Ses Profili bölümüne gidebilirsiniz."
      );

      return;
    }
    navigation.navigate(targetPage);
  };

  return (
    <ImageBackground
      source={require("../assets/images/green.png")} // Reference your image here
      style={styles.imageBackground}
    >
      {showTip && dictionTip && (
        <View style={styles.tipPopup}>
          <Text style={styles.tipText}>{dictionTip}</Text>
        </View>
      )}
      {/* 💬 Info Icon - sağ üstte sabit */}
      {!showTip && dictionTip && (
        <TouchableOpacity
          onPress={() => setShowTip(true)}
          style={styles.infoIconWrapper}
        >
          <Image
            source={require("../assets/icons/info.png")} // 💡 kendi info ikonun burada olmalı
            style={styles.infoIcon}
          />
        </TouchableOpacity>
      )}

      {/* Welcome Text */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Hoşgeldin</Text>
          <Text style={styles.nameText}>{userName ? userName + "!" : "!"}</Text>

          <View style={styles.progressInfoContainer}>
            {userProgress && <GoalRing progress={progress} goal={goal} />}

            <View style={styles.streakCard}>
              <Icon
                name="fire"
                style={styles.streakCardIcon}
                color="#FF3B30"
                solid
              />
              <Text style={styles.streakCardText}>
                {userProgress?.streak || 0} Günlük Seri
              </Text>
            </View>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}> </Text>

          {/* Cards Container */}

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Sohbet")}
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.cardGradient}
              >
                <Image
                  source={require("../assets/icons/chat.png")} // Reference the chat icon here
                  style={styles.chatIcon}
                />
                <Text style={styles.cardText}>Sohbet</Text>
                <Text style={styles.cardSubText}> </Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* Kelime Card (Clickable) */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Kelime")}
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.cardGradient}
              >
                <Image
                  source={require("../assets/icons/game.png")}
                  style={styles.chatIcon}
                />
                <Text style={styles.cardText}>Kelime</Text>
                <Text style={styles.cardSubText}> </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Geneltekrar")} // Navigate to Tekrar.js
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.cardGradient}
              >
                <Image
                  source={require("../assets/icons/update-arrow.png")}
                  style={styles.chatIcon}
                />
                <Text style={styles.cardText}>Geçmiş</Text>
                <Text style={styles.cardSubText}> </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("WordCategory")} // Navigate to Paragraf.js
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.cardGradient}
              >
                <Image
                  source={require("../assets/icons/file-2.png")} // Reference the chat icon here
                  style={styles.chatIcon}
                />
                <Text style={styles.cardText}>Mesleki Terimler</Text>
                <Text style={styles.cardSubText}> </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginTop: 55,
    marginLeft: 20,
  },
  nameText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginLeft: 20,
  },
  dailyGoalText: {
    fontSize: 20,
    color: "white",
    marginTop: 20,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    //marginTop: 25,
    marginBottom: 5,
    marginLeft: 20,
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content stretches properly
    paddingVertical: 14, // Adds vertical padding
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 17,
  },
  card: {
    width: "48%", // Half width with spacing
    height: 220,
    borderRadius: 35,
    marginBottom: 15,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 35,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 30,
    marginBottom: 5,
    textAlign: "center",
  },
  chatIcon: {
    marginTop: 60,
    width: 60,
    height: 60,
  },
  cardSubText: {
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  navBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  tipPopup: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 12,
    borderRadius: 10,
    margin: 20,
    marginTop: 60,
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  closeButton: {
    marginLeft: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  infoIconWrapper: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1000,
    padding: 8,
    borderRadius: 30,
  },

  infoIcon: {
    width: 28,
    height: 28,
    tintColor: "black",
  },
  progressInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 5,
  },

  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginRight: 10,
  },

  progressCircleText: {
    color: "white",
    fontWeight: "bold",
  },

  streakContainer: {
    justifyContent: "center",
  },

  streakText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  streakWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 90, // matches GoalRing marginLeft
  },

  streakLabel: {
    color: "white",
    fontSize: 18, // larger font size for text
    fontWeight: "600",
    marginTop: 8,
  },

  streakIcon: {
    fontSize: 40, // larger icon size
  },

  streakText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginTop: 2,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginLeft: 20,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  streakCardIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  streakCardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});
