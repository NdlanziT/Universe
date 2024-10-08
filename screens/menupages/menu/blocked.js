import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Blocked = ({navigation}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    const [search, setSearch] = useState("");
    
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Blocked people</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollcontainer}>
            <>
                        <Text style={styles.text}>Here are list of users you blocked</Text>
                        <Text style={styles.smalltext}>users blocked can no longer mention  you, their  post may not show up in their home feed, on your profile and at search pages</Text>
                        <View style={styles.group3}>
                            <Image
                                source={require('./download.jpg')} 
                                style={styles.profilepic}
                            />
                            <View>
                                <Text style={styles.buttonText}>Username</Text>
                                <Text style={styles.follow}>categorie</Text>
                            </View>
                            <TouchableOpacity style={styles.remove}>
                                <Text style={styles.buttonText}>Unblock</Text>
                            </TouchableOpacity>
                        </View>
                    </>
            </ScrollView>
        </View>
    );
};

export default Blocked;

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
    smalltext:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10,
        marginTop: 10,
    },
    group3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 104,
    },
    textfollowers:{
        marginTop:20,
        color: '#fff',
        fontWeight: '600',
        fontSize: 28,
    },
    scrollcontainer: {
        padding: 15,
    },
    searchInput: {
        height: 60,
        backgroundColor: '#2c2c2c', // Dark background similar to Instagram
        color: 'white',
        borderRadius: 10,
        width: "99%",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    profilepic: { 
        height: 80,
        width: 80,
        borderRadius: 50, // Half of the height/width to make it round
        overflow: 'hidden', 
    },
    remove: {
        backgroundColor: "#434343",
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 60,
    },
    follow: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "600", // Size for links
        color: '#434343',
    },
    
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    
});
