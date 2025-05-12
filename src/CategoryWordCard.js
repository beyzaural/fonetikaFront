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
import BottomNavBar from "./BottomNavBar";
import { getUserIdFromToken } from "./utils/auth";
import Constants from "expo-constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BackButton from "./BackButton";

/* import { checkDailyGoalAchieved } from "./CheckIfGoalAchieved";
import AsyncStorage from "@react-native-async-storage/async-storage";
 */
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const CategoryWordCard = ({ navigation, route }) => {

  const insets = useSafeAreaInsets();
  const { wordText, field } = route.params;
  const [wordData, setWordData] = useState(null);
  const [transcribedText, setTranscribedText] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // const [words, setWords] = useState([]);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // replaces showFeedback
  const [sttPreview, setSttPreview] = useState(null); // for Google STT preview
  const [alternativesMap, setAlternativesMap] = useState({});
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState([]);

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
          alert("Microphone permission is required to record audio.");
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

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/wav",
        name: sanitizeWord(wordData.word || "audio") + ".wav",
      });
      
      
      formData.append("expected_word", wordData.word);
      formData.append("user_id", userId);
      formData.append("word_id", wordData.id);
      formData.append("category", field.toLowerCase());

      if (!wordData?.id || !wordData?.word) {
        Alert.alert("Hata", "Kelime bilgisi alınamadı, lütfen tekrar deneyin.");
        return;
      }
      
      const response = await fetch(`${API_URL}/api/speech/evaluate-category`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      console.log("✅ category:", formData.category);

      const responseJson = await response.json();
      setSttPreview(null);
      console.log("✅ Full backend response:", responseJson);
      setTranscribedText(responseJson.recognizedWord);
      setIsCorrect(responseJson.wordCorrect === true || responseJson.wordCorrect === "true");
      
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
          wordId: wordData.id,
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
            {wordData ? (
              <>
                <Text style={styles.wordText}>{wordData.word}</Text>
                <Text style={styles.phoneticText}>{wordData.phoneticWriting}</Text>
                <Text style={styles.meaningText}>{wordData.meaning}</Text>
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

              <View   style={{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }}>
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
                  {isFeedbackLoading ? (
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

                      {transcribedText ? (
                      <>
                        <Text style={styles.tahminText}>
                          Sanırım "{transcribedText}" dediniz.
                        </Text>

                        <Text style={styles.instructionText}>
                          {isCorrect
                            ? "Analizin sonuçları:"
                            : "Lütfen tekrar deneyin, bazı hatalar algılandı!"}
                        </Text>

                        {feedback !== "" && (
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
                                    <Text style={{ fontWeight: "bold", color: "#FF3B30" }}>
                                      "{subword}"
                                    </Text>{" "}
                                    (
                                    <Text style={{ fontWeight: "bold", color: "#007AFF" }}>
                                      {vowelIpa}
                                    </Text>
                                    ): <Text>{message}</Text>
                                  </Text>
                                );
                              } else {
                                return (
                                  <Text
                                    key={index}
                                    style={{ fontSize: 14, color: "#333", lineHeight: 20 }}
                                  >
                                    {line}
                                  </Text>
                                );
                              }
                            })}
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.tahminText}>
                        Lütfen tekrar kaydedin, ses net bir şekilde algılanamadı...
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
    justifyContent: "space-between",
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
  speakerIcon: {
    marginTop: 20,
    width: 60,
    height: 60,
    tintColor: "#FF3B30", // opsiyonel, beyaz renkte olsun istersen
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
    //padding:20,
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
  ipucuText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
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
  micInfoText: {
    fontSize: 14,
    color: "#6CA3AD",
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 10, // prevents content from touching the bottom
    paddingHorizontal: 15,
    paddingVertical: 10, // adds horizontal space
  },
  meaningText: {
    fontSize: 16,
    color: "#6CA3AD",
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  modalCloseIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },
});
