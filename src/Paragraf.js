import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";import { useFonts } from 'expo-font';

const Paragraf = () => {
  const navigation = useNavigation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontsLoaded] = useFonts({
    'Parkinsans-Medium': require('../assets/fonts/Parkinsans-Medium.ttf'),
    'Parkinsans-Bold': require('../assets/fonts/Parkinsans-Bold.ttf'),
    'NotoSans-SemiBold': require('../assets/fonts/NotoSans-SemiBold.ttf'),
    'NotoSans-Regular': require('../assets/fonts/NotoSans-Regular.ttf'),
    'SourGummy-Medium': require('../assets/fonts/SourGummy-Medium.ttf'),
    'Itim-Regular': require('../assets/fonts/Itim-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
  });


  const handleMicrophonePress = () => {
    setIsSpeaking(!isSpeaking);
    // Additional logic for recording or speaking can be added here
  };

  return (
    <View style={styles.container}>
      {/* Top Container with Paragraph */}
      <View style={styles.topContainer}>
         {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")} // Navigate back to Home.js
      >
        <Image
          source={require("../assets/images/backspace.png")} // Replace with your backspace image
          style={styles.backIcon}
        />
      </TouchableOpacity>
        <Text style={styles.paragraphText}>
          Bugün sabah kahvaltıda bir kahve içtim ve radyoda sevdiğim bir müzik çalıyordu. 
          Öğle saatlerinde bir avukat ile görüşmem gerekti. Ancak randevuma geç kalınca 
          İstanbul trafiğinde bir saat boyunca beklemek zorunda kaldım. Sonunda buluşmaya 
          vardığımda, herkesin toplantıda olduğunu gördüm. Toplantıda, yeni çıkan bir 
          program ve rakip şirket hakkında konuştuk.
        </Text>
      </View>

      {/* Bottom Container with Microphone Icon */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleMicrophonePress}>
          <FontAwesome name="microphone" size={90} color="#880000" />
        </TouchableOpacity>
      </View>


      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/icons/profile.png")} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/icons/settings.png")} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/icons/fitness.png")} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Paragraf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 20, // Adjust for safe area
    left: 10,
    zIndex: 10, // Ensure it's above other elements

  },
  backIcon: {
    width: 50, // Adjust width for the back icon
    height: 50, // Adjust height for the back icon
    color: 'white',
  },
  topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  paragraphText: {
    fontSize:18,
    fontFamily: "Parkinsans-Medium",
    color: "#333",
    textAlign: "justify",
    lineHeight: 28,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
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
