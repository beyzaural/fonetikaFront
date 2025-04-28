import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BottomNavBar from "./BottomNavBar";
import { LinearGradient } from "expo-linear-gradient";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const ChangeName = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem("token");
      if (!t) return;
      setToken(t);

      const payload = JSON.parse(atob(t.split(".")[1]));
      if (payload.username) setUsername(payload.username);
    };
    load();
  }, []);

  const handleChangeName = async () => {
    if (!username) {
      Alert.alert("Hata", "Lütfen kullanıcı adınızı giriniz.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/profile/change-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: username }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      await AsyncStorage.setItem("token", data.accessToken);

      Alert.alert("Başarılı", "Kullanıcı adı güncellendi.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Hata", e.message);
      console.log("hata");
    } finally {
      setLoading(false);
    }
  };

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
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Kullanıcı Adını Güncelle</Text>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Kullanıcı Adı</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Kullanıcı adınız"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleChangeName}
          disabled={loading}
        >
          <LinearGradient
            colors={["#0a7ea4", "#0a7ea4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Güncelle</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <BottomNavBar navigation={navigation} />
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
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(214, 213, 179, 0.3)",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#0a7ea4",
  },
  buttonGradient: {
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ChangeName;
