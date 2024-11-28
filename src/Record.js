import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const navigation = useNavigation(); // Use navigation to navigate between pages
  const [fontsLoaded] = useFonts({
    'Parkinsans-Medium': require('../assets/fonts/Parkinsans-Medium.ttf'),
    'NotoSans-Regular': require('../assets/fonts/NotoSans-Regular.ttf'),
    'SourGummy-Medium': require('../assets/fonts/SourGummy-Medium.ttf'),
  });

  // Turkish sentence with all 29 letters
  const turkishSentence = 'Pijamalı hasta yağız şoföre çabucak güvendi.';

  const handlePressMicrophone = () => {
    if (isRecording) {
      // Stop "Recording" and navigate to Home.js
      setIsRecording(false);

      // Navigate to Home.js after 2 seconds
      setTimeout(() => {
        navigation.navigate('Home');
      }, 300);
    } else {
      // Start "Recording"
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container for Title and Instruction */}
      <View style={styles.topContainer}>
        <Text style={styles.sentenceText}>
            {turkishSentence}
          </Text>
      </View>
      

      {/* Centered Microphone Button */}
      <View style={styles.centerContainer}>
    
        <TouchableOpacity
          onPress={handlePressMicrophone}
          style={[
            styles.microphoneButton,
            { backgroundColor: isRecording ? '#C91923' : 'black' },
          ]}
        >
          <Image
            source={require('../assets/icons/microphone-black-shape.png')} // Replace with your microphone icon path
            style={styles.microphoneIcon}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>
          {isRecording
            ? 'Kayıt başladı... Durdurmak için tekrar basınız.'
            : 'Kayıt için mikrofona basınız.'}
        </Text>

      </View>

      {/* Footer Disclaimer */}
      <View style={styles.footerContainer}>
        <Text style={styles.disclaimer}>
          Uygulamamız KVKK yasalarına uygun şekilde tasarlanmıştır. Kişisel verilerininizi korur, paylaşmaz.
        </Text>
      </View>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20, // Add some padding at the top and bottom
  },
  topContainer: {
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    marginTop:50,
    fontFamily: 'Parkinsans-Medium',
    fontWeight:'200',
    paddingHorizontal:'20'
    //position: 'absolute',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },

  centerContainer: {
    //justifyContent: 'center',
    top:'15%',
    alignItems: 'center',
    flex: 1, // Ensure the button is properly centered
    //marginTop:40,
  },
  instruction: {
    marginTop: 30,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },

  microphoneButton: {
    width: 180,
    height: 180,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',

  },
  microphoneIcon: {
    width: 90,
    height: 90,
    tintColor: 'white', // Icon color
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 20, // Add padding to avoid clipping on the bottom
  },
  disclaimer: {
    paddingHorizontal:'20',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
