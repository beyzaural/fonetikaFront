import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from "./AppNavigator";
export default function App() {
  return <AppNavigator />;
}
const styles = StyleSheet.create({
  container: {
    flex: 1, //ekran tamamını kaplıcak demek yani %100
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
