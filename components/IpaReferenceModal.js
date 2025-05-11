import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ipaReference } from "./ipaReference";

const IpaReferenceModal = ({ visible, onClose }) => {
  const letterRows = ipaReference.filter((item) => item["Türkçe Harf"]?.trim());
  const symbolRows = ipaReference.filter(
    (item) => !item["Türkçe Harf"]?.trim()
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>Fonetik Sözlük</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <FontAwesome name="close" size={26} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <SafeAreaView style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.list}>
            {/* Section 1: Harf Temelli */}
            <Text style={styles.sectionTitle}>Harf Temelli Semboller</Text>
            <View style={styles.header}>
              <Text style={[styles.headerText, { width: "20%" }]}>Fonetik</Text>
              <Text style={[styles.headerText, { width: "20%" }]}>Harf</Text>
              <Text style={[styles.headerText, { width: "60%" }]}>
                Açıklama
              </Text>
            </View>

            {letterRows.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={[styles.cell, { width: "20%" }]}>{item.IPA}</Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  {item["Türkçe Harf"]}
                </Text>
                <Text style={[styles.cell, { width: "60%" }]}>
                  {item.Açıklama}
                </Text>
              </View>
            ))}

            {/* Section 2: Diğer Semboller */}
            <Text style={styles.sectionTitle}>Diğer Fonetik Semboller</Text>
            <View style={styles.header}>
              <Text style={[styles.headerText, { width: "20%" }]}>Fonetik</Text>
              <Text style={[styles.headerText, { width: "80%" }]}>
                Açıklama
              </Text>
            </View>

            {symbolRows.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={[styles.cell, { width: "20%" }]}>{item.IPA}</Text>
                <Text
                  style={[styles.cell, { width: "80%", textAlign: "left" }]}
                >
                  {item.Açıklama}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  cell: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  closeIcon: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6CA3AD",
    marginBottom: 8,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    textAlign: "center",
  },

  list: {
    paddingBottom: 150,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default IpaReferenceModal;
