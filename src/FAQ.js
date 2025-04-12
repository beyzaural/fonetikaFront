import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./BottomNavBar";

const FAQ = () => {
  const navigation = useNavigation();
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
    <ScrollView style={styles.container}>
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
          <Text style={styles.title}>Sık Sorulan Sorular</Text>
        </View>
      </View>

      {faqs.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}
      <BottomNavBar navigation={navigation} />
    </ScrollView>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
  faqItem: {
    marginBottom: 25,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  answer: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
});
