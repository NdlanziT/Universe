import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert,Animated } from 'react-native';
import React, { useEffect, useState,useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { db,storage } from '../../../firebase';
import {collection, query, where, limit, getDocs,doc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";

import { BackButton } from '../../icons/back';

const Discover = ({navigation,route}) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [search, setSearch] = useState("");
    const [loading,setLoading] = useState(true)
    const [users,setUsers] = useState([])

    const {setFollowing,following,email} = route.params

    const gotoprofile = (username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail)=>{
        navigation.navigate('Userprofile', {username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail});
    }

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

    const handleFollow = async (userEmail, myEmail) => {
        await addValueToArray(userEmail, "followers", myEmail);
        await addValueToArray(myEmail, "following", userEmail);
        
        setFollowing(prevFollowing => [...prevFollowing, userEmail]);
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: false } : user
            )
        );
    };
    const handleUnfollow = async (userEmail,myEmail) =>{
        await removeValueFromArray(userEmail, "followers", myEmail);
        await removeValueFromArray(myEmail, "following", userEmail);
        
        setFollowing(prevFollowing => prevFollowing.filter(email => email !== userEmail));
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: true } : user
            )
        );
    };


    const discover = async (followers, myEmail) => {
        setLoading(true); // Set loading to true while fetching users
        const usersCollection = collection(db, 'users'); // Reference to 'users' collection
    
        // Combine followers and the current user's email to exclude them
        const excludeList = [...followers, myEmail];
    
        // Check if excludeList is under 10 elements (due to Firestore's 'not-in' limit)
        if (excludeList.length > 10) {
            console.error("Cannot use 'not-in' query with more than 10 elements.");
            setLoading(false);
            return;
        }
    
        // Query to fetch users excluding those in the exclude list, limited to 10
        const usersQuery = query(usersCollection, where("email", "not-in", excludeList), limit(10));
    
        try {
            const querySnapshot = await getDocs(usersQuery); // Execute the query
            const profilePicturePromises = querySnapshot.docs.map(async (doc) => {
                const userData = { id: doc.id, ...doc.data() }; // Get user data
    
                // Fetch the profile picture URL for the user
                userData.profilepic = await fetchProfilePictureURL(userData.profilepicture); 
                userData.followstate = true; //
                return userData;
            });
    
            // Wait for all profile picture fetches to complete and filter out null values
            const usersWithPictures = (await Promise.all(profilePicturePromises)).filter(user => user !== null);
            setUsers(usersWithPictures); // Set the state with users and their profile pictures
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };
    
    const fetchProfilePictureURL = async (fileName) => {
        try {
          if (fileName == null){
            const storageRef = ref(storage, `profilepictures/download.png`);
            const url = await getDownloadURL(storageRef);
            return url;
          }else{
            const storageRef = ref(storage, `profilepictures/${fileName}`);
            const url = await getDownloadURL(storageRef);
            return url;
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
          return null;
        }
      };

      useEffect(() => {
        if (loading) {
          const fadeIn = Animated.timing(fadeAnim, {
            toValue: 0.5, // Fade to 50% opacity
            duration: 1000,
            useNativeDriver: true,
          });
    
          const fadeOut = Animated.timing(fadeAnim, {
            toValue: 1, // Fade back to full opacity
            duration: 1000,
            useNativeDriver: true,
          });
    
          Animated.loop(
            Animated.sequence([
              Animated.parallel([fadeIn]),
              Animated.parallel([fadeOut]),
            ])
          ).start();
        } else {
          // Stop animation when loading is false
          fadeAnim.setValue(1);
        }

        discover(following,email);
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.iconText} >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Discover people</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollcontainer}>
            <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search followers"
                            placeholderTextColor="#888"
                            value={search}
                            onChangeText={setSearch}
                        />
                        {loading ?(
                            <Animated.View style={{ ...styles.loadingContainer, opacity: fadeAnim }}>
                            <View style={styles.usernamePlaceholder}>
                                <View style={styles.profilePicPlaceholder} />
                                <View style={styles.usernameElement}>
                                <View style={styles.user} />
                                <View style={styles.timeholder} />
                                </View>
                            </View>
                            <View style={styles.usernamePlaceholder}>
                                <View style={styles.profilePicPlaceholder} />
                                <View style={styles.usernameElement}>
                                <View style={styles.user} />
                                <View style={styles.timeholder} />
                                </View>
                            </View>
                            <View style={styles.usernamePlaceholder}>
                                <View style={styles.profilePicPlaceholder} />
                                <View style={styles.usernameElement}>
                                <View style={styles.user} />
                                <View style={styles.timeholder} />
                                </View>
                            </View>
                            </Animated.View>
                        ):(
                            users.map((user, index) =>(
                            <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,following,email)}}>
                                <Image
                                    source={{uri : user.profilepic}} 
                                    style={styles.profilepic}
                                />
                                <View>
                                    <Text style={styles.buttonText}>{user.username}</Text>
                                    <Text style={styles.follow}>{user.name}</Text>
                                </View>
                                {user.followstate ? (
                                <TouchableOpacity style={styles.remove} onPress={() => {handleFollow(user.id,email)}}>
                                    <Text style={styles.buttonText}>Follow</Text>
                                </TouchableOpacity>

                                ):(                                
                                    <TouchableOpacity style={styles.remove2} onPress={() => {handleUnfollow(user.id,email)}}>
                                        <Text style={styles.buttonText}>Unfollow</Text>
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
    
                            ))

                        )}
                    </>
            </ScrollView>
        </View>
    );
};

export default Discover;

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
        backgroundColor: "#007AFF",
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 60,
    },
    remove2: {
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
    loading:{
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        marginTop: 24,
        alignItems: 'center',
      },
      usernamePlaceholder: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      profilePicPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,  // Circular profile picture
        backgroundColor: '#ccc',  // Light gray
        marginBottom: 10,
        marginLeft: 20,
      },
      user: {
        width: '60%', // Make it responsive
        height: 15,
        borderRadius: 25,
        backgroundColor: '#ccc',  // Light gray
        marginBottom: 5,
      },
      timeholder: {
        width: '60%', // Make it responsive
        height: 15,
        borderRadius: 25,
        backgroundColor: '#ccc',  // Light gray
        marginBottom: 5,
      },
      usernameElement: {
        width: '100%',
        marginLeft: 20,
      },
    
});
