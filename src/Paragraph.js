import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import BottomNavBar from "./BottomNavBar";
import { useNavigation } from "@react-navigation/native";

const fields = [
  {
    name: "Hukuk",
    description: "Hukuki terimlerle pratik yap",
    color: "#E3EFF0",
    icon: require("../assets/icons/law.png"), // İsteğe bağlı ikonlar
  },
  {
    name: "Satış",
    description: "Satış jargonuna özel kelimeler",
    color: "#E3EFF0",
    icon: require("../assets/icons/sales.png"),
  },
  {
    name: "Eğitim",
    description: "Eğitimle ilgili ifadeleri öğren",
    color: "#E3EFF0",
    icon: require("../assets/icons/education.png"),
  },
];

const Paragraph = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <Text style={styles.titleText}>Alan Seçimi</Text>
      </View>

      {/* Field list */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {fields.map((field, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: field.color }]}
            onPress={() => {
              if (field.name === "Hukuk") {
                navigation.navigate("HukukKelime", { field: field.name });
              } else {
                navigation.navigate("Kelime", { field: field.name });
              }
            }}
          >
            <View style={styles.cardContent}>
              <Image source={field.icon} style={styles.icon} />
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{field.name}</Text>
                <Text style={styles.cardDesc}>{field.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.progressBox}>
        <Text style={styles.progressText}>
          💡 Güzel konuşmak, zeki görünmenin en zarif yoludur.
        </Text>
      </View>

      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default Paragraph;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 40,
    backgroundColor: "#E3EFF0",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  cardDesc: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  progressBox: {
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
  progressText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    textAlign: "center",
  },
});
