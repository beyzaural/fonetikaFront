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

const Geneltekrar = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [enrichedMistakes, setEnrichedMistakes] = useState([]);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const userId = "test-user"; // TODO: Gerçek userId
        const res = await axios.get(
          `http://localhost:8080/api/mispronounced-words/user/${userId}`
        );
        const mistakes = res.data;

        // Her mistake için wordId ile kelime detayını getir
        const enriched = await Promise.all(
          mistakes.map(async (mistake) => {
            const wordRes = await axios.get(
              `http://localhost:8080/api/words/id/${mistake.wordId}`
            );
            const wordData = wordRes.data;

            if (!wordData || !wordData.word) return null;

            return {
              ...mistake,
              word: wordData.word,
              phonetic: wordData.phoneticWriting,
              ipucu: "'Bu kelimeyi daha önce yanlış telaffuz ettiniz.'",
            };
          })
        );

        setEnrichedMistakes(enriched.filter((e) => e !== null));
      } catch (error) {
        console.error("❌ Hatalar alınamadı:", error);
      }
    };

    fetchMistakes();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
        setShowFeedback(true);
        setFeedback(enrichedMistakes[currentIndex]?.feedback || "");
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    } else {
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
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Top Container */}
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
          </View>

          {/* Navigation Arrows and Microphone Button in a Row */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.prevButton}
              onPress={handlePreviousWord}
            >
              <FontAwesome name="arrow-left" size={50} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMicrophonePress}>
              <FontAwesome
                name="microphone"
                size={100}
                color={isRecording ? "red" : "#FF3B30"}
              />
            </TouchableOpacity>
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

              {enrichedMistakes[currentIndex] ? (
                <>
                  <Text style={styles.tahminText}>
                    Sanırım “{enrichedMistakes[currentIndex].phonetic}” dediniz.
                  </Text>
                  <Text style={styles.instructionText}>
                    ❌ Yanlış söylediniz. Bir kez daha deneyin.
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

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeedback(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/icons/profile.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/icons/settings.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dersler")}
            style={styles.navItem}
          >
            <Image
              source={require("../assets/icons/fitness.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
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
    height: "52%",
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
});
