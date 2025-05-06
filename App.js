import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// All your screen imports:
import Home from "./src/Home";
import Kelime from "./src/Kelime";
import Record from "./src/Record";
import Login from "./src/Login";
import Fonetika from "./src/Fonetika";
import Merhaba from "./src/Merhaba";
import Register from "./src/Register";
import WordCategory from "./src/WordCategory";
import Dersler from "./src/Dersler";
import Tekrar from "./src/Tekrar";
import KursTekrar from "./src/KursTekrar";
import Sohbet from "./src/Sohbet";
import Ders from "./src/Ders";
import KursKelime from "./src/KursKelime";
import Geneltekrar from "./src/Geneltekrar";
import OTPVerification from "./src/OTPVerification";
import EmailOTPVerification from "./src/EmailOTPVerification";
import LoginOTPVerification from "./src/LoginOTPVerification";
import GoalSelection from "./src/GoalSelection";
import Profile from "./src/Profile";
import ForgotPasswordScreen from "./src/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/ResetPasswordScreen";
import ResetOTPVerification from "./src/ResetOTPVerification";
import Ayarlar from "./src/Ayarlar";
import Parola from "./src/Parola";
import Destek from "./src/Destek";
import FAQ from "./src/FAQ";
import Hesap from "./src/Hesap";
import ChangeEmail from "./src/ChangeEmail";
import ChangeName from "./src/ChangeName";
import Startup from "./src/Startup";
import CategoryWordMain from "./src/CategoryWordMain";
import YanlisDogruSozcukler from "./src/YanlisDogruSozcukler";
import CategoryWordCard from "./src/CategoryWordCard";
import CategoryWordList from "./src/CategoryWordList";
import CategoryRandomStudy from "./src/CategoryRandomStudy";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Startup">
          {/* Screens below */}
          <Stack.Screen
            name="Startup"
            component={Startup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoalSelection"
            component={GoalSelection}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerification}
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="YanlisDogruSozcukler"
            component={YanlisDogruSozcukler}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryWordMain"
            component={CategoryWordMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryWordCard"
            component={CategoryWordCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryWordList"
            component={CategoryWordList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryRandomStudy"
            component={CategoryRandomStudy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Kelime"
            component={Kelime}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Record"
            component={Record}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Fonetika"
            component={Fonetika}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Merhaba"
            component={Merhaba}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WordCategory"
            component={WordCategory}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dersler"
            component={Dersler}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tekrar"
            component={Tekrar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KursTekrar"
            component={KursTekrar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sohbet"
            component={Sohbet}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Ders"
            component={Ders}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KursKelime"
            component={KursKelime}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Geneltekrar"
            component={Geneltekrar}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
