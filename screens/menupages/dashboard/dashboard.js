import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Change to Ionicons

import { BackButton } from '../../icons/back';
import { ForwardIcon } from '../../icons/foward';
import { PostBoost } from '../../icons/postboost';
import {Verifiedicon } from '../../icons/verified';

const Dashboard = ({navigation}) => {
    const reachhandle = ()=>{
        navigation.navigate("Reach")
    }
    const engagementhandle = ()=>{
        navigation.navigate("Engagement")
    }
    const followershandle = ()=>{
        navigation.navigate("Totalfollowers")
    }
    const postboost = ()=>{
        Alert.alert("post boost is not yet available");
    }
    const verifyprofile = ()=>{
        Alert.alert("verify profile is not yet available");
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <BackButton size={35} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Dashboard</Text>
                </View>
            </View>
            <View style={styles.group2}>
                    <View style={styles.details}>
                        <Text style={styles.text}>Insight</Text>
                    </View>
                    <View style={styles.stats}>
                        <Text style={styles.statsText}>last 7 days</Text>
                        
                    </View>
            </View>
            <TouchableOpacity style={styles.group3} onPress={reachhandle}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Accounts reached</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>25 {<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={engagementhandle}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Accounts engaged</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>25 {<ForwardIcon  size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={followershandle}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Total followers</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>25 {<ForwardIcon  size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <View style={styles.group4}>
                <Text style={styles.toolsheadings}>Tools for you</Text>
            </View>
            <TouchableOpacity style={styles.group5} onPress={postboost}>
                <PostBoost size={25} color="white" style={styles.iconText} />
                <Text style={styles.statsText}>Post boost</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group5} onPress={verifyprofile}>
                <Verifiedicon size={25} color="#007AFF" style={styles.iconText} />
                <Text style={styles.statsText}>verify</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Dashboard;

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
        padding: 15,
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
        marginLeft: 10,
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
        left: -10,  // Top-left corner
    },
});
