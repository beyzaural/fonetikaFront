import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getUserProfile } from "./utils/auth";
import BottomNavBar from "./BottomNavBar";

const Profile = ({ navigation }) => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [parola, setParola] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      console.log("Fetched profile:", profile);
      if (profile) {
        setUserName(profile.username);
        setEmail(profile.email);
        setAvatar(profile.username.charAt(0).toUpperCase());
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    Alert.alert("Bilgi", "Bilgileriniz başarıyla güncellendi!");
  };

  const handleBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require("../assets/images/backspace.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeAvatarText}>AVATARI DEĞİŞTİR</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Fields */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Ad</Text>
        <TextInput
          style={styles.fieldInput}
          value={userName}
          editable={false}
        />

        <Text style={styles.fieldLabel}>Parola</Text>
        <TextInput
          style={styles.fieldInput}
          value={parola}
          onChangeText={setParola}
          placeholder="Parolanızı girin"
          secureTextEntry={true}
        />

        <Text style={styles.fieldLabel}>E-posta</Text>
        <TextInput
          style={styles.fieldInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>HESABI GÜNCELLE</Text>
      </TouchableOpacity>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    zIndex: 10,
  },
  backIcon: {
    width: 45,
    height: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  avatarText: {
    fontSize: 40,
    color: "gray",
  },
  changeAvatarText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  fieldContainer: {
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
