import { 
    StyleSheet, 
    Text,
    View, // Add View here
    TextInput,
    Image,
    Animated, // Import Animated for animation
  } from 'react-native';
  import React, { useEffect, useRef } from 'react';

  import { useFonts } from 'expo-font';
  import { useNavigation } from '@react-navigation/native';

  const Merhaba = () => {
    return ( 
        <View style={styles.container}>
                {/* Top Container for Title and Instruction */}
        <View style={styles.topContainer}>
        <Image 
          source={require('../assets/images/hello.png')} // Adjust the path to your hello.png
          style={styles.topImage}
        />
        </View>
        <View style={styles.whiteBox}>
          <Text style={styles.sentenceText}>
            This is a white rectangular box.
          </Text>
        </View>
        <View style={styles.bottomContainer}>
           
        </View>
        </View>
      );
  };
  export default Merhaba;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f3f0',
      alignItems: 'center', 
      //paddingVertical: 20, // Add some padding at the top and bottom
    },
    topContainer: {
      flex: 1, // Take half the screen
      //justifyContent: 'center',
      alignItems: 'center', 
        backgroundColor: '#f8f3f0',
        //paddingVertical: 20, // Add some padding at the top and bottom
      },
      topImage: {
        marginTop:50,
        width: 700, // Adjust the image width
        height: 500, // Adjust the image height
        //resizeMode: 'contain', // Ensure the image scales properly
      },
    bottomContainer: {
      //flex: 1, // Take the other half of the screen
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'ffffff',
        //paddingVertical: 20, // Add some padding at the top and bottom
      },
      whiteBox: {
        width: '99%', // Width of the white box
        height: 350, // Height of the white box
        backgroundColor: '#ffffff', // White color for the box
        borderRadius: 40, // Rounded corners for the box
        justifyContent: 'center',
        alignItems: 'center',
      
      },


  });
  