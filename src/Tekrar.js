import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const Tekrar = ({ navigation }) => {
  const vowelModules = [
    {
      title: "A Harfi",
      difficulty: "Tekrar Et",
      image: require("../assets/images/1.png"),
      navigateTo: "Atekrar",
    },
    {
      title: "E Harfi",
      difficulty: "Tekrar Et",
      image: require("../assets/images/2.png"),
    },
    {
      title: "I Harfi",
      difficulty: "Tekrar Et",
      image: require("../assets/images/3.png"),
    },
    {
      title: "İ Harfi",
      difficulty: "Tekrar Et",
      image: require("../assets/images/4.png"),
    },
  ];

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Hataların:</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {vowelModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                if (module.navigateTo) {
                  navigation.navigate(module.navigateTo);
                }
              }}
            >
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

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/icons/profile.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/icons/settings.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dersler")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/icons/fitness.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Tekrar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Set background color to white
    //paddingTop: 50, // Add padding for safe area (status bar)
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100, // Ensure the back button is on top of other elements
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent background for visibility
    borderRadius: 25,
    padding: 5,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  bottomContainer: {
    height: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    //paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 60,
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
  },
});
