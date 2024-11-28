import { 
  StyleSheet, 
  Text,
  View,
  TextInput,
  Pressable,
  Image
} from 'react-native';

import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient'; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
      <Image 
          source={require('../assets/images/login2.png')} // Adjust the path to your hello.png
          style={styles.topImage}
          resizeMode="contain"
        
        />
      </View>

      {/* Main Login Form */}
      <View style={styles.formContainer}>

      <Text style={styles.titleText}>Hesabınıza giriş yapın </Text>


        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>  Email   </Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.textInputStyle}
            placeholderTextColor="#888"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>  Password   </Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.textInputStyle}
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <Pressable 
           onPress={() => navigation.navigate('Home')} // Navigate to Home
          style={({ pressed }) => [
            styles.button
          ]}
        >
          <Text style={styles.kaydolText}>Giriş Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    backgroundColor: '#white', // Light grey background
    //paddingVertical: 20,
    justifyContent: 'center',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 35,
    textAlign:'center'
  },
  subtitleText: {
    fontSize: 18,
    color: 'black',
    opacity: 0.8,
  },
  topImage: {
    marginTop:30,
    width: 550, // Adjust the image width
    height: 500, // Adjust the image height

  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  labelText: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: 'white', // To "mask" the input border
    fontSize: 14,
    color: '#555',
    zIndex: 1, // Ensure label stays above the border
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: '#E8E8E8', 
    width: '100%',
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 14, // Placeholder starts 10 padding from the left
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', // Green color like in the design
  },
  kaydolText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});
