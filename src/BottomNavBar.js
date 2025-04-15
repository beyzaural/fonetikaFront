import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/home.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/profile.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("YanlisDogruSozcukler")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/book.png")} // ikonunu buraya koy
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Ayarlar")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/settings.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Dersler")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/fitness.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
});

export default BottomNavBar;
