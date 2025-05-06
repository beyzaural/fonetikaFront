import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const BackButton = ({
  navigation,
  size = 40,
  color = "#FF3B30",
  style = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={() => navigation.goBack()}
    >
      <FontAwesome name="arrow-left" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
});

export default BackButton;
