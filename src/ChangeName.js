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
        body: JSON.stringify({ name: username }), // Send username as 'name' to match backend
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
          <Text style={styles.title}>Kullanıcı Adını Güncelle</Text>
        </View>
      </View>

      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Kullanıcı adınız"
      />

      <TouchableOpacity style={styles.button} onPress={handleChangeName}>
        <Text style={styles.buttonText}>Güncelle</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default ChangeName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
