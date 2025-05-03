import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => router.push("/home")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/home.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/yanlis-dogru-sozcukler")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/book.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/ayarlar")}
        style={styles.navItem}
      >
        <Image
          source={require("../assets/icons/settings.png")}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/dersler")}
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
