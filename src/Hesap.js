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
import Icon from "react-native-vector-icons/FontAwesome5";
import BottomNavBar from "./BottomNavBar";

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

      const decoded = jwt_decode(token);
      const userId = decoded.userId || decoded.sub || decoded.id;

      if (!userId) {
        Alert.alert("Hata", "Kullanıcı kimliği JWT'den alınamadı.");
        return;
      }

      await axios.delete(`${API_URL}/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.clear();
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
        <Text style={styles.title}>Hesap Ayarları</Text>
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Parola")}
        >
          <View style={styles.cardContent}>
            <Icon name="key" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Şifreyi Değiştir</Text>
              <Text style={styles.cardSubtitle}>Hesap şifrenizi güncelleyin</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ChangeEmail")}
        >
          <View style={styles.cardContent}>
            <Icon name="envelope" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>E-posta Adresini Değiştir</Text>
              <Text style={styles.cardSubtitle}>E-posta adresinizi güncelleyin</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ChangeName")}
        >
          <View style={styles.cardContent}>
            <Icon name="user-edit" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Ad Soyad Değiştir</Text>
              <Text style={styles.cardSubtitle}>İsminizi güncelleyin</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={handleDeleteAccount}
        >
          <View style={styles.cardContent}>
            <Icon name="trash-alt" size={30} color="#FF3B30" style={styles.icon} />
            <View>
              <Text style={[styles.cardTitle, { color: "#FF3B30" }]}>Hesabımı Sil</Text>
              <Text style={styles.cardSubtitle}>Hesabınızı kalıcı olarak silin</Text>
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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
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
});

export default Hesap;
