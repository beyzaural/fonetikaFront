import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const GoalRing = ({ progress = 0, goal = 10 }) => {
  const size = 120;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const cappedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - cappedProgress);

  const overflowProgress = progress > 1 ? progress - 1 : 0;
  const overflowOffset = circumference * (1 - (overflowProgress % 1));

  let progressColor = "#B71C1C"; // 🔴 Red
  if (progress >= 1) {
    progressColor = "#388E3C"; // 🟢 Darker Green for full
  } else if (progress >= 0.8) {
    progressColor = "#66BB6A"; // 🟢 Lighter Green (your request)
  } else if (progress >= 0.5) {
    progressColor = "#FB8C00"; // 🟠 Orange
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background gray ring (only shown if progress < 100%) */}
        {progress < 1 && (
          <Circle
            stroke="#ddd"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
        )}

        {/* Main progress ring */}
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

        {/* Overflow tail */}
        {progress > 1 && (
          <Circle
            stroke={progressColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={overflowOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
            opacity={0.5}
          />
        )}
      </Svg>

      {/* Centered text */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{`${Math.round(
          Math.min(progress, 1) * 100
        )}%`}</Text>
        <Text style={styles.subLabel}>
          Çalışılan: {Math.floor(progress * goal)}
        </Text>
        <Text style={styles.subLabel}>Hedef: {goal}</Text>
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
    marginRight: 20,
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subLabel: {
    fontSize: 14,
    color: "white",
  },
});
