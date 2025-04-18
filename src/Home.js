import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getUserInfo } from "./utils/auth";
import BottomNavBar from "./BottomNavBar";
import ProgressBar from "./ProgressBar";

const Home = ({ navigation, route }) => {
  const [userName, setUserName] = useState("");
  const dailyGoal = route.params?.dailyGoal; // Get dailyGoal from route.params
  const [weeklyLoginDays, setWeeklyLoginDays] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await getUserInfo(); // Fetch user info from token
      if (userInfo?.username) {
        setUserName(userInfo.username); // Use 'username' instead of 'name'
      }
    };
    fetchUserData();
  }, []);

  const [dictionTip, setDictionTip] = useState(null);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/diction-tip")
      .then((res) => {
        if (res.data?.message) {
          setDictionTip(res.data.message);
          setShowTip(true);
          setTimeout(() => setShowTip(false), 10000); // 5 saniye sonra kaybol
        }
      })
      .catch((err) => console.error("Günün ipucu alınamadı:", err));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const logDailyUsage = async () => {
        try {
          await axios.post(
            "http://localhost:8080/api/progress/app-usage/log",
            null,
            { params: { userId: "test-user" } }
          );
          console.log("✅ Günlük giriş kaydedildi");

          // ⬇️ LOG sonrası login günlerini al
          const res = await axios.get(
            "http://localhost:8080/api/progress/app-usage",
            {
              params: { userId: "test-user" },
            }
          );
          setWeeklyLoginDays(res.data);
          console.log("🔁 Backend'ten gelen haftalık login günleri:", res.data);
        } catch (error) {
          console.error("❌ Giriş logu ya da login günleri alınamadı:", error);
        }
      };

      logDailyUsage();
    }, [])
  );

  useEffect(() => {
    const fetchLoginDays = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/progress/app-usage",
          {
            params: { userId: "test-user" },
          }
        );
        setWeeklyLoginDays(res.data); // örnek: ["Mon", "Wed", "Fri"]
        console.log("🔁 Backend'ten gelen haftalık login günleri:", res.data);
      } catch (error) {
        console.error("❌ Haftalık login verisi alınamadı", error);
      }
    };

    fetchLoginDays();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/green.png")} // Reference your image here
      style={styles.imageBackground}
    >
      {showTip && dictionTip && (
        <View style={styles.tipPopup}>
          <Text style={styles.tipText}>{dictionTip}</Text>
          <TouchableOpacity
            onPress={() => setShowTip(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Hoşgeldin</Text>
      <Text style={styles.nameText}>{userName ? userName + "!" : "!"}</Text>

      {/* ✅ Yeni ProgressBar sadece login günlerini gösterir */}
      <ProgressBar weeklyLoginDays={weeklyLoginDays} />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Derslerin</Text>

      {/* Cards Container */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            onPress={() => navigation.navigate("Paragraph")} // Navigate to Paragraf.js
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
              <Text style={styles.cardText}>Paragraf</Text>
              <Text style={styles.cardSubText}> </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    marginTop: 70,
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
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 20,
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content stretches properly
    paddingVertical: 20, // Adds vertical padding
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
    marginTop: 10,
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
});
