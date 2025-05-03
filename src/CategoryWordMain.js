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
const CategoryWordMain = ({ navigation, route }) => {
  const { field } = route.params;

  return (
    <ImageBackground
      source={require("../assets/images/bluedalga.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WordCategory")}
        ></TouchableOpacity>
        <Text style={styles.header}>{field} Kelime Modülü</Text>

        <TouchableOpacity

          style={styles.button}
          onPress={() => navigation.navigate("CategoryRandomStudy", { field })}
        >
          <Text style={styles.buttonText}>Rastgele {field} Kelimesi Çalış</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CategoryWordList", { field })}
        >
          <Text style={styles.buttonText}>Tüm {field} Kelimelerini Gör</Text>
        </TouchableOpacity>


      </View>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CategoryWordMain;

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
