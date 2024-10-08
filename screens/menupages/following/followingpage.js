import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Followingpage = ({navigation}) => {
    const [search, setSearch] = useState("");
    const [activePage, setActivePage] = useState('followers'); 

    const backbutton = ()=>{
        navigation.goBack()
    }
    const removefollowers = ()=>{
        Alert.alert("remove followers button");
    }
    const unfollows = ()=>{
        Alert.alert("unfollows people you follow button");
    }


    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity onPress={backbutton}>
                        <Icon name="arrow-left" size={25} color="white" style={styles.iconText} />
                    </TouchableOpacity >
                    <Text style={styles.text}>Username</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.group2}>
                    <TouchableOpacity 
                        style={[
                            styles.buttonFollow, 
                            activePage === 'followers' && styles.activeButton
                        ]} 
                        onPress={() => setActivePage('followers')}
                    >
                        <Text style={styles.buttonText}>Followers (3)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.buttonFollow, 
                            activePage === 'following' && styles.activeButton
                        ]}
                        onPress={() => setActivePage('following')}
                    >
                        <Text style={styles.buttonText}>Following (3)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.buttonFollow, 
                            activePage === 'subscription' && styles.activeButton
                        ]}
                        onPress={() => setActivePage('subscription')}
                    >
                        <Text style={styles.buttonText}>Subscription (0)</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollcontainer}>
                {activePage === 'followers' && (
                    <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search followers"
                            placeholderTextColor="#888"
                            value={search}
                            onChangeText={setSearch}
                        />
                        <Text style={styles.textfollowers}>All Followers</Text>
                        <View style={styles.group3}>
                            <Image
                                source={require('./download.jpg')} 
                                style={styles.profilepic}
                            />
                            <View>
                                <Text style={styles.buttonText}>Username</Text>
                                <Text style={styles.follow}>Follow</Text>
                            </View>
                            <TouchableOpacity style={styles.remove} onPress={removefollowers}>
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                {activePage === 'following' && (
                    <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search following"
                            placeholderTextColor="#888"
                            value={search}
                            onChangeText={setSearch}
                        />
                        <Text style={styles.textfollowers}>All Following</Text>
                        <View style={styles.group3}>
                            <Image
                                source={require('./download.jpg')} 
                                style={styles.profilepic}
                            />
                            <View>
                                <Text style={styles.buttonText}>Username</Text>
                                <Text style={styles.follow}>Email</Text>
                            </View>
                            <TouchableOpacity style={styles.remove} onPress={unfollows}>
                                <Text style={styles.buttonText}>Unfollow</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                {activePage === 'subscription' && (
                    <Text style={styles.noSubscriptionText}>You have no active subscriptions</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default Followingpage;

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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    group2: {
        flexDirection: 'row',
        marginTop: -5,
        padding: 19,
    },
    group3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 104,
    },
    buttonFollow: {
        flex: 1,
        backgroundColor: '#434343',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    activeButton: {
        backgroundColor: '#007AFF', 
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    iconText: {
        marginRight: 15,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
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
        color: '#0095F6',
    },
    noSubscriptionText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
        fontWeight: 'bold', // Size for
    },
});
