import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

const Sohbet = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Merhaba! Bugün nasılsın?" },
    { id: 2, sender: "user", text: "İyiyim, teşekkürler! Sen?" },
    { id: 3, sender: "bot", text: "Ben de iyiyim. Bugün ne yapmak istersin?" },
    { id: 6, sender: "user", text: "Konuşma pratiği yapmak istiyorum." },
    { id: 7, sender: "bot", text: "Pekala! Hadi başlayalım." },
    { id: 8, sender: "bot", text: "Sana birkaç soru soracağım, hazır mısın?" },
    { id: 9, sender: "user", text: "Evet, hazırım!" },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleMicrophonePress = async () => {
    if (isRecording) {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording saved to:", uri);
      setRecording(null);
    } else {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status === "granted") {
          setIsRecording(true);
          const newRecording = new Audio.Recording();
          await newRecording.prepareToRecordAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
          await newRecording.startAsync();
          setRecording(newRecording);
        }
      } catch (error) {
        console.error("Recording error:", error);
      }
    }
  };

  const handleEndConversation = () => {
    setShowFeedback(true);
  };

  const handleRestartConversation = () => {
    setMessages([{ id: 1, sender: "bot", text: "Merhaba! Bugün nasılsın?" }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sohbet</Text>
      </View>

      {/* Chat Container with ScrollView */}
      <View style={styles.chatContainer}>
        <ScrollView>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.message,
                message.sender === "user"
                  ? styles.userMessage
                  : styles.botMessage,
              ]}
            >
              <Text
                style={
                  message.sender === "user" ? styles.userText : styles.botText
                }
              >
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Microphone and Icons */}
      <View style={styles.microphoneContainer}>
        <View style={styles.iconButtonWithText}>
          <TouchableOpacity onPress={handleRestartConversation}>
            <FontAwesome
              name="refresh"
              size={50}
              style={{ paddingTop: 30 }}
              color="#FF3B30"
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>Yenile</Text>
        </View>
        <TouchableOpacity
          onPress={handleMicrophonePress}
          style={{ paddingTop: 30 }}
        >
          <FontAwesome
            name="microphone"
            size={100}
            color={isRecording ? "black" : "#FF3B30"}
          />
        </TouchableOpacity>
        <View style={styles.iconButtonWithText}>
          <TouchableOpacity onPress={handleEndConversation}>
            <FontAwesome
              name="times"
              size={60}
              style={{ paddingTop: 30 }}
              color="#FF3B30"
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>Bitir</Text>
        </View>
      </View>

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
    </SafeAreaView>
  );
};

export default Sohbet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    backgroundColor: "#E3EFF0",
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
    fontWeight: "bold", // Added bold styling
  },
  chatContainer: {
    flex: 1,
    //marginTop: 10,
    backgroundColor: "#E3EFF0",
    //borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
    padding: 12,
    // Add shadow
    /*shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // For Android*/
  },
  message: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: "70%",
  },
  userMessage: {
    backgroundColor: "#F9F4F1",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#6CA3AD",
    alignSelf: "flex-start",
  },
  userText: {
    fontSize: 16,
    color: "#000",
  },
  botText: {
    fontSize: 16,
    color: "#fff",
  },
  microphoneContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    zIndex: 10,
    paddingBottom: 50, // Prevent overlap with SafeArea
    borderTopLeftRadius: 35, // Added rounded top-left corner
    borderTopRightRadius: 35, // Added rounded top-right corner
    shadowColor: "#000", // Optional: Shadow for better aesthetics
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // For Android
  },

  iconButtonWithText: {
    alignItems: "center",
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
});
