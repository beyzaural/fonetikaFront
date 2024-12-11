import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const Kelime = ({ navigation }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [definition, setDefinition] = useState("");

  const word = "Ağabey";
  const wordDefinition = "A:bi";

  const handleMicrophonePress = () => {
    if (isSpeaking) {
      setShowFeedback(true);
      setDefinition(wordDefinition);
    } else {
      setShowFeedback(false);
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <ImageBackground
      source={require("../assets/images/kelime_back.png")} // Replace with your background image path
      style={styles.imageBackground}
    >
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

        {/* Top Container */}
        <View style={styles.topContainer}>
          <Text style={styles.okuText}>{"Aşağıdaki kelimeyi okuyunuz"}</Text>

          <View style={styles.wordContainer}>
            <Text style={styles.wordText}>{word}</Text>
            <Text style={styles.phoneticText}>{wordDefinition}</Text>
          </View>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesome name="microphone" size={90} color="#880000" />
          </TouchableOpacity>
        </View>

        {/* Feedback Popup */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFeedback}
          onRequestClose={() => setShowFeedback(false)}
        >
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Kelime Okunuşu</Text>
              <Text style={styles.feedbackText}>{definition}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeedback(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/icons/fitness.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Kelime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  topContainer: {
    backgroundColor: "transparent",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  okuText: {
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  wordContainer: {
    backgroundColor: "#880000",
    width: "80%",
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  phoneticText: {
    fontSize: 20,
    color: "white",
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  feedbackContent: {
    height: "45%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
