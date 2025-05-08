import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getUserIdFromToken } from "./utils/auth"; // you already have this
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl || Constants.manifest?.extra?.apiUrl;

const targetWords = [
  "dermek",
  "poster",
  "amber",
  "halter",
  "diyetisyen",
  "personel",
  "söğüt",
  "şöbiyet",
  "ömür",
  "çöl",
  "övünmek",
  "görkem",
  "asansör",
  "yönetim",
  "külah",
  "selam",
  "bilakis",
  "ilan",
  "şarkı",
  "bostancı",
  "penaltı",
  "gıda",
  //"ıtır",
  "nakış",
  "kılıbık",
  "horon",
  "boykot",
  //"ordu",
  "doğru",
  "kudüs",
  "öksürük",
  "külüstür",
  "omuz",
  "yumurcak",
  "kurulu",
  "şelale",
  "selanik",
  "muallak",
  "bilardo", //burdan itibaren denemek için
  "derhal",
  "dublaj",
  "ender",
  "enerji",
  "envanter",
];

const Record = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    "Parkinsans-Medium": require("../assets/fonts/Parkinsans-Medium.ttf"),
    "NotoSans-Regular": require("../assets/fonts/NotoSans-Regular.ttf"),
    "SourGummy-Medium": require("../assets/fonts/SourGummy-Medium.ttf"),
  });

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [latestRecordingUri, setLatestRecordingUri] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [recordedWords, setRecordedWords] = useState([]);
  const [isFromSettings, setIsFromSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchId = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("🧪 Raw token:", token);
      const uid = await getUserIdFromToken();
      console.log("🧪 Decoded user ID:", uid);
      if (!uid) {
        Alert.alert("Error", "User ID could not be loaded.");
      }
      setUserId(uid);
    };
    fetchId();
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // If coming from settings, load saved progress
        if (route.params?.fromSettings) {
          const savedProgress = await AsyncStorage.getItem('voiceRecordingProgress');
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setRecordedWords(progress.recordedWords);
            setCurrentWordIndex(progress.currentIndex);
          }
        } else {
          // If starting new voice profile creation, clear any existing progress
          await AsyncStorage.removeItem('voiceRecordingProgress');
          setRecordedWords([]);
          setCurrentWordIndex(0);
        }
      } catch (error) {
        console.error('Error handling progress:', error);
      }
    };

    if (route.params?.fromSettings) {
      setIsFromSettings(true);
    }

    loadProgress();
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Microphone permission is needed.");
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
      console.log("✅ Recording started");
    } catch (error) {
      console.error("❌ Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording. Try again.");
    }
  };

  const uploadSingleRecording = async (rec) => {
    const formData = new FormData();
    const sanitizedWord = sanitizeWord(rec.word);

    formData.append("file", {
      uri: rec.uri,
      name: `${sanitizedWord}.m4a`,
      type: "audio/m4a",
    });

    formData.append("expected_word", rec.word);
    formData.append("user_id", userId);

    try {
      const response = await fetch(
        `${API_URL}/api/speech/profile-user-incremental`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("✅ Backend full response:", data);

      setFeedbackMessage(data.message);
      setIsCorrect(data.correct);

      return data; // 👈 return response to caller
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "An error occurred while uploading.");
      return null;
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording saved to:", uri);

      setRecording(null);
      setIsRecording(false);
      setLatestRecordingUri(uri); // Save temporarily
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };
  const [recordingInProgress, setRecordingInProgress] = useState(false);

  const handlePressMicrophone = async () => {
    if (recordingInProgress) return; // prevent spamming
    setRecordingInProgress(true);
    try {
      if (recording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } finally {
      setRecordingInProgress(false);
    }
  };

  const saveProgress = async () => {
    try {
      const progress = {
        recordedWords,
        currentIndex: currentWordIndex
      };
      await AsyncStorage.setItem('voiceRecordingProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSaveRecording = async () => {
    if (isProcessing) return; // Prevent multiple saves
    setIsProcessing(true);

    const finalRecording = {
      word: targetWords[currentWordIndex],
      uri: latestRecordingUri,
    };

    setLatestRecordingUri(null);
    setIsUploading(true);

    try {
      const uploadResult = await uploadSingleRecording(finalRecording);
      
      if (uploadResult?.correct) {
        // Only add to recordedWords if the pronunciation was correct
        const newRecordedWords = [...recordedWords, currentWordIndex];
        setRecordedWords(newRecordedWords);
        await saveProgress();

        if (currentWordIndex < targetWords.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
          setLatestRecordingUri(null);
          setFeedbackMessage(null);
          setIsCorrect(null);
        } else {
          // All words recorded
          await AsyncStorage.removeItem('voiceRecordingProgress');
          if (isFromSettings) {
            navigation.goBack();
          } else {
            navigation.navigate("GoalSelection");
          }
        }
      } else {
        // If pronunciation was incorrect, don't update recordedWords
        // Just show the feedback message and allow retry
        setFeedbackMessage(uploadResult?.message || "Lütfen tekrar deneyin");
        setIsCorrect(false);
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      // Reset states for retry
      setLatestRecordingUri(null);
      setFeedbackMessage(null);
      setIsCorrect(null);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleExit = async () => {
    await saveProgress();
    if (isFromSettings) {
      navigation.goBack();
    } else {
      navigation.navigate("GoalSelection");
    }
  };

  const handleRetryRecording = async () => {
    if (isProcessing) return; // Prevent multiple retries
    setIsProcessing(true);

    try {
      setLatestRecordingUri(null);
      setFeedbackMessage(null);
      setIsCorrect(null);
      // Remove the automatic recording start
      // await startRecording();
    } catch (error) {
      console.error('Error retrying recording:', error);
      Alert.alert('Hata', 'Kayıt başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.wordToPronounce}>
            Lütfen aşağıdaki kelimeyi kaydedin: {targetWords[currentWordIndex]}
          </Text>
          <Text style={styles.progressText}>
            {recordedWords.length} / {targetWords.length} kelime kaydedildi
          </Text>
        </View>

        <View style={styles.centerContainer}>
          {isUploading || isProcessing ? (
            <>
              <ActivityIndicator size="large" color="black" />
              <Text style={styles.uploadingText}>İşleniyor...</Text>
            </>
          ) : latestRecordingUri ? (
            <View style={styles.actionsContainer}>
              {feedbackMessage && (
                <Text style={[
                  styles.instruction,
                  isCorrect === false && styles.errorText
                ]}>
                  {feedbackMessage}
                </Text>
              )}

              <View style={styles.buttonGroup}>
                {!isCorrect && (
                  <TouchableOpacity
                    style={[styles.actionButton, isProcessing && styles.disabledButton]}
                    onPress={handleRetryRecording}
                    disabled={isProcessing}
                  >
                    <LinearGradient
                      colors={["#007AFF", "#0055FF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.actionButtonText}>Tekrar Kaydet</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {isCorrect !== false && (
                  <TouchableOpacity
                    style={[styles.actionButton, isProcessing && styles.disabledButton]}
                    onPress={handleSaveRecording}
                    disabled={isProcessing}
                  >
                    <LinearGradient
                      colors={["#007AFF", "#0055FF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.actionButtonText}>Kaydet</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={handlePressMicrophone}
                style={[
                  styles.microphoneButton,
                  { backgroundColor: isRecording ? "#880000" : "black" },
                  isProcessing && styles.disabledButton
                ]}
                disabled={isProcessing}
              >
                <Image
                  source={require("../assets/icons/microphone-black-shape.png")}
                  style={styles.microphoneIcon}
                />
              </TouchableOpacity>
              <Text style={styles.instruction}>
                {isRecording
                  ? "Kayıt başladı... Durdurmak için tekrar basınız."
                  : "Kayıt için mikrofona basınız."}
              </Text>
            </>
          )}
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={[
              styles.exitButton, 
              (isProcessing || isUploading) && styles.disabledButton
            ]}
            onPress={handleExit}
            disabled={isProcessing || isUploading}
          >
            <Text style={[
              styles.exitButtonText,
              (isProcessing || isUploading) && styles.disabledButtonText
            ]}>
              {isFromSettings ? 'Geri Dön' : 'Daha Sonra Devam Et'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            Uygulamamız KVKK yasalarına uygun şekilde tasarlanmıştır. Kişisel
            verileriniz korunur ve paylaşılmaz.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  wordToPronounce: {
    fontSize: 22,
    color: "black",
    textAlign: "center",
    marginTop: 40,
    fontFamily: "Parkinsans-Medium",
  },
  centerContainer: {
    top: "10%",
    alignItems: "center",
    flex: 1,
  },
  instruction: {
    marginTop: 30,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    fontFamily: "NotoSans-Regular",
  },
  microphoneButton: {
    width: 180,
    height: 180,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  microphoneIcon: {
    width: 90,
    height: 90,
    tintColor: "white",
  },
  footerContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  disclaimer: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "NotoSans-Regular",
  },
  actionsContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  actionButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  uploadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    fontFamily: "NotoSans-Regular",
  },
  buttonGroup: {
    marginTop: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  exitButton: {
    backgroundColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  exitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
  errorText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
});
