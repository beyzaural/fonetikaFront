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
import * as Progress from "react-native-progress";
import BottomNavBar from "./BottomNavBar"; // Import the progress bar

const Ders = ({ navigation, route }) => {
  const progress = 0.35; // Example progress value (50%)
  const { courseId, phoneme } = route.params;

  return (
    <ImageBackground
      source={require("../assets/images/ders_back.png")}
      style={styles.imageBackground}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dersler")}
      >
        <Image
          source={require("../assets/images/backspace.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>İlerlemen:</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={300}
            height={10}
            color="#880000"
            borderRadius={5}
            borderColor="#e0e0e0"
            unfilledColor="#e0e0e0"
          />
          <Text style={styles.progressText}>{`${Math.round(
            progress * 100
          )}%`}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("KursKelime", { courseId: courseId })
            }
          >
            <Text style={styles.buttonText}>Kelime Çalış</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("KursTekrar", {
                courseId: courseId,
                phoneme: phoneme,
              })
            }
          >
            <Text style={styles.buttonText}>Geçmiş Tekrarı</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Your content goes here */}
        </ScrollView>
        <BottomNavBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default Ders;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    paddingTop: 50,
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
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#880000",
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  button: {
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#D4D4D4", // Light grey color
    borderRadius: 10,
    marginBottom: 20,
    // marginTop:10,

    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    marginTop: 20,
  },
  navBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
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
