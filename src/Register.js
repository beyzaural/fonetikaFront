import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BackButton from "./BackButton";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useState } from "react";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;
const occupations = [
  "Yazılım Geliştirici",
  "Veri Bilimci",
  "Öğretmen",
  "Doktor",
  "Hemşire",
  "Avukat",
  "Mimar",
  "Muhasebeci",
  "Grafik Tasarımcı",
  "Öğrenci",
  "Proje Yöneticisi",
  "İşçi",
  "Serbest Çalışan (Freelancer)",
  "Girişimci",
  "Yazar",
  "Dijital Pazarlama Uzmanı",
  "Sosyal Medya Uzmanı",
  "Fotoğrafçı",
  "Müzisyen",
  "Antrenör",
  "Çiftçi",
  "Veteriner",
  "Diğer",
];

const countryCodes = [
  { code: "+90", country: "Türkiye" },
  { code: "+1", country: "Amerika" },
  { code: "+44", country: "İngiltere" },
  { code: "+33", country: "Fransa" },
  { code: "+49", country: "Almanya" },
];

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ Toggle state
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+90");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [occupationDropdownVisible, setOccupationDropdownVisible] =
    useState(false);
  const [searchText, setSearchText] = useState("");

  const handleRegister = async () => {
    console.log(API_URL);
    if (!username || !email || !password || !gender || !phone) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email format
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir email adresi girin.");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/; // Only numbers, 10 to 15 digits
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Geçersiz Telefon Numarası",
        "Lütfen geçerli bir telefon numarası girin (10-15 haneli ve sadece rakamlardan oluşmalı)."
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[A-ZÇĞÖŞÜİ])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{7,})/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Hata",
        "Şifreniz en az bir büyük harf, bir noktalama işareti içermeli ve 6 haneden uzun olmalıdır."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor. Lütfen tekrar deneyin.");
      return;
    }

    try {
      const fullPhoneNumber = `${countryCode}${phone}`;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          phone: fullPhoneNumber,
          gender,
          occupation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(
          "Navigating to OTPVerification with Token:",
          data.data.tempToken
        );
        navigation.navigate("OTPVerification", {
          phone: fullPhoneNumber,
          tempToken: data.data.tempToken,
          email: email,
        });
      } else {
        Alert.alert("Hata", data.message || "Kayıt başarısız oldu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    }
  };

  const filteredOccupations = occupations.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Title */}
        <View style={styles.topContainer}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Kayıt Olun</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}> Ad </Text>
            <TextInput
              placeholder="Adınızı giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              onChangeText={setUsername}
              value={username}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}> Email </Text>
            <TextInput
              placeholder="Email adresinizi giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}> Telefon Numarası </Text>
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                style={styles.countryCodeSelector}
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text style={styles.countryCodeText}>{countryCode}</Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Telefon numaranızı giriniz"
                style={[styles.textInputStyle, styles.phoneInputStyle]}
                placeholderTextColor="#888"
                keyboardType="numeric"
                onChangeText={setPhone}
                value={phone}
              />
            </View>
            {dropdownVisible && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={countryCodes}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCountryCode(item.code);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>
                        {item.country} ({item.code})
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Password Field with Eye Icon */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Şifre</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Şifrenizi giriniz"
                style={styles.textInputStyle}
                placeholderTextColor="#888"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                value={password}
              />
              {/* 👁️ Toggle Password Visibility */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordRequirementsText}>
              Şifre en az bir büyük harf, bir noktalama işareti içermeli ve 6
              haneden uzun olmalıdır.
            </Text>
          </View>

          {/* Confirm Password Field with Eye Icon */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Şifre Tekrar</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Şifrenizi tekrar giriniz"
                style={styles.textInputStyle}
                placeholderTextColor="#888"
                autoCapitalize="none"
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
              {/* 👁️‍🗨️ Toggle Confirm Password Visibility */}
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome
                  name={showConfirmPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Mesleğiniz</Text>
            <TouchableOpacity
              style={[styles.textInputStyle]}
              onPress={() =>
                setOccupationDropdownVisible(!occupationDropdownVisible)
              }
            >
              <Text
                style={
                  occupation
                    ? styles.selectedText // Style when an occupation is selected
                    : styles.placeholderText // Style for the placeholder
                }
              >
                {occupation || "Meslek Seçiniz"}
              </Text>
            </TouchableOpacity>

            {occupationDropdownVisible && (
              <View style={styles.dropdownContainer}>
                <TextInput
                  placeholder="Meslek Ara"
                  style={styles.searchInput}
                  placeholderTextColor="#888"
                  onChangeText={setSearchText}
                  value={searchText}
                />
                <FlatList
                  data={filteredOccupations}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setOccupation(item);
                        setOccupationDropdownVisible(false);
                        setSearchText("");
                      }}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <View style={styles.genderContainer}>
            <Text style={styles.labelText}> Cinsiyet</Text>
            <View style={styles.genderButtons}>
              {/* Erkek Button */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Erkek" && styles.selectedGenderButton,
                ]}
                onPress={() => setGender("Erkek")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Erkek" && styles.selectedGenderButtonText,
                  ]}
                >
                  Erkek
                </Text>
              </TouchableOpacity>

              {/* Kız Button */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Kadın" && styles.selectedGenderButton,
                ]}
                onPress={() => setGender("Kadın")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Kadın" && styles.selectedGenderButtonText,
                  ]}
                >
                  Kadın
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister} // Directly call the handleRegister function
            style={({ pressed }) => [styles.button]}
          >
            <Text style={styles.registerText}>Kayıt Ol</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 55,
    position: "relative",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  formContainer: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 25,
  },
  labelText: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "white",
    fontSize: 14,
    color: "#555",
    zIndex: 1,
  },

  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeSelector: {
    width: 70,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#555",
  },
  phoneInputStyle: {
    flex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    zIndex: 10,
  },
  searchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selectedGenderButton: {
    backgroundColor: "black",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "bold",
  },
  selectedGenderButtonText: {
    color: "white",
  },
  searchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    marginTop: 20,
  },
  registerText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    height: 50, // Ensure consistent height with other fields
    paddingVertical: 14, // Align placeholder vertically
    paddingHorizontal: 14, // Add padding for horizontal spacing
    fontSize: 16,
    justifyContent: "center",
    backgroundColor: "white",
  },

  placeholderText: {
    fontSize: 16,
    color: "#888", // Placeholder color
    textAlignVertical: "center", // Align vertically
  },

  selectedText: {
    fontSize: 16,
    color: "#000", // Selected text color
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  passwordRequirementsText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    lineHeight: 16,
  },
});
