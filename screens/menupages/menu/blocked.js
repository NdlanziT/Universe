import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert,ActivityIndicator } from 'react-native';
import React, { useState,useRef, useEffect } from 'react';
import { db,storage } from '../../../firebase';
import {  collection, query, where, getDocs,doc,arrayRemove,arrayUnion,updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";

import { BackButton } from '../../icons/back';

const Blocked = ({navigation,route}) => {
    const [loading,setLoading] = useState(true)
    const {blockeduser,setblockeduser,email} = route.params
    const [blocked,setBlocked] = useState(blockeduser)
    const [users,setUsers] = useState([])

    const fetchblocked = async (emailsArray) => {
        setLoading(true); // Set loading to true while fetching users
    
        // Check if emailsArray is empty
        if (!emailsArray || emailsArray.length === 0) {
            console.warn('Emails array is empty. No users to fetch.');
            setLoading(false);
            return []; // Return an empty array if no emails are provided
        }
    
        const usersCollection = collection(db, 'users'); // Reference to 'users' collection
    
        // Query to fetch users whose 'email' field is in the array of emails
        const usersQuery = query(usersCollection, where('email', 'in', emailsArray));
    
        try {
            const querySnapshot = await getDocs(usersQuery); // Execute the query
            const profilePicturePromises = querySnapshot.docs.map(async (doc) => {
                const userData = { id: doc.id, ...doc.data() }; // Get user data
                userData.profilepic = await fetchProfilePictureURL(userData.profilepicture); // Fetch the profile picture URL
                userData.blockestate = true
                return userData; // Return user data with profile picture
            });
    
            // Wait for all profile picture fetches to complete
            const usersWithPictures = await Promise.all(profilePicturePromises);
    
            setUsers(usersWithPictures); // Return the array of users
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };
    const fetchProfilePictureURL = async (fileName) => {
        try {
            const storageRef = ref(storage, fileName ? `profilepictures/${fileName}` : 'profilepictures/download.png');
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error('Error fetching profile picture:', error);
            return null;
        }
    };

    const removeValueFromArray = async (docId, field, valueToRemove) => {
        try {
            // Get a reference to the document
            const docRef = doc(db, 'users', docId); // Assuming the document is in the 'users' collection
    
            // Update the document by removing the specific value from the array field
            await updateDoc(docRef, {
                [field]: arrayRemove(valueToRemove) // Remove the specific value from the array
            });
    
            console.log(`Successfully removed ${valueToRemove} from the array`);
        } catch (error) {
            console.error("Error removing value from array:", error);
        }
    };
    const addValueToArray = async (docId, field, valueToAdd) => {
        try {
            // Get a reference to the document
            const docRef = doc(db, 'users', docId); // Assuming the document is in the 'users' collection
    
            // Update the document by adding the specific value to the array field
            await updateDoc(docRef, {
                [field]: arrayUnion(valueToAdd)
            });
            console.log(`Successfully added ${valueToAdd} to the array`);
        } catch (error) {
            console.error("Error adding value to array:", error);
        }
    };

    const handleblock = async (userEmail, myEmail) => {
        await addValueToArray(myEmail, "blocked", userEmail);
        
        setblockeduser(prevFollowing => [...prevFollowing, userEmail]);
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, blockestate: true } : user
            )
        );
    };
    const handleremove = async (userEmail,myEmail) =>{
        await removeValueFromArray(myEmail, "blocked", userEmail);
        
        setblockeduser(prevFollowing => prevFollowing.filter(email => email !== userEmail));
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, blockestate: false } : user
            )
        );
    };

    useEffect(() => {
        fetchblocked(blocked); // Fetch blocked users
    }, []);

    
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.iconText} >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Blocked people</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollcontainer}>
            <>
                        <Text style={styles.text}>Here are list of users you blocked</Text>
                        <Text style={styles.smalltext}>users blocked can no longer mention  you, their  post may not show up in their home feed, on your profile and at search pages</Text>
            {loading ? (
                <View>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ):(
            users.map((user,index)=>(
                <View key={index} style={styles.group3}>
                    <Image
                        source={{uri : user.profilepic}} 
                        style={styles.profilepic}
                    />
                    <View>
                        <Text style={styles.buttonText}>{user.username}</Text>
                        <Text style={styles.follow}>{user.name}</Text>
                    </View>
                    {user.blockestate ? (   
                                    <TouchableOpacity style={styles.remove} onPress={() => handleremove(user.id, email)}>
                                        <Text style={styles.buttonText}>Unblock</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.remove2} onPress={() => handleblock(user.id, email)}>
                                        <Text style={styles.buttonText}>Block</Text>
                                    </TouchableOpacity>
                     )}
            </View>

))

            )}

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
        marginRight: 10,
        marginLeft:-10,
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
    remove2: {
        backgroundColor: "#007AFF",
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
