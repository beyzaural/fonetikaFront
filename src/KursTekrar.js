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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import BottomNavBar from "./BottomNavBar";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;
import { getUserIdFromToken } from "./utils/auth";

const KursTekrar = ({ navigation, route }) => {
  const { courseId, phoneme } = route?.params || {};
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [enrichedMistakes, setEnrichedMistakes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  const normalizePhoneme = (p) => {
    const map = {
      "ı/i": "ı",
      "u/ü": "u",
      "o/ö": "o",
    };
    return map[p] || p;
  };

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) return;

        const res = await axios.get(
          `${API_URL}/api/mispronounced-words/user-course-phoneme`,
          {
            params: {
              phoneme: normalizePhoneme(phoneme),
              userId, // ✅ now this is valid again
            },
          }
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
      } catch (error) {
        console.error("❌ Hatalar alınamadı:", error);
      }
    };

    fetchMistakes();
  }, [phoneme]);

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

  const sendAudioToBackend = async (uri) => {
    try {
      const userId = await getUserIdFromToken();
      const currentWord = enrichedMistakes[currentIndex];

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
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const responseJson = await response.json();
      console.log("✅ KursTekrar backend response:", responseJson);

      await axios.post(`${API_URL}/api/progress/add`, null, {
        params: { phoneme: normalizePhoneme(phoneme), userId },
      });

      setFeedback(responseJson.feedback);

      if (responseJson.correct) {
        await axios.post(
          `${API_URL}/api/mispronounced-words/record-pronunciation`,
          {
            userId,
            wordId: currentWord.wordId,
            correct: true,
          }
        );
      }

      setEnrichedMistakes((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          ...updated[currentIndex],
          transcribedText: responseJson.transcribedText,
          isCorrect: responseJson.correct,
        };
        return updated;
      });

      setShowFeedback(true);
    } catch (error) {
      console.error("❌ Feedback alınırken hata oluştu:", error);
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
        await sendAudioToBackend(uri);
      } catch (error) {
        console.error("Error stopping recording:", error);
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
        console.error("Failed to start recording:", error);
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
      console.error("Error playing audio:", error);
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % enrichedMistakes.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  const handlePreviousWord = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + enrichedMistakes.length) % enrichedMistakes.length
    );
    setShowFeedback(false);
    setIsRecording(false);
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
              {enrichedMistakes[currentIndex] ? (
                <>
                  <Text style={styles.wordText}>
                    {enrichedMistakes[currentIndex].word}
                  </Text>
                  <Text style={styles.phoneticText}>
                    {enrichedMistakes[currentIndex].phonetic}
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
            visible={showFeedback}
            onRequestClose={() => setShowFeedback(false)}
          >
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackContent}>
                <TouchableOpacity
                  onPress={() => setShowFeedback(false)}
                  style={styles.modalCloseIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name="close" size={26} color="#FF3B30" />
                </TouchableOpacity>

                <Text style={styles.feedbackTitle}>Geri Bildirim</Text>

                {enrichedMistakes[currentIndex] ? (
                  <>
                    <Text style={styles.tahminText}>
                      Sanırım "{enrichedMistakes[currentIndex]?.transcribedText || "..."}"
                      dediniz.
                    </Text>
                    <Text style={styles.instructionText}>
                      {enrichedMistakes[currentIndex]?.isCorrect
                        ? "✅ Doğru söylediniz!"
                        : "❌ Yanlış söylediniz. Bir kez daha deneyin."}
                    </Text>
                    <Text style={styles.kelimeText}>
                      {enrichedMistakes[currentIndex].phonetic
                        .split("")
                        .map((char, index) => {
                          const isRed =
                            (enrichedMistakes[currentIndex].word === "Kamuflaj" &&
                              char === "u") ||
                            (enrichedMistakes[currentIndex].word === "Ağabey" &&
                              char === "i") ||
                            (enrichedMistakes[currentIndex].word === "Sahi" &&
                              char === ":");

                          return (
                            <Text
                              key={index}
                              style={isRed ? styles.redText : styles.blackText}
                            >
                              {char}
                            </Text>
                          );
                        })}
                    </Text>

                    {enrichedMistakes[currentIndex].ipucu && (
                      <Text style={styles.ipucuText}>
                        <Text style={styles.ipucuBold}>İpucu: </Text>
                        {enrichedMistakes[currentIndex].ipucu}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text>Yükleniyor...</Text>
                )}

                <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
                  <Text style={styles.listenButtonText}>Dinle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default KursTekrar;

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
