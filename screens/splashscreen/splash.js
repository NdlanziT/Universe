import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const Splash = () => {
  // Animation value for the dots
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBounce = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce1, {
            toValue: -10, // Move dot 1 up
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(bounce1, {
            toValue: 0, // Move dot 1 down
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce2, {
            toValue: -10, // Move dot 2 up
            duration: 500,
            delay: 250, // Delay to create alternating effect
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(bounce2, {
            toValue: 0, // Move dot 2 down
            duration: 500,
            delay: 250,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateBounce();
  }, [bounce1, bounce2]);

  return (
    <View style={styles.container}>
      {/* Centered "UniVerse" text */}
      <Text style={styles.title}>UniVerse </Text>


      {/* Animated Dots */}
      <View style={styles.dotContainer}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce2 }] }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Background set to black
  },
  title: {
    fontSize: 48, // Adjust the font size as per your needs
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginBottom: 40, // Space between text and dots
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12, // Dot width
    height: 12, // Dot height
    borderRadius: 6, // Make it round
    backgroundColor: '#FFFFFF', // White dots
    marginHorizontal: 5, // Space between dots
  },
});

export default Splash;
