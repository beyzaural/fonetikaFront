import React from "react";
import { WebView } from "react-native-webview";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import BottomNavBar from "./BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
import { checkVowelProfileCompleted } from "./utils/auth";
const Ders = ({ navigation, route }) => {
  const { courseId, phoneme } = route?.params || {};
  const videoMap = {
    a: "https://www.youtube.com/embed/-yLIJNekZoI",
    e: "https://www.youtube.com/embed/lMjPj1_XsKs",
    o: "https://www.youtube.com/embed/phqiPAFKRcc?modestbranding=1&showinfo=0&controls=1",
    u: "https://www.youtube.com/embed/sGiEZEPBaF0",
    ı: "https://www.youtube.com/embed/EBPHE_V2f9M",
  };
  const phonemeKeyMap = {
    a: "a",
    e: "e",
    "o/ö": "o",
    "u/ü": "u",
    "ı/i": "ı",
  };

  const videoKey =
    phonemeKeyMap[phoneme?.toLowerCase()] || phoneme?.toLowerCase();
  const handleRestrictedNavigation = async (targetPage) => {
    const isCompleted = await checkVowelProfileCompleted();
    if (!isCompleted) {
      Alert.alert(
        "Ses Profili Eksik",
        "Diksiyon alıştırmalarına başlamak için ses profilinizi tamamlamanız gerekiyor. Lütfen gerekli kelimeleri kaydederek ses profilinizi oluşturun.\n\nBunu yapmak için Ayarlar > Ses Profili bölümüne gidebilirsiniz."
      );
      return;
    }
    navigation.navigate(targetPage);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} style={styles.backButton} />
          <Text style={styles.title}>Ders Seçenekleri</Text>
        </View>

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

        <View style={styles.bottomContainer}>
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
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    paddingTop: 30,
    paddingBottom: 25,
    position: "relative",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 30,
    zIndex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
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
  bottomContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 20,
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
});

export default Ders;
