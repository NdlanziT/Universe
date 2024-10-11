import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Home = ({navigation}) => {
  const messageCount = 10; // Number of messages to display in the badge

  const showAlert = () => {
    Alert.alert("you clicked a button");
  };
  const gotoMessage= () => {
    navigation.navigate('Inbox');

  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <View style={styles.topappname}>
          <Text style={styles.appname}>UniVerse</Text>
          <FontAwesome onPress={showAlert} name="caret-down" size={30} color="white" style={styles.icon1} />
        </View>
        <View style={styles.iconContainer}>
          <FontAwesome onPress={showAlert} name="plus-circle" size={30} color="white" style={styles.icon} />
          <FontAwesome onPress={showAlert} name="search" size={30} color="white" style={styles.icon} />
          <TouchableOpacity style={styles.messageIconContainer} onPress={gotoMessage}>
            <FontAwesome  name="inbox" size={30} color="white" style={styles.icon} />
            {messageCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{messageCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.text}>Fetching posts...</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Full width
    paddingHorizontal: width * 0.05, // 5% of the screen width
    paddingVertical: height * 0.02, // 2% of the screen height
    backgroundColor: 'black', // Background color of the top bar
    borderBottomWidth: 2, // Optional: add a border at the bottom
    borderBottomColor: '#404040', // Optional: border color
    marginTop: height * 0.03, // 5% of the screen height
  },
  topappname: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  appname: {
    fontSize: width < 400 ? 24 : 28, // Adjust font size based on screen width
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5, // Space between app name and caret
    marginBottom: -5, // Adjust if needed
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  icon: {
    marginLeft: width * 0.04, // Space between icons (5% of screen width)
    marginBottom: -5, // Space between icons
    fontWeight: 'thin',
  },
  icon1: {
    marginBottom: -5, // Space between icons
  },
  messageIconContainer: {
    position: 'relative', // Position relative for badge placement
  },
  badge: {
    position: 'absolute',
    right: -5, // Adjust based on icon size
    top: -5, // Adjust based on icon size
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1, // Take the remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
    marginTop: 10, // Space above the text
  },
});
