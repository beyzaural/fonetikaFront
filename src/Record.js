import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const navigation = useNavigation(); // Use navigation to navigate between pages

  const handlePressMicrophone = () => {
    if (isRecording) {
      // Stop "Recording" and navigate to Home.js
      setIsRecording(false);

      // Navigate to Home.js after 2 seconds
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);
    } else {
      // Start "Recording"
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container for Title and Instruction */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Ses Analizi</Text>
        <Text style={styles.instruction}>
          {isRecording
            ? 'Kayıt başladı... Durdurmak için tekrar basınız.'
            : 'Kayıt için mikrofona basınız.'}
        </Text>
      </View>

      {/* Centered Microphone Button */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={handlePressMicrophone}
          style={[
            styles.microphoneButton,
            { backgroundColor: isRecording ? '#D6D5B3' : '#CD83A8' },
          ]}
        >
          <Image
            source={require('../assets/icons/microphone-black-shape.png')} // Replace with your microphone icon path
            style={styles.microphoneIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Footer Disclaimer */}
      <View style={styles.footerContainer}>
        <Text style={styles.disclaimer}>
          Uygulamamız KVKK yasalarına uygun şekilde tasarlanmıştır. Kişisel verilerininizi korur, paylaşmaz
        </Text>
      </View>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f3f0',
    paddingVertical: 60, // Add some padding at the top and bottom
  },
  topContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  instruction: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Ensure the button is properly centered
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
