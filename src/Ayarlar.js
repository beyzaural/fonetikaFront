import React from "react";
import BottomNavBar from "./BottomNavBar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { logout } from "./utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getUserIdFromToken } from "./utils/auth";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "./BackButton";
import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl || "http://localhost:8080";

const Ayarlar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const handleResetProfile = async () => {
    try {
      const userId = await getUserIdFromToken();
      await axios.delete(`${API_URL}/api/speech/delete-profile/${userId}`);
      await AsyncStorage.removeItem("voiceRecordingProgress");

      Alert.alert(
        "Profil Sıfırlandı",
        "Ses profiliniz başarıyla sıfırlandı.\nUygulamayı kullanmaya devam etmeden ses profilinizi yeniden oluşturmayı unutmayın."
      );
    } catch (err) {
      console.error("Reset failed:", err);
      Alert.alert("Hata", "Profil sıfırlanırken bir hata oluştu, yeniden deneyin.");
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Ayarlar</Text>
        </View>

        {/* Settings List */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Hesap")}
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon
                  name="user-circle"
                  size={30}
                  color="#333"
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Hesap</Text>
                  <Text style={styles.cardSubtitle}>
                    Profil bilgilerinizi yönetin
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#666"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Record", { fromSettings: true })
            }
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon
                  name="microphone"
                  size={30}
                  color="#333"
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Ses Profili</Text>
                  <Text style={styles.cardSubtitle}>
                    Ses profilinizi oluşturun.
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#666"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#fff1f0" }]}
            onPress={handleResetProfile}
          >
            <LinearGradient
              colors={["#ffe5e0", "#ffffff"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon
                  name="trash"
                  size={30}
                  color="#FF3B30"
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, { color: "#FF3B30" }]}>
                    Profili Sıfırla
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Ses profilinizi silin.
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#FF3B30"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon name="cog" size={30} color="#333" style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Tercihler</Text>
                  <Text style={styles.cardSubtitle}>
                    Uygulama ayarlarınızı özelleştirin
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#666"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Destek")}
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon
                  name="question-circle"
                  size={30}
                  color="#333"
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Destek</Text>
                  <Text style={styles.cardSubtitle}>Yardım ve destek alın</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#666"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Icon
                  name="sign-out-alt"
                  size={30}
                  color="#FF3B30"
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, { color: "#FF3B30" }]}>
                    Çıkış Yap
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Hesabınızdan çıkış yapın
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#666"
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
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
    height: 80,
    marginBottom: 15,
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
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
  chevron: {
    marginLeft: 10,
  },
});

export default Ayarlar;
