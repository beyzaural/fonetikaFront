// HukukKelime.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./BottomNavBar";

const HukukKelime = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Hukuk Kelime Modülü</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HukukRandomStudy")}
        >
          <Text style={styles.buttonText}>Rastgele Hukuk Kelimesi Çalış</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HukukWordList")}
        >
          <Text style={styles.buttonText}>Tüm Hukuk Kelimelerini Gör</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HukukKelime;

const styles = StyleSheet.create({
  imageBackground: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
