import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const Dersler = ({ navigation }) => {
  const vowelModules = [
    { title: "A Harfi", difficulty: "Kolay", image: require("../assets/images/1.png") },
    { title: "E Harfi", difficulty: "Orta", image: require("../assets/images/2.png") },
    { title: "I Harfi", difficulty: "Zor", image: require("../assets/images/3.png") },
    { title: "İ Harfi", difficulty: "Kolay", image: require("../assets/images/4.png") },
    { title: "O/Ö Harfi", difficulty: "Orta", image: require("../assets/images/5.png") },
  ];

  // Handle navigation based on the selected card
  const handleCardPress = (moduleTitle) => {
    if (moduleTitle === "A Harfi") {
      navigation.navigate("Acourse"); // Navigate to Acourse.js for "A Harfi"
    }
    // You can add more conditions for other cards if needed
  };

  return (
    <ImageBackground
      source={require("../assets/images/ders_back.png")}
      style={styles.imageBackground}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={require("../assets/images/backspace.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Dersler</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {vowelModules.map((module, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => handleCardPress(module.title)}>
              <View style={styles.cardContent}>
                <Image source={module.image} style={styles.cardImage} />
                <View>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                  <Text style={styles.cardDifficulty}>{module.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Dersler;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    paddingTop: 50, // For safe area padding
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 25,
    padding: 5,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  bottomContainer: {
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
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
