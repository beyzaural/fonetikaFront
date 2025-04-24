import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import BottomNavBar from "./BottomNavBar";
import jwtDecode from "jwt-decode";
import { getUserIdFromToken } from "./utils/auth";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const Paragraph = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");

  const [fontsLoaded] = useFonts({
    "Parkinsans-Medium": require("../assets/fonts/Parkinsans-Medium.ttf"),
    "Parkinsans-Bold": require("../assets/fonts/Parkinsans-Bold.ttf"),
    "NotoSans-SemiBold": require("../assets/fonts/NotoSans-SemiBold.ttf"),
    "NotoSans-Regular": require("../assets/fonts/NotoSans-Regular.ttf"),
    "SourGummy-Medium": require("../assets/fonts/SourGummy-Medium.ttf"),
    "Itim-Regular": require("../assets/fonts/Itim-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
  });

  const fetchParagraph = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token"); // ✅ Retrieve token

      if (!token) {
        throw new Error("Yetkilendirme hatası: Kullanıcı giriş yapmamış.");
      }

      const response = await fetch(`${API_URL}/api/chat/generate-paragraph`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error(
          `Paragraf yüklenirken hata oluştu: ${errorData.message}`
        );
      }

      const data = await response.text();
      setParagraph(data);
    } catch (error) {
      console.error("Error fetching paragraph:", error);
      setParagraph("Paragraf yüklenirken hata oluştu. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  };

  // Fetch paragraph on mount
  useEffect(() => {
    fetchParagraph();
  }, []);

  const paragraphs = [
    "Bugün sabah kahvaltıda bir kahve içtim ve radyoda sevdiğim bir müzik çalıyordu. Öğle saatlerinde bir avukat ile görüşmem gerekti. Ancak randevuma geç kalınca İstanbul trafiğinde bir saat boyunca beklemek zorunda kaldım. Sonunda buluşmaya vardığımda, herkesin toplantıda olduğunu gördüm. Toplantıda, yeni çıkan bir program ve rakip şirket hakkında konuştuk.",
    "Akşam saatlerinde dışarıda yürüyüş yaparken eski bir dostumla karşılaştım. Uzun süredir görüşemediğimiz için bir kafeye oturup sohbet etmeye karar verdik. Sohbet sırasında geçmiş anılarımızı yad ettik ve birlikte güzel planlar yaptık.",
    "Bir gün kütüphaneye gidip kitap okumaya karar verdim. Orada saatlerce vakit geçirerek hem yeni şeyler öğrendim hem de çok keyif aldım. Kitapların büyülü dünyasına dalmak bana huzur verdi.",
  ];

  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  const handleRestartConversation = () => {
    setCurrentParagraphIndex((prevIndex) =>
      prevIndex < paragraphs.length - 1 ? prevIndex + 1 : 0
    );
  };

  const sendAudioToBackend = async (uri) => {
    try {
      setLoading(true);
      let fileData;
      if (uri.startsWith("blob:")) {
        const response = await fetch(uri);
        const blob = await response.blob();
        fileData = new File([blob], "recording.m4a", { type: "audio/m4a" });
      } else {
        fileData = {
          uri,
          name: "recording.m4a",
          type: "audio/m4a",
        };
      }

      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("expected_word", paragraph);

      const response = await fetch("http://localhost:8080/api/speech/process", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const data = await response.json();
      console.log("✅ Backend:", data);

      const transcribed = data.transcribedText || "";
      const spokenWordCount = transcribed
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.sub || decoded.userId;

        await axios.post(`${API_URL}/api/progress/add`, null, {
          params: {
            userId,
            count: spokenWordCount,
          },
        });
      }

      setFeedback(data.feedback);
      setTranscribedText(data.transcribedText);
      setShowFeedback(true);
    } catch (error) {
      console.error("❌ Error sending audio:", error);
      Alert.alert("Hata", "Ses işlenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved to:", uri);
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
        sendAudioToBackend(uri); // ← burada çağır
      } catch (err) {
        console.error("Error stopping recording:", err);
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
      } catch (err) {
        console.error("Failed to start recording:", err);
      }
    }
  };

  // Function to play the recorded audio
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
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>Paragraf Okuma</Text>
      </View>

      <View style={styles.microphoneContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Text style={styles.paragraphText}>{paragraph}</Text>
        )}

        <View style={styles.buttonsRow}>
          <View style={styles.iconButtonWithText}>
            <TouchableOpacity onPress={fetchParagraph}>
              <FontAwesome name="refresh" size={50} color="#FF3B30" />
            </TouchableOpacity>
            <Text style={styles.iconText}>Yenile</Text>
          </View>

          <TouchableOpacity
            onPress={handleMicrophonePress}
            style={styles.microphoneButton}
          >
            <FontAwesome
              name="microphone"
              size={100}
              color={isRecording ? "black" : "#FF3B30"}
            />
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

            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackLabel}>Beklenen:</Text> {"\n"}
              {paragraph}
            </Text>

            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackLabel}>Anlaşılan:</Text> {"\n"}
              {transcribedText || "Tanımlanamadı"}
            </Text>

            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackLabel}>Yorum:</Text> {"\n"}
              {feedback}
            </Text>

            <TouchableOpacity
              style={styles.listenButton}
              onPress={() => setShowFeedback(false)}
            >
              <Text style={styles.listenButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default Paragraph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column", // ✔️ alt çubuğu en alta it
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  topContainer: {
    // flex: 1,
    flexDirection: "row",
    height: "20%",
    // alignItems: "center", // Centers horizontally only
    paddingVertical: 20,
    paddingTop: 30, // Ensures the text starts from the top
    backgroundColor: "#E3EFF0",
  },

  titleText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Ensures the text centers itself in the row
  },
  paragraphText: {
    fontSize: 18,
    marginTop: 60,
    paddingHorizontal: 12,
    fontFamily: "Parkinsans-Medium",
    color: "#333",
    lineHeight: 28,
  },
  microphoneContainer: {
    bottom: 0,
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    paddingHorizontal: 15,
    paddingBottom: 10, // Ensures padding at the bottom
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "absolute",
    bottom: 20, // Keeps the microphone row 60-space padding from the bottom
    width: "100%",
  },
  iconButtonWithText: {
    alignItems: "center",
    position: "absolute",
    left: 40,
  },
  microphoneButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
    color: "#FF3B30",
    marginTop: 5,
  },

  listenButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#880000",
    borderRadius: 10,
    alignItems: "center",
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

  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  feedbackText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },

  feedbackLabel: {
    fontWeight: "bold",
    color: "#FF3B30",
    fontSize: 16,
  },
});
