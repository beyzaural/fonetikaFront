import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    TouchableOpacity,
  } from "react-native";
  import React, { useState } from "react";
  
  const Register = ({ navigation }) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState(""); // Stores the selected gender
  
    return (
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.titleText}>Kayıt Olun</Text>
  
        {/* Input Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>  Ad   </Text>
            <TextInput
              placeholder="Adınızı giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              onChangeText={setName}
              value={name}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>  Soyad   </Text>
            <TextInput
              placeholder="Soyadınızı giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              onChangeText={setSurname}
              value={surname}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>  Email   </Text>
            <TextInput
              placeholder="Email adresinizi giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              onChangeText={setEmail}
              value={email}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>  Şifre   </Text>
            <TextInput
              placeholder="Şifrenizi giriniz"
              style={styles.textInputStyle}
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>
  
          <View style={styles.genderContainer}>
            <Text style={styles.labelText}>  Cinsiyet</Text>
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
            onPress={() => {
              if (gender) {
                navigation.navigate("Record");
              } else {
                alert("Lütfen cinsiyet seçiniz.");
              }
            }}
            style={({ pressed }) => [styles.button]}
          >
            <Text style={styles.registerText}>Kayıt Ol</Text>
          </Pressable>
        </View>
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
    titleText: {
      fontSize: 30,
      fontWeight: "bold",
      color: "black",
      marginBottom: 40,
      textAlign: "center",
    },
    formContainer: {
      paddingHorizontal: 10,
    },
    inputContainer: {
      marginBottom: 20,
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
    textInputStyle: {
      borderWidth: 1,
      borderColor: "#E8E8E8",
      width: "100%",
      height: 52,
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 16,
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
  });
  