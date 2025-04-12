// Hesap.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Hesap = () => {
  const navigation = useNavigation();

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
          <Text style={styles.title}>Hesap Ayarları</Text>
        </View>
      </View>

      <ScrollView style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Parola")}
        >
          <Text style={styles.optionText}>Şifreyi Değiştir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("ChangeEmail")}
        >
          <Text style={styles.optionText}>E-posta Adresini Değiştir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("ChangeName")}
        >
          <Text style={styles.optionText}>Ad Soyad Değiştir</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default Hesap;

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
  optionsContainer: {
    flexGrow: 1,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
  },
});
