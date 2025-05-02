import React from "react";
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

  return (
    <ImageBackground
      source={require("../assets/images/beyazblue.png")}
      style={styles.imageBackground}
    >
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
    </ImageBackground>
  );
};

export default Ders;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    borderRadius: 25,
    padding: 5,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  bottomContainer: {
    height: "70%",
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
});
