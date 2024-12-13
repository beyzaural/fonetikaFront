import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    "Parkinsans-Medium": require("../assets/fonts/Parkinsans-Medium.ttf"),
    "NotoSans-Regular": require("../assets/fonts/NotoSans-Regular.ttf"),
    "SourGummy-Medium": require("../assets/fonts/SourGummy-Medium.ttf"),
  });

  const turkishSentence = "Pijamalı hasta yağız şoföre çabucak güvendi.";

  const handlePressMicrophone = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved to:", uri);

        setRecording(null);
        setIsRecording(false);

        // Navigate to Home.js after 2 seconds
        setTimeout(() => {
          navigation.navigate("Home");
        }, 2000);
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
        console.error("Error starting recording:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.sentenceText}>{turkishSentence}</Text>
      </View>

      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={handlePressMicrophone}
          style={[
            styles.microphoneButton,
            { backgroundColor: isRecording ? "#880000" : "black" },
          ]}
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
  },
  sentenceText: {
    fontSize: 26,
    color: "black",
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Parkinsans-Medium",
    paddingHorizontal: "20%",
  },
  centerContainer: {
    top: "15%",
    alignItems: "center",
    flex: 1,
  },
  instruction: {
    marginTop: 30,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
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
  },
});
