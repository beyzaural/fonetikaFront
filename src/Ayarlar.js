import React from "react";
import BottomNavBar from "./BottomNavBar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { logout } from "./utils/auth";
//import { Alert } from "react-native";

const Ayarlar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top Section */}
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
          <Text style={styles.title}>Ayarlar</Text>
        </View>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("Hesap")}
        >
          <Text style={styles.settingText}>Hesap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Tercihler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Hesap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Bildirimler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Kurslar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Duolingo for Schools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Sosyal Hesaplar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Gizlilik Ayarları</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Abonelik Seçimi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Aboneliği Tekrar Aktifleştir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("Destek")}
        >
          <Text style={styles.settingText}>Destek</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomWidth: 0 }]}
          // webde simulate ettiğim için alertliyi şimdilik yorum aldım değiştiriiz
          /*onPress={() =>
  Alert.alert("Çıkış Yap", "Emin misiniz?", [
    { text: "İptal", style: "cancel" },
    {
      text: "Evet",
      style: "destructive",
      onPress: async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      },
    },
  ])
}
 */
          onPress={async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Text style={[styles.settingText, { color: "red" }]}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

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
  settingsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  settingText: {
    fontSize: 18,
  },
});

export default Ayarlar;
