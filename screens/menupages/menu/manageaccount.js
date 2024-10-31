import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../../firebase';

import { updateEmail } from "firebase/auth";

import { BackButton } from '../../icons/back';
import { ForwardIcon } from '../../icons/foward';

const Manageaccount = ({navigation,route}) => {
    const {phone,setPhone} = route.params
    const changeemail = ()=>{
        navigation.navigate("Changeemail",{auth})
    }
    const changephone = ()=>{
        navigation.navigate("Changephone",{auth,phone,setPhone})
    }
    const changepassword = ()=>{
        navigation.navigate("Changepassword",{auth})
    }
    
    const verified = ()=>{
        Alert.alert("is yet to be developed");
    }

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Manage account</Text>
                </View>
            </View>
            <View style={styles.buttoncontainer}>

                <TouchableOpacity style={styles.buttonFollow} onPress={verified}>
                    <Text style={styles.buttonText}>Show your profile is verified</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.group2}>
                    <View style={styles.details}>
                        <Text style={styles.text}>Personal details</Text>
                    </View>
            </View>
            <TouchableOpacity style={styles.group3} onPress={changeemail}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Change email</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={changephone}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Change phone</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <View style={styles.group2}>
                    <View style={styles.details}>
                        <Text style={styles.text}>Secuirity</Text>
                    </View>
            </View>
            <TouchableOpacity style={styles.group3} onPress={changepassword}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Change password</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>

        </View>
    );
};

export default Manageaccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    group1: {
        marginTop: 30,
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',  // Center the text horizontally
        alignItems: 'center',
        marginBottom: 10,
    },
    group2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        marginBottom: 15,
    },
    group3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
    },
    group4: {
        height: 60,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'white',
        alignContent: 'center',
    },
    group5: {
        flexDirection:"row",
        marginTop: 10,
    },
    iconText: {
        marginRight: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Make sure the text is centered
        flex: 1, 
    },
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    details: {
        marginLeft: 15,
    },
    stats: {
        marginRight: 10,
    },
    statsText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'thin',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: 'thin',
    },
    statsnumber: {
        marginTop: -3,
        marginRight: 15,
    },
    toolsheadings: {
        marginTop:20,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    verify: {
        backgroundColor:"blue",
        borderRadius: 50,
        width: 25,
        height: 25,
        justifyContent:"center",
    },
    arrowcontainer: {
        position: 'absolute',
        left: 0,  // Top-left corner
    },
    buttonFollow: {
      flex: 1,
      backgroundColor: '#434343',
      borderRadius: 10, // Rounded corners
      alignItems: 'center', // Center the text
      justifyContent: 'center', // Center the text vertically
      height: 50,
      marginLeft:3,
    },
    buttonText: {
      color: '#fff', // White text for the follow button
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttoncontainer: {
        flexDirection: 'row', // Add space between buttons
        padding:9,
        marginTop: -10,
    },
});
