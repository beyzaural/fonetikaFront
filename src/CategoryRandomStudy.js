// RandomStudy.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Constants from "expo-constants";
import { getUserIdFromToken } from "./utils/auth";
import { FontAwesome } from "@expo/vector-icons";
import BottomNavBar from "./BottomNavBar";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const CategoryRandomStudy = ({ navigation, route }) => {
  const { field } = route.params;

  const [wordData, setWordData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const fetchRandomWord = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserIdFromToken();
      const endpoint = `${API_URL}/api/${field.toLowerCase()}-words/random`;
      const res = await axios.get(endpoint, { params: { userId } });
      setWords(prevWords => [...prevWords, res.data]);
      setWordData(res.data);
      setFeedback(null);
      setRecordedUri(null);
      setShowFeedback(false);
    } catch (err) {
      console.error("Rastgele kelime alınamadı:", err);
      Alert.alert("Hata", "Kelime alınamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedUri(uri);
        setRecording(null);
        setIsRecording(false);
      } catch (err) {
        console.error("Kayıt durdurulamadı:", err);
      }
    } else {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      } catch (err) {
        console.error("Kayıt başlatılamadı:", err);
      }
    }
  };

  const handleNextWord = async () => {
    setShowFeedback(false);
    setIsRecording(false);
    setRecordedUri(null);

    if (currentIndex < words.length - 1) {
      const nextWord = words[currentIndex + 1];
      if (nextWord) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setWordData(nextWord);
      }
    } else {
      setIsLoading(true);
      try {
        await fetchRandomWord();
        setCurrentIndex(prevIndex => prevIndex + 1);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      const prevWord = words[currentIndex - 1];
      if (prevWord) {
        setCurrentIndex(prevIndex => prevIndex - 1);
        setWordData(prevWord);
        setShowFeedback(false);
        setIsRecording(false);
        setRecordedUri(null);
      }
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const playOriginalAudio = async () => {
    if (!wordData?.audioPath) {
      alert("Bu kelime için ses kaydı bulunamadı.");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: wordData.audioPath },
        { shouldPlay: true }
      );
    } catch (error) {
      console.error("Error playing original audio:", error);
      Alert.alert("Hata", "Orijinal ses çalınamadı.");
    }
  };

  const playAudio = async () => {
    if (!recordedUri) {
      alert("Henüz bir kayıt yapılmadı!");
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordedUri },
        { shouldPlay: true }
      );
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const submitRecording = async () => {
    try {
      setIsSubmitting(true);
      const userId = await getUserIdFromToken();
      const formData = new FormData();
      formData.append("file", {
        uri: recordedUri,
        name: "audio.wav",
        type: "audio/wav",
      });
      formData.append("expectedWord", wordData.word);
      formData.append("userId", userId);
      formData.append("word_id", wordData.id);

      const res = await axios.post(`${API_URL}/api/speech/evaluate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFeedback(res.data);
      setShowFeedback(true);
    } catch (err) {
      console.error("Kayıt gönderilemedi:", err);
      Alert.alert("Hata", "Ses kaydı gönderilirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !wordData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.topContainer}>
          <View style={styles.wordContainer}>
            {wordData && (
              <>
                <Text style={styles.wordText}>{wordData.word}</Text>
                <Text style={styles.phoneticText}>{wordData.phoneticWriting}</Text>
                <Text style={styles.meaningText}>{wordData.meaning}</Text>
                <TouchableOpacity
                  onPress={playOriginalAudio}
                  style={styles.speakerIconWrapper}
                >
                  <Image
                    source={require("../assets/icons/speaker.png")}
                    style={styles.speakerIcon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.prevButton}
              onPress={handlePreviousWord}
              disabled={currentIndex === 0}
            >
              <FontAwesome name="arrow-left" size={50} color={currentIndex === 0 ? "#CCCCCC" : "#FF3B30"} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={handleMicrophonePress}>
                <FontAwesome
                  name="microphone"
                  size={100}
                  color={isRecording ? "black" : "#FF3B30"}
                />
              </TouchableOpacity>
              <Text style={styles.micInfoText}>
                {isRecording
                  ? "Bitirmek için tekrar basın"
                  : "Kaydetmek için mikrofona basın"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextWord}
            >
              <FontAwesome name="arrow-right" size={50} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showFeedback}
          onRequestClose={() => setShowFeedback(false)}
        >
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Geri Bildirim</Text>
              {feedback && (
                <>
                  <Text style={styles.tahminText}>
                    Sanırım "{feedback.transcribedWord}" dediniz.
                  </Text>
                  <Text style={styles.instructionText}>
                    {feedback.success
                      ? "✅ Doğru söylediniz!"
                      : "❌ Yanlış söylediniz. Bir kez daha deneyin."}
                  </Text>
                  <Text style={styles.kelimeText}>
                    {wordData.phoneticWriting.split("").map((char, index) => (
                      <Text key={index} style={styles.blackText}>
                        {char}
                      </Text>
                    ))}
                  </Text>
                </>
              )}

              <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
                <Text style={styles.listenButtonText}>Dinle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeedback(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <BottomNavBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default CategoryRandomStudy;

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
    width: 40,
    height: 40,
  },
  topContainer: {
    marginTop: 30,
    height: "100%",
    alignItems: "center",
  },
  wordContainer: {
    backgroundColor: "#F9F4F1",
    width: "80%",
    height: 430,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 40,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    marginBottom: 40,
  },
  prevButton: {
    padding: 5,
  },
  nextButton: {
    padding: 5,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  phoneticText: {
    fontSize: 20,
    color: "#FF8754",
    marginTop: 10,
  },
  meaningText: {
    fontSize: 16,
    color: "#6CA3AD",
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  speakerIcon: {
    marginTop: 20,
    width: 60,
    height: 60,
    tintColor: "#FF3B30",
  },
  speakerIconWrapper: {
    marginTop: 20,
  },
  micInfoText: {
    fontSize: 14,
    color: "#6CA3AD",
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
  listenButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  listenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    color: "#333",
    marginBottom: 20,
  },
  tahminText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  kelimeText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  blackText: {
    color: "black",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
