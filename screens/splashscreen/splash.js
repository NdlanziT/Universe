import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';

const Splash = () => {
  return (
    <View style={styles.container}>
      {/* Centered "UniVerse" text */}
      <Text style={styles.title}>UniVerse</Text>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Change to column for proper alignment
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Background set to black
  },
  title: {
    fontSize: 48, // Adjust the font size as per your needs
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginBottom: 20, // Space between text and loading indicator
  },
  loading: {
    marginTop: 10, // Space above the loading indicator
  },
});

export default Splash;
