import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Marketplace = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>marketing place</Text>
    </View>
  )
}

export default Marketplace

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