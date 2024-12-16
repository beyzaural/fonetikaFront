import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";

const Kelime = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(""); // Backend feedback
  const [transcribedText, setTranscribedText] = useState(""); // Transcribed text
  const [isCorrect, setIsCorrect] = useState(null); // Whether the word was pronounced correctly

  const words = [
    { word: "Kamuflaj", definition: "Kamuflâj" },
    { word: "Ağabey", definition: "A:bi" },
    { word: "Sahi", definition: "sa:hi" },
    { word: "Şiir", definition: "şi:r" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);
        setAudioUri(uri);

        const expectedWord = words[currentIndex].word;

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "recording.m4a",
          type: "audio/m4a",
        });

        const backendUrl = `http://192.168.1.103:8000/check-word?expected_word=${encodeURIComponent(
          expectedWord
        )}`;

        // Send to backend
        const response = await fetch(backendUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Backend response:", result);

        // Update feedback state based on response
        setFeedback(result.feedback);
        setTranscribedText(result.transcribed_text);
        setIsCorrect(result.is_correct);
        setShowFeedback(true);
      } catch (error) {
        console.error("Error during recording or upload:", error);
        Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
      } finally {
        setRecording(null);
        setIsRecording(false);
      }
    } else {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert(
            "İzin Gerekli",
            "Mikrofon izni ses kaydı için gereklidir."
          );
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  const playAudio = async () => {
    if (!audioUri) {
      Alert.alert("Kayıt Bulunamadı", "Lütfen önce bir kayıt yapın.");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
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
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/kelime_back.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image source={require("../assets/images/backspace.png")} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Word Display */}
        <View style={styles.topContainer}>
          <Text style={styles.okuText}>{"Aşağıdaki kelimeyi okuyunuz"}</Text>
          <View style={styles.wordContainer}>
            <Text style={styles.wordText}>{words[currentIndex].word}</Text>
            <Text style={styles.phoneticText}>{words[currentIndex].definition}</Text>
          </View>
        </View>

        {/* Recording and Playback Controls */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesome name="microphone" size={90} color={isRecording ? "red" : "#880000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
            <Text style={styles.listenButtonText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Arrows */}
        <TouchableOpacity style={styles.prevButton} onPress={handlePreviousWord}>
          <FontAwesome name="arrow-left" size={50} color="#880000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextWord}>
          <FontAwesome name="arrow-right" size={50} color="#880000" />
        </TouchableOpacity>

        {/* Feedback Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFeedback}
          onRequestClose={() => setShowFeedback(false)}
        >
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Geri Bildirim</Text>
              <Text
                style={[
                  styles.feedbackText,
                  isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
                ]}
              >
                {feedback}
              </Text>
              {transcribedText ? (
                <Text style={styles.transcriptionText}>
                  {"Transkripsiyon: "}
                  <Text style={{ fontWeight: "bold" }}>{transcribedText}</Text>
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeedback(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  okuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  wordContainer: {
    backgroundColor: "#880000",
    width: "80%",
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
    alignItems: "center",
  },
  listenButton: {
    marginTop: 20,
    backgroundColor: "#880000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
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
  },
  nextButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  feedbackContent: {
    height: "50%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "space-between",
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  feedbackText: {
    fontSize: 18,
    textAlign: "center",
  },
  correctFeedback: {
    color: "green",
  },
  incorrectFeedback: {
    color: "red",
  },
  transcriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#880000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
