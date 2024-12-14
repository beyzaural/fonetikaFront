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
          await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.header}>Sohbet</Text>

        {/* Chat Container with ScrollView */}
        <View style={styles.chatContainer}>
          <ScrollView>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.message,
                  message.sender === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={message.sender === "user" ? styles.userText : styles.botText}>
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Microphone Button */}
        <View style={styles.microphoneContainer}>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesome
              name="microphone"
              size={90}
              color={isRecording ? "black" : "#880000"}
            />
          </TouchableOpacity>
        </View>

        {/* End Conversation Button */}
        <View style={styles.endConversationContainer}>
          <TouchableOpacity onPress={handleEndConversation} style={styles.endButton}>
            <Text style={styles.endButtonText}>End Conversation</Text>
          </TouchableOpacity>
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
      </View>
    </SafeAreaView>
  );
};

export default Sohbet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  container: {
    flex: 1,
    paddingTop: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    marginTop: 60, // Added margin to avoid overlap with the back button
  },
  message: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: "70%",
  },
  userMessage: {
    backgroundColor: "#D4D4D4",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#880000",
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
    padding: 10,
    alignItems: "center",
  },
  endConversationContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  endButton: {
    backgroundColor: "#880000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  endButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
