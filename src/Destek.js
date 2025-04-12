import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Platform, Linking } from "react-native";
import BottomNavBar from "./BottomNavBar";

const Destek = () => {
  const navigation = useNavigation();

  const sendEmail = async () => {
    const subject = encodeURIComponent("Fonetika Desteği");
    const body = encodeURIComponent("");
    const url = `mailto:info@fonetikapp.com?subject=${subject}&body=${body}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url); // ✅ Will use Gmail if set as default
    } else {
      Alert.alert("Hata", "Mail uygulaması açılamadı.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButton}>
            <Image
              source={require("../assets/images/backspace.png")}
              style={styles.backIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Destek</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("FAQ")}
      >
        <Text style={styles.optionText}>Sık Sorulan Sorular</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => sendEmail("Fonetika Desteği – Genel Talep")}
      >
        <Text style={styles.optionText}>Bize Ulaşın</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => sendEmail("Fonetika – Sorun Bildirimi")}
      >
        <Text style={styles.optionText}>Sorun Bildir</Text>
      </TouchableOpacity>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default Destek;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
  },
});
