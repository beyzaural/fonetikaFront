import React from "react";
import { WebView } from "react-native-webview";

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import BottomNavBar from "./BottomNavBar";

const Ders = ({ navigation, route }) => {
  const { courseId, phoneme } = route?.params || {};
  const videoMap = {
    a: "https://www.youtube.com/embed/-yLIJNekZoI",
    e: "https://www.youtube.com/embed/lMjPj1_XsKs", // Doğru: embed format
    o: "https://www.youtube.com/embed/phqiPAFKRcc?modestbranding=1&showinfo=0&controls=1", // embed format
    u: "https://www.youtube.com/embed/sGiEZEPBaF0",
    ı: "https://www.youtube.com/embed/EBPHE_V2f9M",
  };
  const phonemeKeyMap = {
    a: "a",
    e: "e",
    "o/ö": "o",
    "u/ü": "u",
    "ı/i": "ı", // varsa ileride eklersin
  };

  const videoKey =
    phonemeKeyMap[phoneme?.toLowerCase()] || phoneme?.toLowerCase();

  return (
    <View style={styles.imageBackground}>
      <View style={styles.videoContainer}>
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{
            uri: videoMap[videoKey] || "https://www.youtube.com",
          }}
        />
      </View>

      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dersler")}
      >
        <Image
          source={require("../assets/images/backspace.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Ders Seçenekleri</Text>
        <Text style={styles.subtitle}>
          {phoneme.toUpperCase()} harfi için bir eğitim modülü seç:
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("KursKelime", {
                courseId: courseId,
                phoneme: phoneme,
              })
            }
          >
            <Text style={styles.buttonText}>Kelime Çalış</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("KursTekrar", {
                courseId: courseId,
                phoneme: phoneme,
              })
            }
          >
            <Text style={styles.buttonText}>Geçmiş Tekrarı</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.tip}>
            💡 İpucu: Hedeflediğin sesi öğrenmenin en iyi yolu bol tekrar
            yapmaktır.
          </Text>
        </ScrollView>

        <BottomNavBar navigation={navigation} />
      </View>
    </View>
  );
};

export default Ders;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    backgroundColor: "#FFFFFF",

    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 17,
    left: 17,
    zIndex: 100,
    borderRadius: 25,
    padding: 5,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#E3EFF0",
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  videoContainer: {
    width: "100%",
    height: 250,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  webview: {
    flex: 1,
  },
});
