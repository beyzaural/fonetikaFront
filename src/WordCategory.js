import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import BottomNavBar from "./BottomNavBar";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BackButton from "./BackButton";

const fields = [
  {
    name: "Hukuk",
    description: "Hukuki terimlerle pratik yap",
    icon: "balance-scale",
  },
  {
    name: "Satış",
    description: "Satış jargonuna özel kelimeler",
    icon: "chart-line",
  },
  {
    name: "Eğitim",
    description: "Eğitimle ilgili ifadeleri öğren",
    icon: "graduation-cap",
  },
  {
    name: "Medya",
    description: "Medya diline özel sözcükler",
    icon: "newspaper",
  },
  {
    name: "Sanat",
    description: "Sanatsal terimlerle çalış",
    icon: "palette",
  },
];

const WordCategory = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Alan Seçimi</Text>
        </View>

        {/* Field list */}
        <View style={styles.cardsContainer}>
          {fields.map((field, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("CategoryWordMain", { field: field.name })
              }
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.cardGradient}
              >
                <Icon name={field.icon} size={40} color="#333" />
                <Text style={styles.cardText}>{field.name}</Text>
                <Text style={styles.cardSubText}>{field.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          💡 Güzel konuşmak, zeki görünmenin en zarif yoludur.
        </Text>
      </View>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default WordCategory;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 14,
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingTop: 20,
  },

  card: {
    width: "48%",
    height: 190,
    borderRadius: 35,
    marginBottom: 15,
  },

  cardGradient: {
    flex: 1,
    borderRadius: 35,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },

  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 30,
    marginBottom: 5,
    textAlign: "center",
  },

  cardSubText: {
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
    paddingHorizontal: 10,
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
