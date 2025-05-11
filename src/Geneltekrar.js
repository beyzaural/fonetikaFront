import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import BottomNavBar from "./BottomNavBar";
import { getUserIdFromToken } from "./utils/auth";
import Constants from "expo-constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import IpaReferenceModal from "../components/IpaReferenceModal";

import BackButton from "./BackButton";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Geneltekrar = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [enrichedMistakes, setEnrichedMistakes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = enrichedMistakes[currentIndex];
  const [showIpaInfo, setShowIpaInfo] = useState(false);

  const [sttPreview, setSttPreview] = useState(null);
  const [alternativesMap, setAlternativesMap] = useState({});
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

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

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) return;

        const res = await axios.get(
          `${API_URL}/api/mispronounced-words/user/${userId}`
        );
        const mistakes = res.data;

        const enriched = await Promise.all(
          mistakes.map(async (mistake) => {
            const wordRes = await axios.get(
              `${API_URL}/api/words/id/${mistake.wordId}`
            );
            const wordData = wordRes.data;
            if (!wordData || !wordData.word) return null;
            return {
              ...mistake,
              word: wordData.word,
              phonetic: wordData.phoneticWriting,
              ipucu: "'Bu kelimeyi daha önce yanlış telaffuz ettiniz.'",
              audioPath: wordData.audioPath,
            };
          })
        );

        setEnrichedMistakes(enriched.filter((e) => e !== null));
      } catch (error) {}
    };

    fetchMistakes();
  }, []);

  const playOriginalAudio = async () => {
    const currentWord = enrichedMistakes[currentIndex];
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
    }
  };

  // Send the audio file to the backend. The backend should perform any necessary conversion.
  const sendAudioToBackend = async (uri) => {
    try {
      setIsFeedbackLoading(true); // Start loading
      setShowModal(true);

      // PREVIEW: Fetch Google STT while feedback is loading
      const sttForm = new FormData();
      sttForm.append("file", {
        uri: uri,
        type: "audio/wav",
        name: "preview.wav",
      });

      // 👇 Make transcribe-detailed request
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
      const currentWord = enrichedMistakes[currentIndex]; // ✅ CORRECT!

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/wav",
        name: sanitizeWord(currentWord.word) + ".wav",
      });
      formData.append("expected_word", currentWord.word || "");
      formData.append("word_id", currentWord.wordId || "");

      formData.append("user_id", userId);

      const response = await fetch(`${API_URL}/api/speech/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseJson = await response.json();
      setSttPreview(null);
      console.log("✅ Full backend response:", responseJson);

      // ✅ Format feedback from subwordFeedbackList
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
      // ✅ Save response data to current word
      setEnrichedMistakes((prevWords) => {
        const updatedWords = [...prevWords];
        updatedWords[currentIndex] = {
          ...updatedWords[currentIndex],
          transcribedText: responseJson.recognizedWord,
          isCorrect:
            responseJson.wordCorrect === true ||
            responseJson.wordCorrect === "true",
          feedbackList: responseJson.subwordFeedbackList,
          highlightIndices: responseJson.highlightIndices,
        };
        return updatedWords;
      });

      // ✅ Progress update
      await axios.post(`${API_URL}/api/progress/add`, null, {
        params: { userId, count: 1 },
      });

      // ✅ Save mispronunciation if needed
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

        console.log("❌ MispronouncedWord recorded.");
      }

      setShowFeedback(true);
    } catch (error) {
      console.error("❌ Error sending audio:", error);
      Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
    } finally {
      setIsFeedbackLoading(false); // Stop loading regardless of success/failure
    }
  };

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
        await sendAudioToBackend(uri);
      } catch (error) {
        console.log("Error stopping recording:", error);
      }
    } else {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert("Mikrofon izni gerekiyor.");
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
        console.log("Failed to start recording:", error);
      }
    }
  };

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
      console.log("Error playing audio:", error);
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % enrichedMistakes.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  const handlePreviousWord = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + enrichedMistakes.length) % enrichedMistakes.length
    );
    setShowFeedback(false);
    setIsRecording(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1, marginTop: 20, paddingTop: 20 }}>
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
          {/* Back Arrow */}

          {/* Top Container */}
          <View style={styles.topContainer}>
            <View style={styles.wordContainer}>
              {enrichedMistakes.length === 0 ? (
                <Text style={styles.wordText}>
                  Tekrar edilecek kelime bulunamadı.
                </Text>
              ) : (
                <>
                  <Text style={styles.wordText}>
                    {enrichedMistakes[currentIndex]?.word}
                  </Text>
                  <Text style={styles.phoneticText}>
                    {enrichedMistakes[currentIndex]?.phonetic}
                  </Text>
                  <TouchableOpacity
                    onPress={playOriginalAudio}
                    style={{ marginTop: 20 }}
                  >
                    <Image
                      source={require("../assets/icons/speaker.png")}
                      style={styles.speakerIcon}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Navigation Arrows and Microphone Button in a Row */}
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
                  {isFeedbackLoading || !currentWord ? (
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

                      {enrichedMistakes[currentIndex]?.transcribedText ? (
                        <>
                          <Text
                            style={[styles.tahminText, { marginBottom: 10 }]}
                          >
                            Sanırım "
                            {enrichedMistakes[currentIndex]?.transcribedText}"
                            dediniz.
                          </Text>

                          <Text
                            style={[
                              styles.instructionText,
                              { marginBottom: 10 },
                            ]}
                          >
                            {currentWord?.isCorrect
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

                          {currentWord?.ipucu && (
                            <Text style={styles.ipucuText}>
                              <Text style={styles.ipucuBold}>İpucu: </Text>
                              {currentWord.ipucu.replace(/^'|'$/g, "")}
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={[styles.tahminText, { marginBottom: 10 }]}>
                          {currentWord?.transcribedText
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

export default Geneltekrar;

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
    height: 430, // Sabit yükseklik ver
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 40, // Add margin to create space
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%", // Adjust to your design needs
    marginTop: 20, // Optional spacing
    marginBottom: 20, // Optional spacing for further alignment
  },
  prevButton: {
    padding: 10,
  },
  nextButton: {
    padding: 10,
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
  navBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
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
  speakerIcon: {
    width: 60,
    height: 60,
    tintColor: "#FF3B30", // isteğe bağlı renk
    marginTop: 10,
  },
});
