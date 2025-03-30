import React, { useEffect, useState } from "react";
import axios from "axios"; // <-- ekle
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

const Kelime = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  // 🔽 Yeni: backend'den kelimeleri çek
  useEffect(() => {
    fetchRandomWord(null); // İlk kelimeyi getir
  }, []);

  const fetchRandomWord = (lastWordId) => {
    axios
      .get(`http://localhost:8080/api/words/random`, {
        params: { lastWordId: lastWordId },
      })
      .then((res) => {
        console.log("Random kelime yüklendi", res.data);
        const w = res.data;
        const enrichedWord = {
          ...w,
          definition: w.phoneticWriting || "",
          tahmin: "Sanırım “a:bey” dediniz.",
          instruction: "İşaretli harfleri düzeltmeyi deneyebilirsiniz.",
          kelime: w.phoneticWriting || "",
          ipucu:
            "'Bi' sesini kısa, düz ve açık bir 'i' ile bitirin. 'bey' yerine 'bi' demeye odaklanın.",
        };
        setWords([enrichedWord]); // sadece 1 kelimeyi array olarak set et
        setCurrentIndex(0);
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
        setShowFeedback(true);
        setShowFeedback(true);
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
    const lastId = words[currentIndex]?.id || null;
    fetchRandomWord(lastId); // bir sonraki random kelimeyi getir
    setShowFeedback(false);
    setIsRecording(false);
  };

  const handlePreviousWord = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + words.length) % words.length
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
            {words.length > 0 ? (
              <>
                <Text style={styles.wordText}>{words[currentIndex].word}</Text>
                <Text style={styles.phoneticText}>
                  {words[currentIndex].definition}
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
              {words.length > 0 && words[currentIndex] ? (
                <>
                  <Text style={styles.tahminText}>
                    {words[currentIndex].tahmin}
                  </Text>
                  <Text style={styles.instructionText}>
                    {words[currentIndex].instruction}
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

              {/* Add Listen Button inside Feedback Container */}
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
