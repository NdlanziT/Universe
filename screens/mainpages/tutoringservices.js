import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Tutoringservices = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tutoring Services</Text>
    </View>
  )
}

export default Tutoringservices

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
})