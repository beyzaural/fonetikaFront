import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const GoalRing = ({ progress = 0, goal = 10, worked = 0 }) => {
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const cappedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - cappedProgress);

  let progressColor = "#FF3B30"; // Default kırmızı tonu
  if (progress >= 1) {
    progressColor = "#388E3C"; // Yeşil dolu için
  } else if (progress >= 0.8) {
    progressColor = "#66BB6A"; // Açık yeşil
  } else if (progress >= 0.5) {
    progressColor = "#FB8C00"; // Turuncu
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Arka plan dairesi */}
        <Circle
          stroke="#F9F4F1"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* İlerleme dairesi */}
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Ortadaki yazılar */}
      <View style={styles.labelContainer}>
        <Text style={styles.mainLabel}>
          {`${Math.round(Math.min(progress, 1) * 100)}%`}
        </Text>

        <Text style={styles.subLabel}>{`Çalışıldı: ${worked}`}</Text>

        <Text style={styles.subLabel}>{`Hedef: ${goal}`}</Text>
      </View>
    </View>
  );
};

export default GoalRing;

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)", // Hafif arka plan parlaklığı
    borderRadius: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  labelContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  mainLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F9F4F1", // Açık krem
  },
  subLabel: {
    fontSize: 12,
    color: "#E3EFF0",
    marginTop: 2,
  },
});
