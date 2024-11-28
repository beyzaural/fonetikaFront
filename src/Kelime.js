import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

const PracticeWords = () => {
  const [isSpeaking, setIsSpeaking] = useState(false); // Speaking state
  const [showFeedback, setShowFeedback] = useState(false); // Feedback visibility
  const [definition, setDefinition] = useState(""); // Word definition

  const word = "Ağabey"; // Example word
  const wordDefinition = "A:bi"; // Example definition

  const handleMicrophonePress = () => {
    if (isSpeaking) {
      // When speaking ends
      setShowFeedback(true);
      setDefinition(wordDefinition); // Show the word's definition
    } else {
      // When speaking starts
      setShowFeedback(false);
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <Text style={styles.okuText}>{"Aşağıdaki kelimeyi okuyunuz"}</Text>
      <View style={styles.topContainer}>
        <Text style={styles.wordText}>{word}</Text>
      </View>

      <View style={styles.microphoneContainer}>
        <TouchableOpacity onPress={handleMicrophonePress}>
          <View
            style={[
              styles.microphoneWrapper,
              isSpeaking && styles.speakingMicrophoneWrapper,
            ]}
          >
            <FontAwesome
              name="microphone"
              size={90}
              color="white" // Dynamic color
            />
          </View>
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
    </View>
  );
};

export default PracticeWords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  okuText: {
    marginTop:35,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  topContainer: {
    margin:20,
    backgroundColor: "#ececec", // Light gray background
    height: "25%", // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius:25,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
  },
  microphoneWrapper: {
    backgroundColor: "black",
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10, // Shadow for Android
  },
  speakingMicrophoneWrapper: {
    backgroundColor: "#c91923",
  },
  microphoneContainer: {
    //flex: 1,
    //justifyContent: "center",
    marginTop:100,
    alignItems: "center",
  },
  microphoneIcon: {
    width: 100, // Adjust size as needed
    height: 100,
    tintColor: "white", // Icon color

  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  feedbackContent: {
    height: "50%", // Half of the screen
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
});
