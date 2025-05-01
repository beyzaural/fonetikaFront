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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import BottomNavBar from "./BottomNavBar";
import { getUserIdFromToken } from "./utils/auth";
import Constants from "expo-constants";
/* import { checkDailyGoalAchieved } from "./CheckIfGoalAchieved";
import AsyncStorage from "@react-native-async-storage/async-storage";
 */
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Kelime = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Fetch random word from backend
  useEffect(() => {
    fetchRandomWord(null);
  }, []);

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

  const fetchRandomWord = (lastWordId = null) => {
    axios
      .get(`${API_URL}/api/words/random`, {
        params: { lastWordId, userId: getUserIdFromToken },
      })
      .then((res) => {
        const w = res.data;
        const enrichedWord = {
          ...w,
          definition: w.phoneticWriting || "",
          tahmin: "",
          instruction: "",
          kelime: w.phoneticWriting || "",
          ipucu: "",
        };

        setWords((prevWords) => {
          const updatedWords = [...prevWords, enrichedWord];
          if (prevWords.length === 0) {
            setCurrentIndex(0);
          } else {
            setCurrentIndex(updatedWords.length - 1);
          }
          return updatedWords;
        });
      })
      .catch((err) => {
        console.error("Random kelime alınamadı", err);
      });
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
  /*  {const fetchProgress = async () => {
    try {
      const userId = await getUserIdFromToken();
      const res = await axios.get(
        `http://localhost:8080/api/progress/${userId}`
      );
      const progress = res.data;
      checkDailyGoalAchieved(progress.todayCount, progress.dailyGoal);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };} */

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
      const userId = await getUserIdFromToken(); // 🔥 You forgot this! Must load it
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseJson = await response.json();
      console.log("✅ Full backend response:", responseJson);

      if (responseJson.correct) {
        setFeedback(responseJson.feedbackText); 
      } else {
        setFeedback(responseJson.feedbackText); 
      }
      

      // Save feedback for modal
      setWords((prevWords) => {
        const updatedWords = [...prevWords];
        updatedWords[currentIndex].transcribedText =
          responseJson.recognizedWord;
        updatedWords[currentIndex].isCorrect = responseJson.correct;
        return updatedWords;
      });

      // Progress Update
      await axios.post(`${API_URL}/api/progress/add`, null, {
        params: { userId, count: 1 },
      });

      // Save mispronounced if needed
      if (!responseJson.correct) {
        await axios.post(`${API_URL}/api/mispronounced-words/record`, {
          userId,
          wordId: currentWord.id,
        });
        console.log("❌ MispronouncedWord recorded.");
      }

      setShowFeedback(true);
    } catch (error) {
      console.error("❌ Error sending audio:", error);
      Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
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
    setShowFeedback(false);
    setIsRecording(false);

    const isCurrentWrong = words[currentIndex]?.isCorrect === false;

    setWords((prevWords) => {
      let updated = [...prevWords];

      // ❌ Eğer kelime yanlış telaffuz edildiyse, listeden çıkar
      if (isCurrentWrong) {
        updated.splice(currentIndex, 1); // mevcut kelimeyi çıkar
        setCurrentIndex((prev) => Math.max(0, prev - 1)); // indexi bir geri al
      } else {
        if (currentIndex < updated.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }

      return updated;
    });

    // Yeni kelime çek (yanlış da olsa hep yeni kelime çekiyoruz)
    const lastId = words[currentIndex]?.id || null;
    fetchRandomWord(lastId);
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
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.topContainer}>
          <View style={styles.wordContainer}>
            {words[currentIndex] ? (
              <>
                <Text style={styles.wordText}>{words[currentIndex].word}</Text>
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
          visible={showFeedback}
          onRequestClose={() => setShowFeedback(false)}
        >
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Geri Bildirim</Text>
              {words.length > 0 && words[currentIndex] ? (
                <>
                  <Text style={styles.tahminText}>
                    Sanırım “{words[currentIndex]?.transcribedText || "..."}”
                    dediniz.
                  </Text>
                  <Text style={styles.instructionText}>
                    {words[currentIndex]?.isCorrect
                      ? "✅ Doğru söylediniz!"
                      : "❌ Yanlış söylediniz. Bir kez daha deneyin."}
                  </Text>
                  <Text style={styles.kelimeText}>
                    {words[currentIndex].kelime.split("").map((char, index) => {
                      const isRed =
                        (words[currentIndex].word === "Kamuflaj" &&
                          char === "u") ||
                        (words[currentIndex].word === "Ağabey" &&
                          char === "i") ||
                        (words[currentIndex].word === "Sahi" && char === ":");
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

                  {words[currentIndex].ipucu !== "" && (
                    <Text style={styles.ipucuText}>
                      <Text style={styles.ipucuBold}>İpucu: </Text>
                      {words[currentIndex].ipucu}
                    </Text>
                  )}
                </>
              ) : (
                <Text>Yükleniyor...</Text>
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
      </View>
      <BottomNavBar navigation={navigation} />
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
  micInfoText: {
    fontSize: 14,
    color: "#6CA3AD",
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
});
