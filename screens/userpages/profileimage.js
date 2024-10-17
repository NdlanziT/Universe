import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FullScreenImagePage = () => {
  const goBack = () => {
    // Add your go back logic here (e.g., navigation)
    alert('Go back clicked');
  };

  return (
    <View style={styles.container}>
      <Image
            source={require('./download.jpg')} 
            style={styles.backgroundImage}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
          <Text style={styles.usernameText}>Username</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FullScreenImagePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure the image occupies the full screen
    resizeMode: 'cover', // Ensure the image covers the entire space
  },
  header: {
    position: 'absolute',
    top: 40, // Adjust depending on how much space you want from the top
    left: 20, // Adjust left padding as needed
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});
