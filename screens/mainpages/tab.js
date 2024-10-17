import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Change to Ionicons
import { ActivityIndicator, View, Text } from 'react-native';

// Import screens
import Home from './home';
import Marketplace from './marketplace';
import Tutoringservices from './tutoringservices';
import Mentalhealth from './mentalhealth';
import Profilemenu from './profile';

const Tabpage = createBottomTabNavigator();

export default function Tab() {
  const [iconsLoaded, setIconsLoaded] = useState(true); // Set to true since Ionicons load automatically

  // Render the tab navigator when icons are ready
  return (
    <Tabpage.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          const iconSize = 30;

          // Determine which icon to show based on the route
          if (route.name === 'Home') {
            iconName = 'home-outline'; // Use Ionicons icon name
          } else if (route.name === 'Market') {
            iconName = 'cart'; // Use Ionicons icon name
          } else if (route.name === 'Tutoring') {
            iconName = 'school-outline'; // Use Ionicons icon name
          } else if (route.name === 'Mental') {
            iconName = 'pulse'; // Use Ionicons icon name
          } else if (route.name === 'Profile') {
            iconName = 'person-circle'; // Use Ionicons icon name
            return (
              <View style={{ position: 'relative' }}>
                <Icon name={iconName} size={iconSize} color={color} />
                <View style={styles.badge}>
                </View>
              </View>
            );
          }

          // Return the Ionicons icon
          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabel: () => null, // Hide the tab labels
        tabBarStyle: {
          backgroundColor: 'black', // Set tab bar background color
          height: 60, // Add padding to the bottom to show the badge
        },
        tabBarActiveTintColor: '#007AFF', // Active icon color
        tabBarInactiveTintColor: 'white', // Inactive icon color
      })}
    >
      <Tabpage.Screen name="Home" component={Home} />
      <Tabpage.Screen name="Market" component={Marketplace} />
      <Tabpage.Screen name="Tutoring" component={Tutoringservices} />
      <Tabpage.Screen name="Mental" component={Mentalhealth} />
      <Tabpage.Screen name="Profile" component={Profilemenu} />
    </Tabpage.Navigator>
  );
}

// Styles for the badge
const styles = {
  badge: {
    position: 'absolute',
    right: -2, // Adjust as necessary
    top: -4, // Adjust as necessary
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
