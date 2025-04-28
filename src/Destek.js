import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Platform, Linking } from "react-native";
import BottomNavBar from "./BottomNavBar";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";

const Destek = () => {
  const navigation = useNavigation();

  const sendEmail = async () => {
    const subject = encodeURIComponent("Fonetika Desteği");
    const body = encodeURIComponent("");
    const url = `mailto:info@fonetikapp.com?subject=${subject}&body=${body}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Hata", "Mail uygulaması açılamadı.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8f8f8", "#ffffff"]}
        style={styles.backgroundGradient}
      />
      {/* Top Section */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Destek</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("FAQ")}
        >
          <View style={styles.cardContent}>
            <Icon name="question-circle" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Sık Sorulan Sorular</Text>
              <Text style={styles.cardSubtitle}>Yaygın sorular ve cevaplar</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => sendEmail("Fonetika Desteği – Genel Talep")}
        >
          <View style={styles.cardContent}>
            <Icon name="envelope" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Bize Ulaşın</Text>
              <Text style={styles.cardSubtitle}>Genel soru ve önerileriniz için</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => sendEmail("Fonetika – Sorun Bildirimi")}
        >
          <View style={styles.cardContent}>
            <Icon name="exclamation-circle" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Sorun Bildir</Text>
              <Text style={styles.cardSubtitle}>Karşılaştığınız sorunları bildirin</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(214, 213, 179, 0.2)",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
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
});

export default Destek;
