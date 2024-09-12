import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Tab')}>
        <Text style={styles.loginText}>login to mainpage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Signin')}>
        <Text style={styles.loginText}>go to Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5, 
    borderRadius: 5,
    width: '90%',
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Login;