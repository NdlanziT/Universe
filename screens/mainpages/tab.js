import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, View } from 'react-native';

import Home from './home';
import Marketplace from './marketplace';
import Tutoringservices from './tutoringservices';
import Mentalhealth from './mentalhealth';
import Profilemenu from './profile';

const Tabpage = createBottomTabNavigator();

export default function Tab() {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  // Preload icons before rendering the tab navigator
  useEffect(() => {
    const loadIcons = async () => {
      await FontAwesome.loadFont(); 
      setIconsLoaded(true); 
    };

    loadIcons();
  }, []);

  // Show loading spinner until the icons are ready
  if (!iconsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  // Render tab navigator once icons are loaded
  return (
    <Tabpage.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          const iconSize = 30;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Market') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Tutoring') {
            iconName = 'book';
          } else if (route.name === 'Mental') {
            iconName = 'stethoscope';
          } else if (route.name === 'Profile') {
            iconName = 'user-circle';
          }

          return <FontAwesome name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarActiveTintColor: 'grey',
        tabBarInactiveTintColor: 'white',
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
