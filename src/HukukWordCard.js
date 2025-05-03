import React, { useEffect, useState } from "react";
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
import Constants from "expo-constants";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getUserIdFromToken } from "./utils/auth";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const HukukWordCard = () => {
  const [wordData, setWordData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recordedUri, setRecordedUri] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { wordText } = route.params;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/hukuk-words/${wordText}`)
      .then((res) => {
        if (res.data) {
          setWordData(res.data);
        } else {
          Alert.alert("Hata", "Kelime bulunamadı.");
        }
      })
      .catch((err) => {
        console.error("Kelime alınamadı:", err);
        Alert.alert("Hata", "Kelime getirilemedi.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Kayıt başlatılamadı:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error("Kayıt durdurulamadı:", err);
    }
  };

  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
    } catch (err) {
      console.error("Ses çalınamadı:", err);
    }
  };

  const submitRecording = async () => {
    try {
      setIsSubmitting(true);
      const userId = await getUserIdFromToken();
      const formData = new FormData();
      formData.append("file", {
        uri: recordedUri,
        name: "audio.wav",
        type: "audio/wav",
      });
      formData.append("expectedWord", wordText);
      formData.append("userId", userId);

      formData.append("word_id", wordData.id); 

      const res = await axios.post(`${API_URL}/api/speech/evaluate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFeedback(res.data);
    } catch (err) {
      console.error("Kayıt gönderilemedi:", err);
      Alert.alert("Hata", "Ses kaydı gönderilirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !wordData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.wordText}>{wordData.word}</Text>
      <Text style={styles.pronText}>{wordData.phoneticWriting}</Text>

      {!recording && (
        <TouchableOpacity style={styles.button} onPress={startRecording}>
          <Text style={styles.buttonText}>🎙️ Kayıt Başlat</Text>
        </TouchableOpacity>
      )}
      {recording && (
        <TouchableOpacity style={styles.button} onPress={stopRecording}>
          <Text style={styles.buttonText}>🛑 Durdur</Text>
        </TouchableOpacity>
      )}

      {recordedUri && (
        <>
          <TouchableOpacity style={styles.button} onPress={playAudio}>
            <Text style={styles.buttonText}>▶️ Sesini Dinle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={submitRecording}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>📤 Gönder ve Değerlendir</Text>
          </TouchableOpacity>
        </>
      )}

      {feedback && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>
            {feedback.success
              ? "✅ Doğru telaffuz ettiniz!"
              : `❌ Galiba "${feedback.transcribedWord}" dediniz.`}
          </Text>
          {!feedback.success && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setRecordedUri(null)}
            >
              <Text style={styles.buttonText}>🔁 Tekrar Dene</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>◀️ Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HukukWordCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  wordText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  pronText: {
    fontSize: 20,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FFF3F3",
  },
  feedbackText: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    fontSize: 16,
    color: "#2196F3",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
