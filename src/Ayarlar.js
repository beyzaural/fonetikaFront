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
import Icon from "react-native-vector-icons/FontAwesome5";
//import { Alert } from "react-native";

const Ayarlar = ({ navigation }) => {
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
        <Text style={styles.title}>Ayarlar</Text>
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Hesap")}
        >
          <View style={styles.cardContent}>
            <Icon name="user-circle" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Hesap</Text>
              <Text style={styles.cardSubtitle}>Profil bilgilerinizi yönetin</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardContent}>
            <Icon name="cog" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Tercihler</Text>
              <Text style={styles.cardSubtitle}>Uygulama ayarlarınızı özelleştirin</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Destek")}
        >
          <View style={styles.cardContent}>
            <Icon name="question-circle" size={30} color="#333" style={styles.icon} />
            <View>
              <Text style={styles.cardTitle}>Destek</Text>
              <Text style={styles.cardSubtitle}>Yardım ve destek alın</Text>
            </View>
          </View>
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
          <View style={styles.cardContent}>
            <Icon name="sign-out-alt" size={30} color="#FF3B30" style={styles.icon} />
            <View>
              <Text style={[styles.cardTitle, { color: "#FF3B30" }]}>Çıkış Yap</Text>
              <Text style={styles.cardSubtitle}>Hesabınızdan çıkış yapın</Text>
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

export default Ayarlar;
