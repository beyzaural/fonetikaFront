// HukukKelime.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./BottomNavBar";
import Icon from "react-native-vector-icons/FontAwesome5";

const CategoryWordMain = ({ navigation, route }) => {
  const { field } = route.params;

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WordCategory")}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{field} Kelime Modülü</Text>
      </View>

      {/* Options List */}
      <View style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CategoryRandomStudy", { field })}
        >
          <View style={styles.cardContent}>
            <Icon name="random" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Rastgele {field} Kelimesi Çalış</Text>
              <Text style={styles.cardSubtitle}>Rastgele kelimelerle pratik yapın</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CategoryWordList", { field })}
        >
          <View style={styles.cardContent}>
            <Icon name="list" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Tüm {field} Kelimelerini Gör</Text>
              <Text style={styles.cardSubtitle}>Tüm kelimeleri listeleyin</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          💡 Her gün düzenli pratik yapmak, telaffuzunuzu geliştirmenin en iyi yoludur.
        </Text>
      </View>

      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default CategoryWordMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#E3EFF0",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
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
