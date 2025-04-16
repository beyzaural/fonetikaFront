import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import yanlisDogruData from "../components/yanlisDogruData";

const YanlisDogruSozcukler = ({ navigation }) => {
  const sortedData = [...yanlisDogruData].sort((a, b) =>
    a.yanlis.localeCompare(b.yanlis)
  );

  return (
    <View style={styles.container}>
      {/* Üst Satır: Geri Butonu + Başlık + Kalp */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Doğru Bilinen Yanlışlar</Text>
      </View>

      <Image
        source={require("../assets/images/kalp.png")}
        style={styles.heartIcon}
      />
      {/* Başlıklar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Yanlış</Text>
        <Text style={styles.headerText}>Doğru</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 75,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  heartIcon: {
    top: 20,
    right: 20,
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 10,
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
    color: "black",
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
    color: "black",
  },
  heartWrapper: {
    //alignItems: "center",
    marginBottom: 20,
  },
  heartIcon: {
    position: "absolute",
    top: 70, // başlık altına hizalar
    right: 20, // sağ boşluk
    width: 100,
    height: 100,
    zIndex: 5,
  },
});

export default YanlisDogruSozcukler;
