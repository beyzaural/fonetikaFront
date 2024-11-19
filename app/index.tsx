import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { 
  StyleSheet, 
  Text,
  View,
  TextInput,
  Pressable 
} from 'react-native';
import Home from '../src/Home';
import Kelime from '../src/Kelime';


export default function Index() {
  return (
    <>
      <Kelime />
    </>
  );
}

const styles = StyleSheet.create({
  // Your styles go here
});