import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Dersler = ({ navigation }) => {
  const [courses, setCourses] = useState("");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found in AsyncStorage.");
          return;
        }

        const res = await axios.get(`${API_URL}/api/courses/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const getImageForCourse = (name) => {
    const lower = name.toLowerCase();
    switch (lower) {
      case "a":
        return require("../assets/images/a.png");
      case "e":
        return require("../assets/images/e.png");
      case "i":
      case "ı":
        return require("../assets/images/ı.png");

      case "o":
      case "ö":
        return require("../assets/images/o.png");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../assets/images/ders1.png")}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              source={require("../assets/images/backspace.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Dersler</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Array.isArray(courses) &&
            courses.map((course, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("Ders", {
                    courseId: course.id,
                    phoneme: course.courseName,
                  })
                }
              >
                <View style={styles.cardContent}>
                  <Image
                    source={getImageForCourse(course.courseName)}
                    style={styles.cardImage}
                  />
                  <View>
                    <Text style={styles.cardTitle}>
                      {course.courseName.toUpperCase()} Harfi
                    </Text>
                    <Text style={styles.cardDifficulty}>
                      Zorluk: {course.difficulty || "Bilinmiyor"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default Dersler;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  topContainer: {
    flex: 3, // Top section takes up 3 parts of the screen
  },

  imageBackground: {
    flex: 1,
    // marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden", // Ensures the image respects the border radius
  },

  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensures the image covers the top section
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 25,
    padding: 5,
  },

  backIcon: {
    width: 40,
    height: 40,
  },

  bottomContainer: {
    flex: 5, // Bottom section takes up 5 parts of the screen
    backgroundColor: "white",
    marginTop: -30, // Brings the bottom container to overlap the image
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    color: "#333",
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    marginTop: 20,
  },

  card: {
    width: "95%",
    height: 130,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  cardImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  cardDifficulty: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});
