import { 
    StyleSheet, 
    Text, 
    View, // Add View here
    TextInput,
    ImageBackground,
    Image,
    Pressable, 
    ScrollView,
    TouchableOpacity,
    Animated,
  } from 'react-native';
  
  import React, { useState } from 'react';
  import { LinearGradient } from 'expo-linear-gradient';

    
const Kelime = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFrontFlipped, setIsFrontFlipped] = useState(false);
  const [isBackFlipped, setIsBackFlipped] = useState(false);
  const rotateValue = new Animated.Value(0); // Animation for flip effect

  const cards = [
    { front: 'Ağabey', back: 'A:bi' },
    { front: 'Ağır', back: 'A:ır' },
    { front: 'Word 3', back: 'Definition 3' },
  ];

  const flipCard = () => {
    Animated.timing(rotateValue, {
      toValue: isFrontFlipped ? 0 : 1, // Flip to back or front
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFrontFlipped(!isFrontFlipped);
    });
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
     resetFlip() // Reset flip state
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      resetFlip() // Reset flip state
    }
  };
  const resetFlip = () => {
    setIsFrontFlipped(false); // Reset flip state
    rotateValue.setValue(0); // Reset animation to initial value
  };

  const interpolateRotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Flip animation degrees
  });

  return (
    <View style={styles.container}>
      {/* Flashcard */}
      <Animated.View
        style={[
          styles.flashcard,
          { transform: [{ rotateY: interpolateRotation }] },
        ]}
      >
        <TouchableOpacity onPress={flipCard}>
          <LinearGradient
            colors={['#FFFFFF', '#FFFFFF']}
            start={{ x: 3.8, y: 0 }}
            end={{ x: 2.5, y: 1.6 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                {isFrontFlipped ? cards[currentCardIndex].back : cards[currentCardIndex].front}
                </Text>
              {/* Dynamic Icon */}
              <TouchableOpacity 
                onPress={() => console.log(isFrontFlipped ? 'Speaker pressed' : 'Microphone pressed')} 
                style={styles.speakerIconWrapper}
              >
                <Image
                  source={
                    isFrontFlipped
                      ? require('../assets/icons/speaker.png') // Speaker icon
                      : require('../assets/icons/microphone-black-shape.png') // Microphone icon
                  }
                  style={styles.speakerIcon}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Navigation Arrows */}
      <View style={styles.arrowsContainer}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentCardIndex === 0}>
          <Text style={[styles.arrow, currentCardIndex === 0 && styles.disabledArrow]}>
            ←
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentCardIndex === cards.length - 1}
        >
          <Text
            style={[
              styles.arrow,
              currentCardIndex === cards.length - 1 && styles.disabledArrow,
            ]}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/icons/profile.png')} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/icons/settings.png')} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/icons/fitness.png')} // Replace with your icon
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

 
  export default Kelime;


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f3f0', 
       
      },
  
      flashcard: {
        width: '80%',
        height: '65%',
        borderRadius: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8, // Shadow for Android
        
      },
      cardGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
      },
      cardContent: {
        marginTop: 60,
        alignItems: 'center',
        flex: 1,
        padding: 12,
      },
      cardText: {
        fontSize: 30,
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#333',
      },
      speakerIconWrapper: {
        marginTop:120,
        marginLeft:50,
        alignItems: 'center',
        justifyContent:'center',
        transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust based on icon size
      },
      speakerIcon: {
        width: 90, // Set your desired width
        height: 90, // Set your desired height
        alignItems: 'center',
        justifyContent:'center',
        //resizeMode: 'contain', // Keep the icon aspect ratio
      },
      arrowsContainer: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-between',
        width: '80%',
      },
      arrow: {
        fontSize: 50,
        color: '#333',
      },
      disabledArrow: {
        color: '#aaa', // Disabled arrow color
      },
      navBar: {
        position: 'absolute', // Pin it to the bottom
        bottom: 0,
        left: 0,
         width: '100%', // Full width
        height: 70,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      navItem: {
        alignItems: 'center',
      },
      navIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
      },

    });
    