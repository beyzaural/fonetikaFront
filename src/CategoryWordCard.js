// WordCard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import BottomNavBar from "./BottomNavBar";
import { FontAwesome } from "@expo/vector-icons";
import { getUserIdFromToken } from "./utils/auth";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const CategoryWordCard = ({ navigation, route }) => {
  const { wordText, field } = route.params;
  const [wordData, setWordData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchWordData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/${field.toLowerCase()}-words/${wordText}`
        );
        setWordData(res.data);
      } catch (err) {
        console.error("Kelime verisi alınamadı:", err);
        Alert.alert("Hata", "Kelime verisi alınamadı.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordData();
  }, [wordText, field]);

  const startRecording = async () => {
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
    } catch (err) {
      console.error("Kayıt başlatılamadı:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error("Kayıt durdurulamadı:", err);
    }
  };

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
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                <FontAwesome
                  name="microphone"
                  size={100}
                  color={recording ? "black" : "#FF3B30"}
                />
              </TouchableOpacity>
              <Text style={styles.micInfoText}>
                {recording
                  ? "Bitirmek için tekrar basın"
                  : "Kaydetmek için mikrofona basın"}
              </Text>
            </View>
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

export default CategoryWordCard;

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
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    marginBottom: 40,
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
