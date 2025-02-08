import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";

const Paragraf = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);

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

  // Function to start/stop recording
  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved to:", uri);
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
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
        <Text style={styles.paragraphText}>
          {paragraphs[currentParagraphIndex]}
        </Text>

        <View style={styles.buttonsRow}>
          <View style={styles.iconButtonWithText}>
            <TouchableOpacity onPress={handleRestartConversation}>
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
    </View>
  );
};

export default Paragraf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 45,
    height: 45,
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
    position: "absolute",
    bottom: 0,
    height: "85%", // Covers 85% of the screen
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
    paddingBottom: 20, // Ensures padding at the bottom
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "absolute",
    bottom: 60, // Keeps the microphone row 60-space padding from the bottom
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
});
