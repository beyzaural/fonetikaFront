import {
  StyleSheet,
  Text,
  View, // Add View here
  TextInput,
  Animated, // Import Animated for animation
} from "react-native";
import React, { useEffect, useRef } from "react";

import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

const Fonetika = () => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    "Parkinsans-Medium": require("../assets/fonts/Parkinsans-Medium.ttf"),
    "Parkinsans-Bold": require("../assets/fonts/Parkinsans-Bold.ttf"),
    "NotoSans-SemiBold": require("../assets/fonts/NotoSans-SemiBold.ttf"),
    "NotoSans-Regular": require("../assets/fonts/NotoSans-Regular.ttf"),
    "SourGummy-Medium": require("../assets/fonts/SourGummy-Medium.ttf"),
    "Itim-Regular": require("../assets/fonts/Itim-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
  });

  const navigation = useNavigation(); // For navigating to Record.js
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 1500, // 1 second fade-in duration
      useNativeDriver: true, // Optimize animation
    }).start();

    // Navigate to Record.js after 1 second
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Fonetika
      </Animated.Text>
    </View>
  );
};
export default Fonetika;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //7justifyContent: 'center', // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "white", // Sets the background color to white
  },
  title: {
    top: "44%",
    fontSize: 45, // Adjust the size of the text
    fontWeight: "500", // Makes the text bold
    color: "black",
    //fontFamily: 'Roboto-Bold',       // Sets the text color to black
  },
});
