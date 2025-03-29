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
import Merhaba from "../src/Merhaba";
import Register from "../src/Register";
import Paragraph from "../src/Paragraph";
import Dersler from "../src/Dersler";
import Tekrar from "../src/Tekrar";
import Atekrar from "../src/Atekrar";
import Sohbet from "../src/Sohbet";
import Acourse from "../src/Acourse";
import Akelime from "../src/Akelime";
import Geneltekrar from "../src/Geneltekrar";
import OTPVerification from "../src/OTPVerification";
import EmailVerification from "../src/EmailVerification";
import LoginOTPVerification from "../src/LoginOTPVerification";
import GoalSelection from "../src/GoalSelection";
import Profile from "../src/Profile";
import Ayarlar from "../src/Ayarlar";
import ForgotPasswordScreen from "../src/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/ResetPasswordScreen";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GoalSelection">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hide header for Login
        />
        <Stack.Screen
          name="LoginOTPVerification"
          component={LoginOTPVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }} // Hide header for Login
        />
        <Stack.Screen
          name="GoalSelection"
          component={GoalSelection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerification} // Add OTPVerification screen
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Ayarlar"
          component={Ayarlar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }} // Hide header for Login
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
        <Stack.Screen
          name="Merhaba"
          component={Merhaba}
          options={{ headerShown: false }} // Hide header for Fonetika
        />
        <Stack.Screen
          name="Paragraph"
          component={Paragraph}
          options={{ headerShown: false }} // Hide header for Fonetika
        />
        <Stack.Screen
          name="Dersler"
          component={Dersler}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Tekrar"
          component={Tekrar}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Atekrar"
          component={Atekrar}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Sohbet"
          component={Sohbet}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Acourse"
          component={Acourse}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Akelime"
          component={Akelime}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Geneltekrar"
          component={Geneltekrar}
          options={{ headerShown: false }} // Hide header for Home
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Your styles go here
});
