import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to my Expo App!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, //ekran tamamını kaplıcak demek yani %100
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
