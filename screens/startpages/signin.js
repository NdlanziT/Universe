import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Image } from 'react-native';

const SignUp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up to Universe!</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
        <Text style={styles.googleText}>Log in with Google</Text>
      </TouchableOpacity>

      <View style={styles.orcontainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or sign up with email</Text>
        <View style={styles.line} />
      </View>

      <TextInput style={styles.input} placeholder="Enter username" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter phone number" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter Email" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry={true} placeholderTextColor="#d9d9d9" />

      <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Tab')}>
        <Text style={styles.signupText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  googleButton: {
    flexDirection: 'row',
    justifyContent : 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  googleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  googleIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginEnd: 10,
  },
  orText: {
    color: '#d9d9d9',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#d9d9d9',
  },
  loginLink: {
    color: '#a6a6a6',
    fontWeight: 'bold',
    marginLeft: 5,
    alignSelf:"center"
  },
  orcontainer: {
    flexDirection: 'row',   // Arrange items in a row
    alignItems: 'center',   // Align items vertically in the center
    marginVertical: 20,
    marginBottom:50     // Add some vertical margin for spacing
  },
  line: {
    flex: 1,                // Take up available space
    height: 2,              // Set line height to make it thin
    backgroundColor: 'white', // Line color (black)
    marginHorizontal: 10,    // Space between the line and the text
  },
  orText: {
    fontSize: 14,
    color: 'white',          // Text color
  },
});
