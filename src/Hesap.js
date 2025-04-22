// Hesap.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;
const Hesap = () => {
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Hata", "Giriş yapmamışsınız.");
        return;
      }

      const decoded = jwt_decode(token); // Get payload
      const userId = decoded.userId || decoded.sub || decoded.id; // depends on your backend

      if (!userId) {
        Alert.alert("Hata", "Kullanıcı kimliği JWT'den alınamadı.");
        return;
      }

      await axios.delete(`${API_URL}/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.clear(); // logout
      navigation.navigate("Login");
    } catch (error) {
      console.error(
        "Error deleting account:",
        error.response?.data || error.message
      );
      Alert.alert("Hata", "Hesap silinirken bir hata oluştu.");
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
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Hesabımı Sil</Text>
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
