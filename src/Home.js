import React, { useState, useEffect } from "react";
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

const Home = ({ navigation, route }) => {
  const [userName, setUserName] = useState("");
  const dailyGoal = route.params?.dailyGoal; // Get dailyGoal from route.params

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await getUserInfo(); // Fetch user info from token
      console.log("Decoded user info:", userInfo);
      if (userInfo?.username) {
        setUserName(userInfo.username); // Use 'username' instead of 'name'
      }
    };
    fetchUserData();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/green.png")} // Reference your image here
      style={styles.imageBackground}
    >
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Hoşgeldin</Text>
      <Text style={styles.nameText}>{userName ? userName + "!" : "!"}</Text>

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
              <Text style={styles.cardSubText}>%74 tamamlandı</Text>
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
              <Text style={styles.cardSubText}>%59 tamamlandı</Text>
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
              <Text style={styles.cardSubText}>%60 tamamlandı</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Paragraf")} // Navigate to Paragraf.js
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
              <Text style={styles.cardSubText}>%45 tamamlandı</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/icons/home.png")} // Your home icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/icons/profile.png")} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={require("../assets/icons/settings.png")} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dersler")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/icons/fitness.png")} // Your fitness icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
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
    marginTop: 90,
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
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 20,
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content stretches properly
    paddingVertical: 40, // Adds vertical padding
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
});
