import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert ,Animated} from 'react-native';
import React, { useEffect, useState,useRef, } from 'react';
import {  collection, query, where, getDocs,doc,updateDoc,arrayRemove,arrayUnion } from 'firebase/firestore';
import { db,storage } from '../../../firebase';
import { ref, getDownloadURL } from "firebase/storage";

import { BackButton } from '../../icons/back';

const Followingpage = ({navigation,route}) => {
    const [search, setSearch] = useState("");
    const {followers,following,username,ActivePage,setFollowers,setFollowing,email} = route.params;
    const [usersfollowers,setUsersfollowers] = useState([])
    const [usersFollowing, setUsersFollowing] = useState([])
    const [loading, setLoading] = useState(true)
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [activePage, setActivePage] = useState(ActivePage)

    const backbutton = ()=>{
        navigation.goBack()
    }

    const gotoprofile = (username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail)=>{
        navigation.navigate("Userprofile",{username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail})
    }


    const removeValueFromArray = async (docId, field, valueToRemove) => {
        try {
            // Get a reference to the document
            const docRef = doc(db, 'users', docId); // Assuming the document is in the 'users' collection
    
            // Update the document by removing the specific value from the array field
            await updateDoc(docRef, {
                [field]: arrayRemove(valueToRemove) // Remove the specific vale from the array
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
        
        setUsersFollowing(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: true } : user
            )
        );
    };
    const handleUnfollow = async (userEmail,myEmail) =>{
        await removeValueFromArray(userEmail, "followers", myEmail);
        await removeValueFromArray(myEmail, "following", userEmail);

        setFollowing(prevFollowing => prevFollowing.filter(email => email !== userEmail));
        
        
        setUsersFollowing(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: false } : user
            )
        );
    };
    const handleremove = async (userEmail, myEmail) => {
        await addValueToArray(userEmail, "following", myEmail);
        await addValueToArray(myEmail, "followers", userEmail);

        setFollowers(prevFollowing => prevFollowing.filter(email => email !== userEmail));
        
        
        setUsersfollowers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: false } : user
            )
        );
    };
    const handleadd = async (userEmail,myEmail) =>{
        await removeValueFromArray(userEmail, "following", myEmail);
        await removeValueFromArray(myEmail, "followers", userEmail);
        
        setFollowers(prevFollowing => [...prevFollowing, userEmail]);
        setUsersfollowers(prevUsers =>
            prevUsers.map(user =>
                user.id === userEmail ? { ...user, followstate: true } : user
            )
        );
    };

    const fetchfollowers = async (emailsArray) => {
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
                userData.profilepic = await fetchProfilePictureURL(userData.profilepicture);
                userData.followstate = true
                return userData; // Return user data with profile picture
            });
    
            // Wait for all profile picture fetches to complete
            const usersWithPictures = await Promise.all(profilePicturePromises);
    
            setUsersfollowers(usersWithPictures); // Return the array of users
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };
      const fetchfollowings = async (emailsArray) => {
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
                userData.followstate = true
                return userData; // Return user data with profile picture
            });
    
            // Wait for all profile picture fetches to complete
            const usersWithPictures = await Promise.all(profilePicturePromises);
    
            setUsersFollowing(usersWithPictures); // Return the array of users
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };
    
    // Function to fetch the profile picture URL
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
    
      useEffect(() => {
        if (loading) {
          // Animation runs when loading is true
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

        fetchfollowers(followers);
        fetchfollowings(following);
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={backbutton}>             
                    <View style={styles.iconText} >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View >
                    <Text style={styles.text}>{username}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.group2}>
                    <TouchableOpacity 
                        style={[styles.buttonFollow, activePage === 'followers' && styles.activeButton]} 
                        onPress={() => setActivePage('followers')}
                    >
                        <Text style={styles.buttonText}>Followers ({followers.length})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.buttonFollow, 
                            activePage === 'following' && styles.activeButton
                        ]}
                        onPress={() => setActivePage('following')}
                    >
                        <Text style={styles.buttonText}>Following ({following.length})</Text>
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
         {loading ? (
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
            ) : (<ScrollView style={styles.scrollcontainer}>
                {activePage === 'followers' && (
                    <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search followers"
                            placeholderTextColor="#888"
                            value={search}
                            onChangeText={setSearch}
                        />
                        {usersfollowers.map((user, index) => (
                        <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,following,email)}}>
                            <Image
                                source={{uri : user.profilepic}} 
                                style={styles.profilepic}
                            />
                            <View>
                                <Text style={styles.buttonText}>{user.username}</Text>
                                <Text style={styles.follow}>Follow</Text>
                            </View>
                            {user.followstate ? (
                            <TouchableOpacity style={styles.remove} onPress={()=>{handleremove(user.id,email)}}>
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>):(
                            <TouchableOpacity style={styles.remove2} onPress={()=>{handleadd(user.id,email)}}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>)}
                        </TouchableOpacity>

                        ))}
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
                        {usersFollowing.map((user, index) => (
                            <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,following,email)}} >
                                <Image
                                    source={{uri : user.profilepic}} 
                                    style={styles.profilepic}
                                />
                                <View>
                                    <Text style={styles.buttonText}>{user.username}</Text>
                                    <Text style={styles.follow}>{user.name}</Text>
                                </View>
                                {user.followstate ?(
                                <TouchableOpacity style={styles.remove} onPress={()=>{handleUnfollow(user.id,email)}}>
                                    <Text style={styles.buttonText}>Unfollow</Text>
                                </TouchableOpacity>):(
                                <TouchableOpacity style={styles.remove2} onPress={()=>{handleFollow(user.id,email)}}>
                                    <Text style={styles.buttonText}>Follow</Text>
                                </TouchableOpacity>)}
                            </TouchableOpacity>

                        ))}
                    </>
                )}
                {activePage === 'subscription' && (
                    <Text style={styles.noSubscriptionText}>You have no active subscriptions</Text>
                )}
            </ScrollView> )}
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
        marginRight: 10,
        marginLeft:-10,
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
        marginRight: 10,
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
        color: '#0095F6',
    },
    noSubscriptionText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
        fontWeight: 'bold', // Size for
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
