import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av"; // Import Audio from expo-av
import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BottomNavBar from "./BottomNavBar";

const API_URL = extra.apiUrl;

const KursKelime = ({ navigation, route }) => {
  const { courseId } = route.params;
  const [words, setWords] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Track if recording is in progress
  const [recording, setRecording] = useState(null); // Store the Recording object
  const [audioUri, setAudioUri] = useState(null); // Store the URI of the saved audio file
  const [showFeedback, setShowFeedback] = useState(false); // Show feedback modal
  const [definition, setDefinition] = useState(""); // Phonetic feedback

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchWords = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/words/vowel-course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWords(res.data);
    };

    fetchWords();
  }, []);

  // Handle microphone press (start/stop recording)
  const handleMicrophonePress = async () => {
    if (recording) {
      // Stop recording
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI(); // Get URI of the recorded audio
        setAudioUri(uri); // Save URI for further processing or playback
        setRecording(null); // Clear the recording object
        setIsRecording(false);
        setShowFeedback(true); // Show feedback after recording stops
        setDefinition(words[currentIndex].definition); // Show phonetic definition
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    } else {
      // Start recording
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert("Microphone permission is required to record audio.");
          return;
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY // Use high-quality audio settings
        );
        setRecording(recording); // Save the recording object
        setIsRecording(true); // Indicate that recording is in progress
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  // Play the recorded audio
  const playAudio = async () => {
    if (!audioUri) {
      alert("Henüz bir kayıt yapılmadı!");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  const handlePreviousWord = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + words.length) % words.length
    );
    setShowFeedback(false);
    setIsRecording(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/kelime_back.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Ders", { courseId: courseId })}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Top Container */}
        <View style={styles.topContainer}>
          <Text style={styles.okuText}>{"Aşağıdaki kelimeyi okuyunuz"}</Text>

          {words.length > 0 && (
            <View style={styles.wordContainer}>
              <Text style={styles.wordText}>{words[currentIndex].word}</Text>
              <Text style={styles.phoneticText}>
                {words[currentIndex].definition}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesome
              name="microphone"
              size={90}
              color={isRecording ? "red" : "#880000"} // Change color based on recording state
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
            <Text style={styles.listenButtonText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Arrows */}
        <TouchableOpacity
          style={styles.prevButton}
          onPress={handlePreviousWord}
        >
          <FontAwesome name="arrow-left" size={50} color="#880000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextWord}>
          <FontAwesome name="arrow-right" size={50} color="#880000" />
        </TouchableOpacity>

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

        <BottomNavBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default KursKelime;

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
  listenButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#880000",
    borderRadius: 10,
    alignItems: "center",
  },
  listenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  prevButton: {
    position: "absolute",
    bottom: 100,
    left: 30,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  nextButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
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
