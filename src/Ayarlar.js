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
} from "react-native";
import { logout } from "./utils/auth";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "./BackButton";

const Ayarlar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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
                <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Record", { fromSettings: true })}
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
                    Ses profilinizi oluşturun veya güncelleyin
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
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
                <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
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
                <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
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
                <Icon name="chevron-right" size={20} color="#666" style={styles.chevron} />
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
    padding:10,
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

