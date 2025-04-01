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

const AUDIO_UPLOAD_URL = "http://localhost:8080/api/speech/process";

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

  const fetchRandomWord = (lastWordId = null) => {
    axios
      .get(`http://localhost:8080/api/words/random`, {
        params: { lastWordId },
      })
      .then((res) => {
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

  // Send the audio file to the backend. The backend should perform any necessary conversion.
  const sendAudioToBackend = async (uri) => {
    try {
      let fileData;
      // For web: if the URI is a blob URL, convert it to a temporary File object.
      if (uri.startsWith("blob:")) {
        fileData = await createTemporaryFile(uri);
      } else {
        // For native platforms, use the provided URI.
        fileData = {
          uri,
          name: "recording.m4a",
          type: "audio/m4a",
        };
      }
      
      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("expected_word", words[currentIndex]?.word || "");
      
      // Set Accept to application/json so that the backend returns JSON.
      const response = await fetch(AUDIO_UPLOAD_URL, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData,
      });
      
      const data = await response.json();
      console.log("✅ Backend Response:", data);
      setFeedback(data.feedback);
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
          </View>

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
    marginBottom: 40,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    marginBottom: 20,
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
