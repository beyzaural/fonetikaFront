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
  ScrollView,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import BottomNavBar from "./BottomNavBar";
import { FontAwesome } from "@expo/vector-icons";
import { getUserIdFromToken } from "./utils/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";

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
  const [showModal, setShowModal] = useState(false);
  const [sttPreview, setSttPreview] = useState(null);
  const [alternativesMap, setAlternativesMap] = useState({});

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
      sendAudioToBackend(uri);
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

  const sendAudioToBackend = async (uri) => {
    try {
      setIsSubmitting(true);
      setShowModal(true);

      // PREVIEW: Fetch Google STT while feedback is loading
      const sttForm = new FormData();
      sttForm.append("file", {
        uri: uri,
        type: "audio/wav",
        name: "preview.wav",
      });

      // Make transcribe-detailed request
      fetch(`${API_URL}/api/speech/detailed-transcribe`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: sttForm,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            setSttPreview(json.bestTranscription);

            if (json.alternativeTranscriptions?.length > 0) {
              setAlternativesMap(
                Object.fromEntries(
                  json.alternativeTranscriptions.map((alt) => [
                    alt.transcript,
                    alt.confidence,
                  ])
                )
              );
            }
          }
        })
        .catch((err) => console.warn("🌀 Google STT failed", err));

      const userId = await getUserIdFromToken();
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: "audio.wav",
        type: "audio/wav",
      });
      formData.append("expectedWord", wordData.word);
      formData.append("userId", userId);
      formData.append("word_id", wordData.id);

      const res = await axios.post(`${API_URL}/api/speech/evaluate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSttPreview(null);
      console.log("✅ Full backend response:", res.data);

      // Format feedback from subwordFeedbackList
      const formattedFeedback =
        res.data.subwordFeedbackList?.length > 0
          ? res.data.subwordFeedbackList
              .map(
                (f) => `🔸 "${f.subword}" (${f.vowelIpa}): ${f.feedbackMessage}`
              )
              .join("\n")
          : "";

      setFeedback(formattedFeedback);

      // Save mispronunciation if needed
      if (res.data.wordCorrect === false || res.data.wordCorrect === "false") {
        await axios.post(`${API_URL}/api/mispronounced-words/record`, {
          userId,
          wordId: wordData.id,
        });
        console.log("❌ MispronouncedWord recorded.");
      }

    } catch (err) {
      console.error("❌ Error sending audio:", err);
      Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
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
      <SafeAreaView style={{ flex: 1, marginTop: 50, paddingTop: 30 }}>
        <BackButton navigation={navigation} />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.wordContainer}>
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
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackContent}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.modalCloseIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="close" size={26} color="#FF3B30" />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {isSubmitting ? (
                    <>
                      <Text style={{ textAlign: "center", fontSize: 16 }}>
                        Geri bildirim hazırlanıyor...
                      </Text>

                      {sttPreview && (
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 14,
                            marginTop: 10,
                            color: "#666",
                          }}
                        >
                          Google STT tahmini: " {sttPreview} "
                        </Text>
                      )}
                      {Object.keys(alternativesMap).length > 0 && (
                        <View style={{ marginTop: 20, alignItems: "center" }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              marginBottom: 10,
                              color: "#FF3B30",
                            }}
                          >
                            Diğer STT Tahminleri
                          </Text>
                          {Object.entries(alternativesMap).map(
                            ([transcript, confidence], index) => (
                              <View
                                key={index}
                                style={{
                                  backgroundColor: "#F0F0F0",
                                  borderRadius: 10,
                                  paddingVertical: 8,
                                  paddingHorizontal: 16,
                                  marginBottom: 8,
                                  alignItems: "center",
                                  width: "90%",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#333",
                                  }}
                                >
                                  {transcript}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: "#888",
                                    marginTop: 2,
                                  }}
                                >
                                  Güven: {(confidence * 100).toFixed(1)}%
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { marginBottom: 10 }]}>
                        Geri Bildirim
                      </Text>

                      {feedback && (
                        <View style={{ marginTop: 10 }}>
                          {feedback.split("\n").map((line, index) => {
                            const match = line.match(/🔸 "(.*?)" \((.*?)\): (.*)/);
                            if (match) {
                              const [, subword, vowelIpa, message] = match;
                              return (
                                <Text
                                  key={index}
                                  style={{
                                    marginBottom: 10,
                                    marginTop: 5,
                                    fontSize: 14,
                                    color: "#333",
                                    lineHeight: 20,
                                  }}
                                >
                                  🔸{" "}
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      color: "#FF3B30",
                                    }}
                                  >{`"${subword}"`}</Text>{" "}
                                  (
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      color: "#007AFF",
                                    }}
                                  >
                                    {vowelIpa}
                                  </Text>
                                  ): <Text>{message}</Text>
                                </Text>
                              );
                            } else {
                              return (
                                <Text
                                  key={index}
                                  style={{
                                    fontSize: 14,
                                    color: "#333",
                                    lineHeight: 20,
                                  }}
                                >
                                  {line}
                                </Text>
                              );
                            }
                          })}
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={playAudio}
                        style={[styles.listenButton, { marginTop: 20 }]}
                      >
                        <Text style={styles.listenButtonText}>Dinle</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
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
  topContainer: {
    marginTop: 10,
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
  scrollContainer: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  modalCloseIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
