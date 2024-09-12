import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Profilemenu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>this is Profile menu place</Text>
    </View>
  )
}

export default Profilemenu

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