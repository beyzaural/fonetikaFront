import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useRouter } from "expo-router";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.apiUrl;

const GoalSelection = () => {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("tempToken");
      if (!storedToken) {
        Alert.alert("Hata", "Kimlik doğrulama bulunamadı.");
        router.replace("/login");
      } else {
        setTempToken(storedToken);
      }
    };
    getToken();
  }, []);

  const handleApply = async () => {
    if (!selectedGoal) {
      Alert.alert("Error", "Lütfen bir hedef seçiniz!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/update-daily-goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ dailyGoal: selectedGoal }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        router.push({ pathname: "/home", params: { dailyGoal: selectedGoal } });
      } else {
        Alert.alert("Hata", data.message || "Günlük hedef kaydedilemedi.");
      }
    } catch (error) {
      console.error("Goal update error:", error);
      Alert.alert("Hata", "Sunucu hatası oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section with Image and Text */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/brainlight.png")} // Replace with your actual image path
          style={styles.characterImage}
        />
        <Text style={styles.questionText}>Günlük hedefin ne?</Text>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        {[
          { value: 5, label: "Rahat" },
          { value: 10, label: "Orta" },
          { value: 15, label: "Ciddi" },
          { value: 20, label: "Yoğun" },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selectedGoal === option.value && styles.selectedOption,
            ]}
            onPress={() => setSelectedGoal(option.value)}
          >
            <Text style={styles.optionText}>Günde {option.value} kelime</Text>
            <Text style={styles.optionSubText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Uygula</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoalSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // justifyContent: "space-between",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
    paddingHorizontal: 15,
    fontFamily: "bold",
    fontStyle: "bold",
  },
  characterImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  questionText: {
    fontSize: 24,
    color: "black",
    flexShrink: 1,
  },
  optionsContainer: {
    marginTop: 30, // Reduce space between topSection and options
    paddingHorizontal: 15, // Add horizontal padding for alignment
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#007BFF",
    backgroundColor: "#E6F0FF",
  },
  optionText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  optionSubText: {
    fontSize: 14,
    color: "#666",
  },
  applyButton: {
    position: "absolute",
    bottom: 50, // 20 space from the bottom
    left: 20,
    right: 20,
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
