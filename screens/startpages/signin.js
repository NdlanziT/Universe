import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const SignUp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up to Universe!</Text>

      {/* Google Sign-up Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or continue with Email</Text>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Enter username" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter phone number" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter Email" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry={true} placeholderTextColor="#d9d9d9" />

      {/* Create Account Button */}
      <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Tab')}>
        <Text style={styles.signupText}>Create Account</Text>
      </TouchableOpacity>

      {/* Login Option */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
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
  },
});
