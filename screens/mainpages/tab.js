import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

// Import your icon components
import { Homeicon } from '../icons/home';
import { HealthIcon } from '../icons/health';
import { MarketIcon } from '../icons/market';
import { TutoringIcon } from '../icons/tutoring';
import { UserProfileIcon } from '../icons/userprofile';

// Import screens
import Home from './home';
import Marketplace from './marketplace';
import Tutoringservices from './tutoringservices';
import Mentalhealth from './mentalhealth';
import Profilemenu from './profile';

const Tabpage = createBottomTabNavigator();

export default function Tab() {
  return (
    <Tabpage.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size = "40" }) => { // Use color prop here
          if (route.name === 'Home') {
            return <Homeicon color={color} size={35} />;
          } else if (route.name === 'Market') {
            return <MarketIcon color={color} size={30} />;
          } else if (route.name === 'Tutoring') {
            return <TutoringIcon color={color} size={30} />;
          } else if (route.name === 'Mental') {
            return <HealthIcon color={color} size={30} />;
          } else if (route.name === 'Profile') {
            return (
              <View style={{ position: 'relative' }}>
                <UserProfileIcon color={color} size={30} />
                <View style={styles.badge}>
                </View>
              </View>
            );
          }
        },
        tabBarStyle: {
          backgroundColor: 'black', // Set tab bar background color
          height: 69, // Add padding to the bottom to show the badge
        },
        tabBarActiveTintColor: 'white', // Active icon color (blue)
        tabBarInactiveTintColor: '#737373', // Inactive icon color (white)
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
