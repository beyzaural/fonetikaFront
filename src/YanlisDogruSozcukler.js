import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import yanlisDogruData from "../components/yanlisDogruData";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "./BottomNavBar";
import BackButton from "./BackButton";

const YanlisDogruSozcukler = ({ navigation }) => {
  const sortedData = [...yanlisDogruData].sort((a, b) =>
    a.yanlis.localeCompare(b.yanlis)
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} style={{ left: 5 }} />
          <Text style={styles.title}>Doğru Bilinen </Text>
          <Text style={styles.title}>Yanlışlar</Text>
        </View>

        <Image
          source={require("../assets/images/kalp.png")}
          style={styles.heartIcon}
        />

        {/* Başlıklar */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Yanlış Okunuş</Text>
          <Text style={styles.headerText}>Doğru Okunuş</Text>
        </View>

        {/* Liste */}
        <ScrollView contentContainerStyle={styles.list}>
          {sortedData.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.yanlis}</Text>
              <Text style={styles.cell}>{item.dogru}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* 🎓 Sabit Fonetik Notu Kutusu */}
      <View style={styles.persistentNote}>
        <Text style={styles.notifTitle}>Fonetik Notu</Text>
        <Text style={styles.notifText}>
          é : kapalı e, ağız çok açılmadan söylenir.
        </Text>
        <Text style={styles.notifText}>
          e: açık e'dir. Ses daha net çıkar ve ağız daha fazla açılır.
        </Text>
        <Text style={styles.notifText}>
          ":": işareti, harfin uzatılarak okunması gerektiğini belirtir.
        </Text>
      </View>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    minHeight: "100%",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
    position: "relative",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "45%",
  },
  list: {
    paddingBottom: 200,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cell: {
    width: "45%",
    fontSize: 16,
    color: "#333",
  },
  heartIcon: {
    position: "absolute",
    bottom: 125,
    right: 20,
    width: 80,
    height: 80,
    zIndex: 5,
  },
  notifTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#6CA3AD",
    marginBottom: 8,
  },
  notifText: {
    fontSize: 13,
    color: "#333",
    margin: 2,
  },
  persistentNote: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopWidth: 2,
    borderTopColor: "#ddd",
    padding: 12,
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    zIndex: 0,
  },
});

export default YanlisDogruSozcukler;
