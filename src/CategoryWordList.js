// WordList.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
import { LinearGradient } from "expo-linear-gradient";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const CategoryWordList = ({ navigation, route }) => {
  const { field } = route.params;
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/${field.toLowerCase()}-words/all`)
      .then((res) => {
        setWords(res.data || []);
      })
      .catch((err) => {
        console.error("Kelime listesi alınamadı:", err);
        Alert.alert("Hata", "Kelime listesi alınamadı.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>{field} Kelimeleri</Text>
        </View>

        {/* Word List */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF3B30" />
          ) : (
            words.map((word, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("CategoryWordCard", {
                    wordText: word.word,
                    field: field,
                  })
                }
              >
                <LinearGradient
                  colors={["#d6d5b3", "#FFFFFF"]}
                  start={{ x: 4, y: 0 }}
                  end={{ x: 0, y: 0.2 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Icon name="book" size={30} color="#333" style={styles.icon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{word.word}</Text>
                      <Text style={styles.cardSubtitle}>Kelimeyi çalış</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Her kelimeyi dikkatlice çalışın ve telaffuzunu öğrenin.
          </Text>
        </View>

        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CategoryWordList;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 15,
    position: "relative",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    width: "100%",
    height: 80,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  chevron: {
    marginLeft: 10,
  },
  tipBox: {
    backgroundColor: "#F9F4F1",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    textAlign: "center",
  },
});
