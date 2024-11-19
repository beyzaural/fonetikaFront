
import { 
  StyleSheet, 
  Text,
  View, // Add View here
  TextInput,
  Pressable 
} from 'react-native';

import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [result, setResult] = useState("");

  return (
    <LinearGradient
      colors={['#c8b0d0', '#FFFFFF']} // Purple to white gradient
      style={styles.container}
      start={{  x: 0.1, y: 0.2 }}       // Start from top-left corner
      end={{ x: 0.8, y: 0.8 }}     // Control the gradient's end point to focus purple in the top-left
      locations={[0, 0.5]}  // Control where the transition happens
    >
      <Text style={styles.welcomeText}>WELCOME {result}</Text>

      <Text>Name</Text>
      <TextInput
        placeholder="Enter your name"
        style={styles.textInputStyle}
        onChangeText={setName}
        value={name}
      />

      <Text>Surname</Text>
      <TextInput
        placeholder="Enter your surname"
        style={styles.textInputStyle}
        onChangeText={setSurname}
        value={surname}
      />

      <Pressable 
        onPress={() => setResult(name + " " + surname)}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "gray" : "blue"
          },
          styles.button
        ]}
      >
        <Text style={styles.kaydolText}>Kaydol</Text>
      </Pressable>
    </LinearGradient>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  textInputStyle: {
    borderWidth: 1,
    width: '80%',
    height: 50,
    borderRadius: 10,
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  kaydolText: {
    fontWeight: 'bold',
    color: 'white',
  }
});
