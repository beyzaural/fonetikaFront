import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import Home from "../src/Home";
import Kelime from "../src/Kelime";
import Record from "../src/Record";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Record">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Kelime" component={Kelime} />
        <Stack.Screen name="Record" component={Record} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Your styles go here
});
