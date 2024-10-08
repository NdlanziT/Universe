import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const About = ({navigation}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>About</Text>
                </View>
            </View>
            <Text style={styles.subHeading}>put an about page </Text>
            
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    group1: {
        marginTop: 30,
        height: 60,
        paddingHorizontal: 20,
        justifyContent: 'center', 
        marginBottom: 10,
    },
    iconText: {
        marginRight: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center', // Make sure the text is centered
        flex: 1, 
    },
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    subHeading: {
        color: 'white',
        fontSize: 14,
        marginLeft: 20,

      },
    
});
