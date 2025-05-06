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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import BackButton from "./BackButton";

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
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Hesap Ayarları</Text>
        </View>

        {/* Settings List */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.cardContent}>
              <Icon name="key" size={30} color="#333" style={styles.icon} />
              <View>
                <Text style={styles.cardTitle}>Şifreyi Değiştir</Text>
                <Text style={styles.cardSubtitle}>
                  Hesap şifrenizi güncelleyin
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChangeEmail")}
          >
            <View style={styles.cardContent}>
              <Icon
                name="envelope"
                size={30}
                color="#333"
                style={styles.icon}
              />
              <View>
                <Text style={styles.cardTitle}>E-posta Adresini Değiştir</Text>
                <Text style={styles.cardSubtitle}>
                  E-posta adresinizi güncelleyin
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChangeName")}
          >
            <View style={styles.cardContent}>
              <Icon
                name="user-edit"
                size={30}
                color="#333"
                style={styles.icon}
              />
              <View>
                <Text style={styles.cardTitle}>Ad Soyad Değiştir</Text>
                <Text style={styles.cardSubtitle}>İsminizi güncelleyin</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleDeleteAccount}>
            <View style={styles.cardContent}>
              <Icon
                name="trash-alt"
                size={30}
                color="#FF3B30"
                style={styles.icon}
              />
              <View>
                <Text style={[styles.cardTitle, { color: "#FF3B30" }]}>
                  Hesabımı Sil
                </Text>
                <Text style={styles.cardSubtitle}>
                  Hesabınızı kalıcı olarak silin
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
