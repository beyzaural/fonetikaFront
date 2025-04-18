import React, { useState, useRef } from "react";
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
} from "react-native";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { Modal } from "react-native";
import BottomNavBar from "./BottomNavBar";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const API_BASE = "http://localhost:8080"; // Update if needed

const Sohbet = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
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

  const handleRestartConversation = () => {
    setMessages([]);
  };

  const handleEndConversation = () => {
    setShowFeedback(true);
  };

  const handleAudioUpload = async (uri) => {
    try {
      setLoading(true);

      let fileData;
      if (uri.startsWith("blob:")) {
        const response = await fetch(uri);
        const blob = await response.blob();
        fileData = new File([blob], "recording.m4a", { type: "audio/m4a" });
      } else {
        fileData = {
          uri: uri,
          name: "recording.m4a",
          type: "audio/m4a",
        };
      }

      const formData = new FormData();
      formData.append("file", fileData);

      const chatRes = await fetch(`${API_BASE}/api/chat/conversation`, {
        method: "POST",
        body: formData, // ✅ Multipart gönder
      });

      const chatData = await chatRes.json();

      addMessage("user", chatData.transcription);

      addMessage("assistant", chatData.response);
    } catch (error) {
      console.error("Voice chat failed:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(scrollToBottom, 100);
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
    <View
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/images/backspace.png")} // 👈 Kelime ekranındaki ile aynı dosya
            style={styles.backIcon}
          />
        </TouchableOpacity>
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

      {loading && (
        <ActivityIndicator
          size="large"
          color="#FF3B30"
          style={{ margin: 10 }}
        />
      )}

      {/* Microphone and Icons */}
      <View style={styles.microphoneContainer}>
        <View style={styles.iconButtonWithText}>
          <TouchableOpacity onPress={handleRestartConversation}>
            <FontAwesome
              name="refresh"
              size={40}
              style={{ paddingTop: 20 }}
              color="#FF3B30"
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>Yenile</Text>
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
      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
      >
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>Conversation Feedback</Text>
            <Text style={styles.feedbackText}>
              Great job practicing your conversation skills!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFeedback(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Sohbet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EFF0",
  },
  topContainer: {
    backgroundColor: "#E3EFF0",
    paddingVertical: 30,
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
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
    fontWeight: "bold",
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
    flexGrow: 1, // FlatList’in içeriği kadar uzamasını sağlar
    padding: 12,
    paddingBottom: 130, // mikrofon paneline çarpmaması için yeterli boşluk
    backgroundColor: "#E3EFF0",
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
    backgroundColor: "#E3EFF0", // bu sayede yüklenirken de bu renk görünür
  },
});
