import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import BottomNavBar from "./BottomNavBar";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BackButton from "./BackButton";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_BASE = extra.apiUrl || "http://localhost:8080";

const Sohbet = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    handleStartQuiz(); // ekran açılınca quiz başlasın
  }, []);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(scrollToBottom, 100);
  };

  const handleStartQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/quiz/next`);
      const json = await res.json(); // { id, soru }

      setCurrentQuestionId(json.id);
      addMessage("assistant", json.soru);
    } catch (error) {
      console.error("Quiz start error:", error);
      Alert.alert("Error", "Couldn't load quiz question.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInputValue.trim() || !currentQuestionId) return;

    const userInput = textInputValue.trim();
    setTextInputValue("");
    setShowInput(false);

    addMessage("user", userInput);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/quiz/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestionId,
          answer: userInput,
        }),
      });

      const explanation = await res.text();
      addMessage("assistant", explanation);

      setTimeout(handleStartQuiz, 2000); // yeni soruyu getir
    } catch (error) {
      console.error("Answer submit error:", error);
      Alert.alert("Error", "Couldn't process your answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicPress = async () => {
    try {
      if (recording) {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setRecording(null);
          setIsRecording(false);
          handleAudioUpload(uri);
        }
      } else {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission Denied", "Microphone access is required.");
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
      }
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Recording failed. Try again.");
    }
  };

  const handleAudioUpload = async (uri) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      });

      const res = await fetch(`${API_BASE}/api/chat/conversation`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      addMessage("user", data.transcription);
      addMessage("assistant", data.response);
    } catch (error) {
      console.error("Voice upload error:", error);
      Alert.alert("Error", "Couldn't process audio.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndConversation = () => {
    Alert.alert("Sohbet bitti", "Ana ekrana dönmek ister misin?", [
      { text: "İptal", style: "cancel" },
      { text: "Evet", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={item.sender === "user" ? styles.userText : styles.assistantText}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Üst Başlık */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.headerText}>Sohbet</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.chatList}
            contentContainerStyle={styles.chatContainer}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#FF3B30"
          style={{ margin: 10 }}
        />
      )}

      {showInput && (
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Cevabını yaz..."
            value={textInputValue}
            onChangeText={setTextInputValue}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleTextSubmit}
          >
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Alt Iconlar */}
      <View style={styles.microphoneContainer}>
        <View style={styles.iconButtonWithText}>
          <TouchableOpacity onPress={() => setShowInput(true)}>
            <FontAwesome
              name="keyboard-o"
              size={40}
              style={{ paddingTop: 20 }}
              color="#FF3B30"
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>Yazılı</Text>
        </View>
        <TouchableOpacity onPress={handleMicPress} style={{ paddingTop: 20 }}>
          <FontAwesome
            name="microphone"
            size={85}
            color={isRecording ? "black" : "#FF3B30"}
          />
        </TouchableOpacity>
        <View style={styles.iconButtonWithText}>
          <TouchableOpacity onPress={handleEndConversation}>
            <FontAwesome
              name="times"
              size={50}
              style={{ paddingTop: 20 }}
              color="#FF3B30"
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>Bitir</Text>
        </View>
      </View>

      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default Sohbet;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  topContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  headerText: {
    paddingTop: 25,
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    padding: 12,
    justifyContent: "center",
  },
  chatContainer: {
    flexGrow: 1,
    padding: 12,
    paddingBottom: 130,
  },

  message: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: "70%",
  },

  userBubble: {
    backgroundColor: "#F9F4F1",
    alignSelf: "flex-end",
  },
  assistantBubble: {
    backgroundColor: "#6CA3AD",
    alignSelf: "flex-start",
  },
  userTextText: {
    fontSize: 16,
    color: "#000",
  },
  assistantText: {
    fontSize: 16,
    color: "#fff",
  },
  microphoneContainer: {
    //flex: 1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    zIndex: 10,
    paddingBottom: 20, // Prevent overlap with SafeArea
    shadowColor: "#000", // Optional: Shadow for better aesthetics
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  iconButtonWithText: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  iconText: {
    fontSize: 14,
    color: "#FF3B30",
    marginTop: 5,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  feedbackContent: {
    height: "40%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#880000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatList: {
    backgroundColor: 'transparent',
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  textInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 25,
  },
});
