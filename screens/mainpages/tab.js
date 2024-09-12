import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, View,Text } from 'react-native';

// Import screens
import Home from './home';
import Marketplace from './marketplace';
import Tutoringservices from './tutoringservices';
import Mentalhealth from './mentalhealth';
import Profilemenu from './profile';

const Tabpage = createBottomTabNavigator();

export default function Tab() {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    const loadIcons = async () => {
      try {
        await FontAwesome.loadFont(); // Ensure FontAwesome fonts are loaded
        setIconsLoaded(true);
      } catch (error) {
        console.error('Error loading icons', error); // Catch any potential errors
      }
    };

    loadIcons();
  }, []);

  // Show a loading indicator while icons are loading
  if (!iconsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

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
            iconName = 'home';
          } else if (route.name === 'Market') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Tutoring') {
            iconName = 'book';
          } else if (route.name === 'Mental') {
            iconName = 'stethoscope';
          } else if (route.name === 'Profile') {
            return (
              <View style={{ position: 'relative' }}>
                <FontAwesome name="user-circle-o" size={iconSize} color={color} />
                {/* Add badge for profile icon */}
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </View>
            );
          }

          // Return the FontAwesome icon
          return <FontAwesome name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabel: () => null, // Hide the tab labels
        tabBarStyle: {
          backgroundColor: 'black', // Set tab bar background color
        },
        tabBarActiveTintColor: '#404040', // Active icon color
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
    right: -10, // Adjust as necessary
    top: -5, // Adjust as necessary
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
};
