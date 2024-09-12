import { StyleSheet, Text, View,StatusBar,TouchableOpacity } from 'react-native'
import React from 'react'

const Welcome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>welcome to</Text>
      <Text style={styles.title}>UniVerse</Text>
      <Text style={styles.subtitle}>Your Campus Hub</Text>
      <View style={styles.cloudContainer}>
        <View style={styles.cloud1} />
        <View style={styles.cloud2} />
        <View style={styles.cloud3} />
        <View style={styles.cloud4} />
      </View>
      <View style={styles.buttoncontent}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signin')}>
            <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.loginbtn}>
            <Text style={styles.loginbuttonDes}>Already have an account</Text>
            <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginbuttonText}>LogIn</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'start',
        justifyContent: 'start',
        paddingTop: 50,
        width: '100%',
        backgroundColor:"black",
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        letterSpacing: 2,
        paddingHorizontal: 20,
        marginBottom: 5,
        color:"white",
        fontWeight: 'bold',
        fontSize: 35,
    },
    subtitle: {
        letterSpacing: 2,
        paddingHorizontal: 20,
        marginTop: 12,
        color:"white",
        fontSize: 25,
        textAlign :'center',
        fontWeight:"200"
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center', // Center the text horizontally
        width: "80%",
      },
      buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
      },
      buttoncontent: {
        position: 'absolute',
        top: 600,
        left: 10,
        width: 300,
        width:"100%",
        flex: 1,
        alignItems:"center",
      },
      loginbtn: {
        flex: 1,
        flexDirection:"row",
        marginTop:12
      },
      loginbuttonText: {
        color: '#a6a6a6',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 2,
      },
      loginbuttonDes: {
        color: '#d9d9d9',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 2,
      },
    cloudContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 50,
      },
      cloud1: {
        backgroundColor: '#d9d9d9',
        borderRadius: 60,
        width: 212,
        height: 95,
        position: 'absolute',
        top: 5,
        left: -150,
      },
      cloud2: {
        backgroundColor: '#d9d9d9',
        borderRadius: 60,
        width: 342,
        height: 129,
        position: 'absolute',
        top: 50,
        left: -190,
      },
      cloud3: {
        backgroundColor: '#d9d9d9',
        borderRadius: 60,
        width: 342,
        height: 129,
        position: 'absolute',
        top: 180,
        right: -190,
      },
      cloud4: {
        backgroundColor: '#d9d9d9',
        borderRadius: 60,
        width: 212,
        height: 95,
        position: 'absolute',
        top: 140,
        right: -150,
      },
})