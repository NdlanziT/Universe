import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Favourites = ({navigation}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.arrowcontainer} >
                        <Icon name="arrow-left" size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Favourites</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Favourites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"black"
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
    
});
