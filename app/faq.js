import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import BottomNavBar from "../src/BottomNavBar";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

const FAQ = () => {
  const router = useRouter();
  const faqs = [
    {
      question: "Fonetika nedir?",
      answer:
        "Fonetika, telaffuzunuzu geliştirmek için tasarlanmış bir mobil uygulamadır. İstanbul Türkçesi'ne uygun konuşma alışkanlığı kazandırmayı amaçlar.",
    },
    {
      question: "Ücretsiz ve premium sürüm farkı nedir?",
      answer:
        "Ücretsiz sürüm sınırlı derslere erişim sunar. Premium sürüm tüm içeriklere ve kişiselleştirilmiş ders önerilerine erişim sağlar.",
    },
    {
      question: "Ses kaydım çalışmıyor, ne yapmalıyım?",
      answer:
        "Uygulamanın mikrofon izni olduğundan emin olun. Cihaz ayarlarını kontrol edin ve uygulamayı yeniden başlatmayı deneyin.",
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8f8f8", "#ffffff"]}
        style={styles.backgroundGradient}
      />
      {/* Top Section */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Sık Sorulan Sorular</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {faqs.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNavBar  router={router} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(214, 213, 179, 0.2)",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
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
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  answer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default FAQ;
