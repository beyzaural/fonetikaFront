// HukukWordList.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const HukukWordList = () => {
  const navigation = useNavigation();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/hukuk-words/all`)
      .then((res) => {
        setWords(res.data || []);
      })
      .catch((err) => {
        console.error("Kelime listesi alınamadı:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Hukuk Kelimeleri</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF3B30" />
        ) : (
          words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordButton}
              onPress={() =>
                navigation.navigate("HukukWordCard", { wordText: word.word })
              }
            >
              <Text style={styles.wordText}>Çalış: {word.word}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HukukWordList;

const styles = StyleSheet.create({
  imageBackground: { flex: 1 },
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 30,
  },
  wordButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wordText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});
