import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';

import { BackButton } from '../../icons/back';
import { ForwardIcon } from '../../icons/foward';

const Menu = ({navigation,route}) => {

    const {email,following,blocked,accountprivacy,theme,phone,setPhone,setFollowing,setTheme} = route.params;
    const [blockeduser, setblockeduser] = useState(blocked);


    const handleAlert = (method) => {
        const userResponse = window.confirm("Do you want to execute the random function?");
        if (userResponse) {
            method;
        } 
      };
    const followershandle = ()=>{
        Alert.alert("youu clicked followers button");
    }
    const handlesaved = ()=>{
        navigation.navigate("Saved");
    }
    const handlefavourite = ()=>{
        navigation.navigate("Favourites");
    }
    const handlediscover = ()=>{
        navigation.navigate("Discover",{setFollowing,following,email});
    }
    const handleinsight = ()=>{
        navigation.navigate("Dashboard");
    }
    const handlenotification = ()=>{
        navigation.navigate("Notificationsettings");
    }
    const handleaccountprivacy = ()=>{
        navigation.navigate("Accountprivacy",{accountprivacy,email});
    }
    const handletheme = ()=>{
        navigation.navigate("Theme",{theme,setTheme,email});
    }
    const handleabout = ()=>{
        navigation.navigate("About");
    }
    const handleblocked = ()=>{
        navigation.navigate("Blocked",{blockeduser, setblockeduser,email});
    }
    const handlemanageaccount = ()=>{
        navigation.navigate("Manageaccount",{phone,setPhone});
    }
    const handlegotosupportinbox = ()=>{
        navigation.navigate("");
    }
    const handlegotologinpage = ()=>{
        navigation.navigate("Login");
    }
    const handlegotosignuppage = ()=>{
        navigation.navigate("Signin");
    }
    const handlegotowelcome = ()=>{
        navigation.navigate("Welcome");
    }
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Menu</Text>
                </View>
            </View>
            <View style={styles.buttoncontainer}>
                <TouchableOpacity style={styles.buttonFollow} onPress={handlesaved}>
                    <Text style={styles.buttonText}>Saved</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonFollow} onPress={handlefavourite}>
                    <Text style={styles.buttonText}>Favourites</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttoncontainer} >
                <TouchableOpacity style={styles.buttonFollow} onPress={handleinsight} >
                    <Text style={styles.buttonText}>Insight</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonFollow} onPress={handlediscover}>
                    <Text style={styles.buttonText}>Discover</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.group2}>
                    <View style={styles.details}>
                        <Text style={styles.text}>Settings and Privacy</Text>
                    </View>
            </View>
            <TouchableOpacity style={styles.group3} onPress={handleblocked}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Blocked</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>({blocked.length}) {<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={handlenotification}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>notification</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={handleaccountprivacy}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Accounts privacy</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={followershandle}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Orders and Payments</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={handletheme}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Theme</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={handlemanageaccount}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Manage account</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <View style={styles.group2}>
                    <View style={styles.details}>
                        <Text style={styles.text}>More info and support</Text>
                    </View>
            </View>
            <TouchableOpacity style={styles.group3} onPress={handleabout}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>About</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.group3} onPress={followershandle}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Support inbox</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>{<ForwardIcon size={20} color="white" style={styles.iconText} />}</Text>
                        
                    </View>
            </TouchableOpacity>
            <View style={styles.group4}>
                <TouchableOpacity style={styles.group5} onPress={handlegotowelcome}>
                    <Text style={styles.linkText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.group5} onPress={handlegotologinpage}>
                    <Text style={styles.linkText}>Login to existing account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.group5} onPress={handlegotosignuppage}>
                    <Text style={styles.linkText}>create new account</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Menu;

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
