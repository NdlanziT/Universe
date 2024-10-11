import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';

import Welcome from './startpages/welcome';
import Login from './startpages/login';
import Signin from './startpages/signin';
import Tab from './mainpages/tab';


import Dashboard from './menupages/dashboard/dashboard';
import Reach from './menupages/dashboard/reach';
import Engagement from './menupages/dashboard/engagement';
import Totalfollowers from './menupages/dashboard/followers';


import Edit from './menupages/edit/edit';
import Changeusernames from './menupages/edit/changeusername'
import Changebio from './menupages/edit/changebio'
import Links from './menupages/edit/links'
import Addlink from './menupages/edit/addlink'




import FollowingPage from './menupages/following/followingpage';

import Notification from './menupages/notification/notification';

import Menu from './menupages/menu/menu';
import Saved from './menupages/menu/saved';
import Favourites from './menupages/menu/favourites';
import Discover from './menupages/menu/discover';
import Blocked from './menupages/menu/blocked';
import NotificationSettings from './menupages/menu/notification';
import AccountPrivacy from './menupages/menu/accountprivacy';
import Theme from './menupages/menu/theme';
import About from './menupages/menu/about';
import Manageaccount from './menupages/menu/manageaccount';
import Changeemail from './menupages/menu/changeemail';
import Changephone from './menupages/menu/Changephone';
import Changepassword from './menupages/menu/changepassword';

import Inbox from './messagepages/Inbox';
import Messagespage from './messagepages/messagepage';

import Userprofile from './userpages/userprofile';
import Userfollowers from './userpages/userfollowers';
import FullScreenImagePage from './userpages/profileimage';








import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Layout = () => {
  return (
    <NavigationContainer styles={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome"
          component={Welcome} 
          options={{ headerTitleAlign: 'center', headerShown: false }} 
        />
        <Stack.Screen 
          name="Login"
          component={Login} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen
          name="Signin" 
          component={Signin} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Tab" 
          component={Tab} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Dashboard"  
          component={Dashboard} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Edit"  
          component={Edit} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Followingpage"  
          component={FollowingPage} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Notification"  
          component={Notification} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Menu"  
          component={Menu} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Reach"  
          component={Reach} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Engagement"  
          component={Engagement} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Totalfollowers"  
          component={Totalfollowers} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Changeusername"  
          component={Changeusernames} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Changebio"  
          component={Changebio} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Links"  
          component={Links} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Addlink"  
          component={Addlink} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Saved"  
          component={Saved} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Favourites"  
          component={Favourites} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Discover"  
          component={Discover} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Notificationsettings"  
          component={NotificationSettings} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Accountprivacy"   
          component={AccountPrivacy} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Theme"  
          component={Theme} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="About"  
          component={About} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Manageaccount"  
          component={Manageaccount} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Changeemail"  
          component={Changeemail} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Changephone"   
          component={Changephone} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Changepassword"  
          component={Changepassword} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
          name="Blocked"  
          component={Blocked} 
          options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
            name="Inbox"  
            component={Inbox} 
            options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
            name="Message"   
            component={Messagespage} 
            options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
            name="Profileimage"  
            component={FullScreenImagePage} 
            options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
            name="Userfollowers"  
            component={Userfollowers} 
            options={{ headerTitleAlign: 'center', headerShown: false }}        />
        <Stack.Screen 
            name="Userprofile"  
            component={Userprofile} 
            options={{ headerTitleAlign: 'center', headerShown: false }}        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"blue",
  },
});