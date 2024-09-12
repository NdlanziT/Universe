import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';

import Welcome from './startpages/welcome';
import Login from './startpages/login';
import Signin from './startpages/signin';
import Tab from './mainpages/tab';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Layout = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome"
          component={Welcome} 
          options={{ title: 'Welcome', headerTitleAlign: 'center', headerShown: false }} 
        />
        <Stack.Screen 
          name="Login"
          component={Login} 
          options={{ title: 'Welcome', headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen
          name="Signin" 
          component={Signin} 
          options={{ title: 'Welcome', headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Tab" 
          component={Tab} 
          options={{ title: 'Welcome', headerTitleAlign: 'center', headerShown: false }}        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});