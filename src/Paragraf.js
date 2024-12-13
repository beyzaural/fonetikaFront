import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
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
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.paragraphText}>
          Bugün sabah kahvaltıda bir kahve içtim ve radyoda sevdiğim bir müzik
          çalıyordu. Öğle saatlerinde bir avukat ile görüşmem gerekti. Ancak
          randevuma geç kalınca İstanbul trafiğinde bir saat boyunca beklemek
          zorunda kaldım. Sonunda buluşmaya vardığımda, herkesin toplantıda
          olduğunu gördüm. Toplantıda, yeni çıkan bir program ve rakip şirket
          hakkında konuştuk.
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleMicrophonePress}>
          <FontAwesome
            name="microphone"
            size={90}
            color={isRecording ? "red" : "#880000"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
          <Text style={styles.listenButtonText}>Dinle</Text>
        </TouchableOpacity>
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
    width: 50,
    height: 50,
  },
  topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  paragraphText: {
    fontSize: 18,
    fontFamily: "Parkinsans-Medium",
    color: "#333",
    textAlign: "justify",
    lineHeight: 28,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
