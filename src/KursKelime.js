import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;
import { getUserIdFromToken } from "./utils/auth";
import IpaReferenceModal from "../components/IpaReferenceModal";

const KursKelime = ({ navigation, route }) => {
  const { courseId, phoneme } = route?.params || {};
  const [showModal, setShowModal] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [sttPreview, setSttPreview] = useState(null);
  const [alternativesMap, setAlternativesMap] = useState({});

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showIpaInfo, setShowIpaInfo] = useState(false);

  useEffect(() => {
    fetchRandomWord(null);
  }, []);

  const sanitizeWord = (word) => {
    return word
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
  };
  const playOriginalAudio = async () => {
    const currentWord = words[currentIndex];
    if (!currentWord?.audioPath) {
      alert("Bu kelime için ses kaydı bulunamadı.");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: currentWord.audioPath },
        { shouldPlay: true }
      );
    } catch (error) {
      console.error("Error playing original audio:", error);
      Alert.alert("Hata", "Orijinal ses çalınamadı.");
    }
  };

  const fetchRandomWord = async () => {
    try {
      const userId = await getUserIdFromToken(); // still useful for other logic

      const res = await axios.get(`${API_URL}/api/words/random-by-phoneme`, {
        params: { phoneme },
      });

      const word = res.data;

      if (!word) {
        console.warn("⚠️ No word received from backend.");
        return;
      }

      const enriched = {
        ...word,
        definition: word.phoneticWriting || "",
        tahmin: "",
        instruction: "",
        kelime: word.phoneticWriting || "",
        ipucu: "",
      };

      setWords((prevWords) => {
        const updatedWords = [...prevWords, enriched];
        if (prevWords.length === 0) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(updatedWords.length - 1);
        }
        return updatedWords;
      });
    } catch (err) {
      console.error("❌ Random course word fetch error:", err);
    }
  };

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
        sendAudioToBackend(uri); // Send m4a file to backend
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    } else {
      try {
        if (recording !== null) {
          await recording.stopAndUnloadAsync();
          setRecording(null);
        }

        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert("Mikrofon erişimi gerekiyor.");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(newRecording);
        setIsRecording(true);
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  // Utility: Convert a blob URL into a temporary File object with m4a name/type.
  const createTemporaryFile = async (blobUri) => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    // This File object only renames the file and sets the MIME type; it doesn't convert audio format.
    return new File([blob], "recording.m4a", { type: "audio/m4a" });
  };

  const sendAudioToBackend = async (uri) => {
    try {
      setIsFeedbackLoading(true);
      setShowModal(true);

      // STT Preview
      const sttForm = new FormData();
      sttForm.append("file", {
        uri: uri,
        type: "audio/wav",
        name: "preview.wav",
      });

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
      const currentWord = words[currentIndex];

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/wav",
        name: sanitizeWord(currentWord.word) + ".wav",
      });
      formData.append("expected_word", currentWord.word || "");
      formData.append("word_id", currentWord.id || "");
      formData.append("user_id", userId);

      const response = await fetch(`${API_URL}/api/speech/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const responseJson = await response.json();
      setSttPreview(null);

      const formattedFeedback =
        responseJson.subwordFeedbackList?.length > 0
          ? responseJson.subwordFeedbackList
              .map(
                (f) => `🔸 "${f.subword}" (${f.vowelIpa}): ${f.feedbackMessage}`
              )
              .join("\n")
          : "";

      setFeedback(formattedFeedback);
      setIsFeedbackLoading(false);

      setWords((prevWords) => {
        const updated = [...prevWords];
        updated[currentIndex] = {
          ...updated[currentIndex],
          transcribedText: responseJson.recognizedWord,
          isCorrect:
            responseJson.wordCorrect === true ||
            responseJson.wordCorrect === "true",
          feedbackList: responseJson.subwordFeedbackList,
          highlightIndices: responseJson.highlightIndices,
          ipucu: currentWord.ipucu,
        };
        return updated;
      });

      await axios.post(`${API_URL}/api/progress/add`, null, {
        params: { userId, count: 1 },
      });

      if (
        responseJson.wordCorrect === false ||
        responseJson.wordCorrect === "false"
      ) {
        await axios.post(`${API_URL}/api/mispronounced-words/record`, {
          userId,
          wordId: currentWord.id,
          phonemesMistaken: generatePhonemeMistakeMap(
            responseJson.subwordFeedbackList
          ),
        });
      }

      setShowModal(true);
    } catch (error) {
      console.error("❌ Error sending audio:", error);
      Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };
  function generatePhonemeMistakeMap(subwordFeedbackList) {
    const phonemeCounts = {};
    if (!Array.isArray(subwordFeedbackList)) return phonemeCounts;

    for (const feedback of subwordFeedbackList) {
      if (feedback.feedbackMessage?.includes("yanlış telaffuz")) {
        const key = feedback.vowelIpa;
        phonemeCounts[key] = (phonemeCounts[key] || 0) + 1;
      }
    }
    return phonemeCounts;
  }

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
    setShowFeedback(false);
    setIsRecording(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const lastId = words[currentIndex]?.id || null;
      fetchRandomWord(lastId);
    }
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedback(false);
      setIsRecording(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1, marginTop: 50, paddingTop: 30 }}>
        <BackButton navigation={navigation} />
        <View style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}>
          <TouchableOpacity
            onPress={() => setShowIpaInfo(true)}
            style={{
              backgroundColor: "#FFEBE6",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <FontAwesome
              name="info-circle"
              size={16}
              color="#FF3B30"
              style={{ marginRight: 6 }}
            />
            <Text
              style={{ color: "#FF3B30", fontWeight: "bold", fontSize: 13 }}
            >
              Fonetik Sembollerin Okunuşu
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.wordContainer}>
              {words[currentIndex] ? (
                <>
                  <Text style={styles.wordText}>
                    {words[currentIndex].word}
                  </Text>
                  <Text style={styles.phoneticText}>
                    {words[currentIndex].definition}
                  </Text>
                </>
              ) : (
                <Text style={styles.wordText}>Yükleniyor...</Text>
              )}
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
              <TouchableOpacity
                style={styles.prevButton}
                onPress={handlePreviousWord}
              >
                <FontAwesome name="arrow-left" size={50} color="#FF3B30" />
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
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackContent}>
                {/* Fixed top-right close button */}
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.modalCloseIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="close" size={26} color="#FF3B30" />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {isFeedbackLoading || !words[currentIndex] ? (
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
                      <Text
                        style={[styles.feedbackTitle, { marginBottom: 10 }]}
                      >
                        Geri Bildirim
                      </Text>

                      {words[currentIndex].transcribedText ? (
                        <>
                          <Text
                            style={[styles.tahminText, { marginBottom: 10 }]}
                          >
                            Sanırım "{words[currentIndex].transcribedText}"
                            dediniz.
                          </Text>

                          <Text
                            style={[
                              styles.instructionText,
                              { marginBottom: 10 },
                            ]}
                          >
                            {words[currentIndex].isCorrect
                              ? "Analizin sonuçları:"
                              : "Lütfen tekrar deneyin, bazı hatalar algılandı!"}
                          </Text>
                          {feedback !== "" && (
                            <View style={{ marginTop: 10 }}>
                              {feedback.split("\n").map((line, index) => {
                                const match = line.match(
                                  /🔸 "(.*?)" \((.*?)\): (.*)/
                                );
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

                          {words[currentIndex].ipucu !== "" && (
                            <Text style={styles.ipucuText}>
                              <Text style={styles.ipucuBold}>İpucu: </Text>
                              {words[currentIndex].ipucu}
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={[styles.tahminText, { marginBottom: 10 }]}>
                          {words[currentIndex].transcribedText
                            ? "Kelime farklı algılandı, lütfen doğru okunuşunu dinleyerek tekrar söyleyiniz."
                            : "Lütfen tekrar kaydedin, ses net bir şekilde algılanamadı..."}
                        </Text>
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
          <IpaReferenceModal
            visible={showIpaInfo}
            onClose={() => setShowIpaInfo(false)}
          />
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
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
  speakerIcon: {
    marginTop: 20,
    width: 60,
    height: 60,
    tintColor: "#FF3B30",
  },
  micInfoText: {
    fontSize: 14,
    color: "#6CA3AD",
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
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
  modalCloseIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  tahminText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  kelimeText: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 15,
  },
  redText: {
    color: "red",
    fontSize: 23,
    fontWeight: "bold",
  },
  blackText: {
    color: "black",
    fontSize: 23,
    fontWeight: "bold",
  },
  ipucuText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  ipucuBold: {
    fontWeight: "bold",
  },
  listenButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  listenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  speakerIconWrapper: {
    marginTop: 20,
  },
});
