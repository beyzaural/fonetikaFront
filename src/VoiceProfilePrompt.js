import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";

const VoiceProfilePrompt = ({ navigation }) => {
  const handleCreateNow = () => {
    navigation.navigate("Record", { fromSettings: false });
  };

  const handleCreateLater = () => {
    navigation.navigate("GoalSelection");
  };

  return (
    <ImageBackground
      source={require("../assets/images/green.png")}
      style={styles.imageBackground}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Icon
            name="microphone"
            size={80}
            color="#333"
            style={styles.icon}
          />
          
          <Text style={styles.title}>Ses Profilinizi Oluşturun</Text>
          
          <Text style={styles.description}>
            Daha iyi bir deneyim için ses profilinizi oluşturmanızı öneririz. 
            Bu, uygulamanın sizin telaffuzunuzu daha iyi anlamasını sağlayacaktır.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateNow}
            >
              <LinearGradient
                colors={["#d6d5b3", "#FFFFFF"]}
                start={{ x: 4, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Şimdi Oluştur</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleCreateLater}
            >
              <Text style={styles.skipButtonText}>Daha Sonra</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            Ses profilinizi daha sonra Ayarlar menüsünden oluşturabilirsiniz.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: -3, height: -3 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "underline",
  },
  note: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
});

export default VoiceProfilePrompt; 