import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";

const Kelime = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  // List of words with feedback
  const words = [
    {
      word: "Kamuflaj",
      definition: "Kamuflâj",
      tahmin: "Sanırım “kamoflâj” dediniz.",
      instruction: "İşaretli harfleri düzeltmeyi deneyebilirsiniz.",
      kelime: "kamuflâj",
      ipucu: "Türkçede “o” harfi dudaklar yuvarlak ve hafif açık konumdayken “u” harfi dudaklar daha dar ve ileri doğru yuvarlanmış şekilde telaffuz edilir.",
    },
    {
      word: "Ağabey",
      definition: "A:bi",
      tahmin: "Sanırım “a:bey” dediniz.",
      instruction: "İşaretli harfleri düzeltmeyi deneyebilirsiniz.",
      kelime: "a:bi",
      ipucu: "'Bi' sesini kısa, düz ve açık bir 'i' ile bitirin. 'bey' yerine 'bi' demeye odaklanın.",
    },
    {
      word: "Sahi",
      definition: "sa:hi",
      tahmin: "Sanırım “sahi” dediniz.",
      instruction: "İşaretli harfleri düzeltmeyi deneyebilirsiniz.",
      kelime: "sa:hi",
      ipucu: "“:” harfin fazla uzatıldığını gösterir.",
    },
    {
      word: "Şiir",
      definition: "şi:r",
      tahmin: "Harika, 'şiir' kelimesini çok güzel ve doğru bir şekilde söyledin!",
      kelime:"",
      instruction: "",
      ipucu: "",
    },
  ];
  

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMicrophonePress = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);
        setAudioUri(uri);
        setRecording(null);
        setIsRecording(false);
        setShowFeedback(true);
        setFeedback(words[currentIndex].feedback);
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
        console.error("Failed to start recording:", error);
      }
    }
  };

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

  const handleNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  const handlePreviousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
    setShowFeedback(false);
    setIsRecording(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/kelime_back.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/images/backspace.png")} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Top Container */}
        <View style={styles.topContainer}>
          <Text style={styles.okuText}>{"Aşağıdaki kelimeyi okuyunuz"}</Text>

          <View style={styles.wordContainer}>
            <Text style={styles.wordText}>{words[currentIndex].word}</Text>
            <Text style={styles.phoneticText}>{words[currentIndex].definition}</Text>
          </View>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesome name="microphone" size={90} color={isRecording ? "red" : "#880000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playAudio} style={styles.listenButton}>
            <Text style={styles.listenButtonText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Arrows */}
        <TouchableOpacity style={styles.prevButton} onPress={handlePreviousWord}>
          <FontAwesome name="arrow-left" size={50} color="#880000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextWord}>
          <FontAwesome name="arrow-right" size={50} color="#880000" />
        </TouchableOpacity>

        <Modal
  animationType="slide"
  transparent={true}
  visible={showFeedback}
  onRequestClose={() => setShowFeedback(false)}
>
  <View style={styles.feedbackContainer}>
    <View style={styles.feedbackContent}>
      <Text style={styles.feedbackTitle}>Geri Bildirim</Text>
      <Text style={styles.tahminText}>{words[currentIndex].tahmin}</Text>
      <Text style={styles.instructionText}>{words[currentIndex].instruction}</Text>
      <Text style={styles.kelimeText}>
        {words[currentIndex].kelime.split("").map((char, index) => {
          const isRed = (words[currentIndex].word === "Kamuflaj" && char === "u") ||
                        (words[currentIndex].word === "Ağabey" && char === "i") ||
                        (words[currentIndex].word === "Sahi" && char === ":");
          return (
            <Text key={index} style={isRed ? styles.redText : styles.blackText}>
              {char}
            </Text>
          );
        })}
      </Text>
      {words[currentIndex].ipucu !== "" && (
        <Text style={styles.ipucuText}>
          <Text style={styles.ipucuBold}>İpucu: </Text>
          {words[currentIndex].ipucu}
        </Text>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowFeedback(false)}>
        <Text style={styles.closeButtonText}>Kapat</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

 {/* Navigation Bar */}
 <View style={styles.navBar}>
            <TouchableOpacity style={styles.navItem}>
              <Image
                source={require("../assets/icons/profile.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Image
                source={require("../assets/icons/settings.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Dersler")} style={styles.navItem}>
  <Image
    source={require("../assets/icons/fitness.png")} // Your fitness icon
    style={styles.navIcon}
  />
</TouchableOpacity>
          </View>


      </View>
    </ImageBackground>
  );
};

export default Kelime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
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
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  okuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  wordContainer: {
    backgroundColor: "#880000",
    width: "80%",
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  phoneticText: {
    fontSize: 20,
    color: "white",
    marginTop: 10,
  },
  bottomContainer: {
    alignItems: "center",
  },
  listenButton: {
    marginTop: 20,
    backgroundColor: "#880000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  listenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  prevButton: {
    position: "absolute",
    bottom: 100,
    left: 30,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
  },
  nextButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
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
      marginBottom: 15,
      textAlign: "center",
    },
    tahminText: {
      fontSize: 18,
      //marginBottom: 10,
      textAlign: "left", // Align text to the left
    },
    instructionText: {
      fontSize: 18,
      //marginBottom: 10,
      textAlign: "left", // Align text to the left
    },
    kelimeText: {
      fontSize: 18,
     fontWeight: "bold",
      textAlign: "center", // Align text to the left
    },
    ipucuText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "left", // Align text to the left
    },
    ipucuBold: {
      fontWeight: "bold",
    },

  closeButtonContainer: {
    width: "50%",
    alignItems: "center",
    marginBottom: 20, // Provide spacing at the bottom
  },
  closeButton: {
    backgroundColor: "#880000",
    paddingVertical: 12,
    paddingHorizontal: 39,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 10, // Ensures some spacing at the bottom
  },
  
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },

  navBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  redText: {
    color: "red",
    fontSize: 23,  // Updated fontSize
    fontWeight: "bold",
  },
  blackText: {
    color: "black",
    fontSize: 23,  // Updated fontSize
    fontWeight: "bold",
  },
  
});
