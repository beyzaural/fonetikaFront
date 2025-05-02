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
import KursTekrar from "../src/KursTekrar";
import Sohbet from "../src/Sohbet";
import Ders from "../src/Ders";
import KursKelime from "../src/KursKelime";
import Geneltekrar from "../src/Geneltekrar";
import OTPVerification from "../src/OTPVerification";
import EmailOTPVerification from "../src/EmailOTPVerification";
import LoginOTPVerification from "../src/LoginOTPVerification";
import GoalSelection from "../src/GoalSelection";
import Profile from "../src/Profile";
import ForgotPasswordScreen from "../src/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/ResetPasswordScreen";
import ResetOTPVerification from "../src/ResetOTPVerification";
import Ayarlar from "../src/Ayarlar";
import Parola from "../src/Parola";
import Destek from "../src/Destek";
import FAQ from "../src/FAQ";
import Hesap from "../src/Hesap";
import ChangeEmail from "../src/ChangeEmail";
import ChangeName from "../src/ChangeName";
import Startup from "../src/Startup";
import HukukKelime from "../src/HukukKelime";
import YanlisDogruSozcukler from "../src/YanlisDogruSozcukler";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Startup"
          component={Startup}
          options={{ headerShown: false }} // Hide header for Login
        />
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
          name="ResetOTPVerification"
          component={ResetOTPVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Ayarlar"
          component={Ayarlar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hesap"
          component={Hesap}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangeName"
          component={ChangeName}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Parola"
          component={Parola}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Destek"
          component={Destek}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQ}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailOTPVerification"
          component={EmailOTPVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="YanlisDogruSozcukler"
          component={YanlisDogruSozcukler}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="HukukKelime"
          component={HukukKelime}
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
          name="KursTekrar"
          component={KursTekrar}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="Sohbet"
          component={Sohbet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Ders"
          component={Ders}
          options={{ headerShown: false }} // Hide header for Home
        />
        <Stack.Screen
          name="KursKelime"
          component={KursKelime}
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
