import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import Home from "../src/Home";
import Kelime from "../src/Kelime";
import Record from "../src/Record";
import Login from "../src/Login";
import Fonetika from "../src/Fonetika";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Fonetika">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Hide header for Login
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen 
          name="Kelime" 
          component={Kelime} 
          options={{ headerShown: false }} // Hide header for Kelime
        />
        <Stack.Screen 
          name="Record" 
          component={Record} 
          options={{ headerShown: false }} // Hide header for Record
        />
        <Stack.Screen 
          name="Fonetika" 
          component={Fonetika} 
          options={{ headerShown: false }} // Hide header for Fonetika
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Your styles go here
});
