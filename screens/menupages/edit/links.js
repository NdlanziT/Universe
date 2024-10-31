import { StyleSheet, Text, View, ScrollView, Animated, Modal, TouchableOpacity, TextInput,Image, Alert } from 'react-native';
import React, { useRef, useState } from 'react';

import { BackButton } from '../../icons/back';
import { ForwardIcon } from '../../icons/foward';
import { BinIcon } from '../../icons/bin';

const Links = ({navigation}) => {

    const handledeleletelink = ()=> {
        Alert.alert('delete link')
    };
    const handleaddlink = ()=> {
        navigation.navigate("Addlink")
    };

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.arrowcontainer} >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Links</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.personal_info_container}>
                <TouchableOpacity style={styles.button} onPress={handleaddlink} >
                    <Text style={styles.buttonText}>Add new link</Text>
                    <Text style={styles.buttonText}>{<ForwardIcon size={25} color="white" style={styles.iconText} />}</Text>
                </TouchableOpacity>
                <Text style={styles.detailvalue}>Manage link</Text>
                <View style={styles.link}>
                    <Text  style={styles.linktext}>whatsapp</Text>
                    <TouchableOpacity onPress={handledeleletelink} ><Text>{<BinIcon size={25} color="red" style={styles.iconText} />}</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Links;

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
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center', // Make sure the text is centered
        flex: 1, 
    },
    iconText: {
        marginRight: 12,
    },
    
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25,
    },
    detailcontainer: {
        marginTop:20,
        marginLeft:15,
        width: "92%",
        borderWidth:1,
        borderBottomColor:"white",
    },
    detaillabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detailvalue: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    personal_info_container: {
        padding: 19,
    },
    button: {
        flexDirection:"row",
        backgroundColor: '#434343',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        borderRadius: 10,
        marginBottom: 10,
    },
    link: {
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
    linktext: {
        color: '#007AFF',
        fontSize: 18,
    },
});
