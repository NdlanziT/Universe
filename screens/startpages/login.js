import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Image } from 'react-native';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in to Universe!</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
        <Text style={styles.googleText}>Log in with Google</Text>
      </TouchableOpacity>

      <View style={styles.orcontainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or log in with Email</Text>
        <View style={styles.line} />
      </View>

      <TextInput style={styles.input} placeholder="Username or Email" placeholderTextColor="#d9d9d9" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} placeholderTextColor="#d9d9d9" />

      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Tab')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Login;

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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#a6a6a6',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: 'black',
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#d9d9d9',
  },
  signupLink: {
    color: '#a6a6a6',
    fontWeight: 'bold',
    marginLeft: 5,
    alignSelf: 'center',
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
