// HukukKelime.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./BottomNavBar";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BackButton from "./BackButton";

const CategoryWordMain = ({ navigation, route }) => {
  const { field } = route.params;

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>{field} Kelime </Text>
          <Text style={styles.title}>Modülü</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("CategoryRandomStudy", { field })
            }
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <Icon style={styles.icon} name="random" size={40} color="#333" />
              <Text style={styles.cardText}>Rastgele {field} Kelimesi</Text>
              <Text style={styles.cardSubText}>
                Rastgele kelimelerle pratik yap
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CategoryWordList", { field })}
          >
            <LinearGradient
              colors={["#d6d5b3", "#FFFFFF"]}
              start={{ x: 4, y: 0 }}
              end={{ x: 0, y: 0.2 }}
              style={styles.cardGradient}
            >
              <Icon name="list" size={40} color="#333" />
              <Text style={styles.cardText}>Tüm {field} Kelimeleri</Text>
              <Text style={styles.cardSubText}>Tüm kelimeleri listeleyin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Her gün düzenli pratik yapmak, telaffuzunuzu geliştirmenin en iyi
            yoludur.
          </Text>
        </View>
      </SafeAreaView>
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CategoryWordMain;

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
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingTop: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 17,
    paddingTop: 20,
  },
  icon: { marginTop: 10, marginBottom: 5 },
  card: {
    width: "48%",
    height: 190,
    borderRadius: 35,
    padding: 5,
    flexDirection: "column",
    justifyContent: "flex-end",

    marginBottom: 30,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 35,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 30,
    marginBottom: 5,
    textAlign: "center",
  },
  cardSubText: {
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  tipBox: {
    backgroundColor: "#F9F4F1",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    textAlign: "center",
  },
});
