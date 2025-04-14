import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

const ProgressBar = ({ weeklyLoginDays = [] }) => {
  const normalizedLoginDays = weeklyLoginDays.map((day) =>
    day.toLowerCase().trim()
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.daysContainer}>
          {days.map((day, index) => {
            const isLogged = normalizedLoginDays.includes(day.toLowerCase());
            return (
              <View
                key={index}
                style={[
                  styles.dayBox,
                  { backgroundColor: isLogged ? "#b0eac2" : "#f2f2f2" },
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.statusText}>{isLogged ? "✓" : "—"}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 15,
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayBox: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    width: 60,
    marginRight: 10,
  },
  dayText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 18,
    marginTop: 5,
    color: "#333",
  },
});

export default ProgressBar;
