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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getUserIdFromToken } from "../src/utils/auth";// you already have this

const API_URL =
  Constants.expoConfig?.extra?.apiUrl || Constants.manifest?.extra?.apiUrl;

const targetWords = [
  //"dermek",
  //"poster",
  "amber",
  "halter",
  //"diyetisyen",
  //"personel",
  //"söğüt",
  //"şöbiyet",
  //"ömür",
  //"çöl",
  //"övünmek",
  //"görkem",
  //"öğle",
  //"asansör",
  //"yönetim",
  //"külah",
  "selam",
  //"bilakis",
  "ilan",
  //"şarkı",
  //"bostancı",
  //"penaltı",
  "gıda",
  //"ıtır",
  //"nakış",
  //"kılıbık",
  //"horon",
  //"boykot",
  //"ordu",
  //"doğru",
  //"kudüs",
  //"öksürük",
  //"külüstür",
  //"omuz",
  //"yumurcak",
  //"kurulu",
];

const Record = () => {
  const router = useRouter();
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

  const handleSaveRecording = async () => {
    const finalRecording = {
      word: targetWords[currentWordIndex],
      uri: latestRecordingUri,
    };

    setLatestRecordingUri(null);
    setIsUploading(true);

    const uploadResult = await uploadSingleRecording(finalRecording);

    setIsUploading(false);

    if (uploadResult?.correct) {
      if (currentWordIndex < targetWords.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setLatestRecordingUri(null);
        setFeedbackMessage(null);
        setIsCorrect(null);
      } else {
        router.push("/goal-selection");
      }
    }
  };

  const handleRetryRecording = async () => {
    setLatestRecordingUri(null); // discard previous recording
    setFeedbackMessage(null); // clear old message
    setIsCorrect(null); // reset status

    await startRecording(); // record again

    // Wait until recording is finished manually via mic button (user stops)
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
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.wordToPronounce}>
          Lütfen aşağıdaki kelimeyi kaydedin: {targetWords[currentWordIndex]}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        {isUploading ? (
          <>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.uploadingText}>Her şey yükleniyor...</Text>
          </>
        ) : latestRecordingUri ? (
          <View style={styles.actionsContainer}>
            {feedbackMessage && (
              <Text style={styles.instruction}>{feedbackMessage}</Text>
            )}

            <View style={styles.buttonGroup}>
              {!isCorrect && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleRetryRecording}
                >
                  <Text style={styles.actionButtonText}>Tekrar Kaydet</Text>
                </TouchableOpacity>
              )}

              {isCorrect !== false && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSaveRecording}
                  disabled={isUploading}
                >
                  <Text style={styles.actionButtonText}>Kaydet</Text>
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
              ]}
              disabled={isUploading}
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
        <Text style={styles.disclaimer}>
          Uygulamamız KVKK yasalarına uygun şekilde tasarlanmıştır. Kişisel
          verileriniz korunur ve paylaşılmaz.
        </Text>
      </View>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
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
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "NotoSans-Regular",
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
});
