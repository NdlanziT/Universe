import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { db,storage } from '../../firebase';
import {collection, query, where, limit, getDocs,doc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";


import { BackButton } from '../icons/back';

const Userfollowers = ({navigation,route}) => {
    const [search, setSearch] = useState("");
    const [activePage, setActivePage] = useState('followers'); 
    const [loading,setLoading] = useState(true)
    const [usersfollowers,setUsersfollowers] = useState([])
    const [userfollowing,setUsersFollowing] = useState([])
    const [mutual,setMutual] = useState([])

    const backbutton = ()=>{navigation.goBack()}

    const {username,email,followers,following,myfollowing,myemail} = route.params

    const commonEmails = myfollowing.filter(email => following.includes(email) || followers.includes(email));

    const gotoprofile = (username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail)=>{
        navigation.navigate("Userprofile",{username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail})
    }
    
    const removefollowers = ()=>{
        Alert.alert("remove followers button");
    }
    const unfollows = ()=>{
        Alert.alert("unfollows people you follow button");
    }

    const fetchmutual = async (emailsArray) => {
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
    
            setMutual(usersWithPictures); // Return the array of users
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };

    const fetchfollowers = async (emailsArray,myfollowing) => {
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
                if (myfollowing.includes(userData.email)) {
                    userData.followingstate = true; // Email is in myfollowers
                } else {
                    userData.followingstate = false; // Email is not in myfollowers
                }
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
      const fetchfollowings = async (emailsArray,myfollowing) => {
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
                if (myfollowing.includes(userData.email)) {
                    userData.followingstate = true; // Email is in myfollowers
                } else {
                    userData.followingstate = false; // Email is not in myfollowers
                }
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
        const fetchData = async () => {
            await fetchfollowers(followers, myfollowing);
            await fetchfollowings(following, myfollowing);
            await fetchmutual(commonEmails);
        };

        fetchData(); // Call the async function

    }, []);
    


    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={backbutton}> 
                    <Text ><BackButton size={30} color="white" /></Text>  
                    <Text style={styles.text}>{username}</Text>
                </TouchableOpacity>
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
                            activePage === 'mutual' && styles.activeButton
                        ]}
                        onPress={() => setActivePage('mutual')}
                    >
                        <Text style={styles.buttonText}>mutual ({commonEmails.length})</Text>
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
                        {loading ?(
                            <View>
                                <ActivityIndicator color={"white"} size={'large'}/>
                            </View>
                        ):(
                            usersfollowers.map((user,index) => (
                            <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,myfollowing,myemail)}}>
                                <Image
                                    source={{uri: user.profilepic}} 
                                    style={styles.profilepic}
                                />
                                <View>
                                    <Text style={styles.buttonText}>{user.username}</Text>
                                    <Text style={styles.follow}>{user.name}</Text>
                                </View>
                                {user.email !== myemail?(
                                    <TouchableOpacity 
                                    style={user.followingstate ? styles.unfollowbtn : styles.followbtn}  // Conditionally apply styles
                                    onPress={user.followingstate ? unfollows : unfollows} 
                                    >
                                        <Text style={styles.buttonText}>
                                            {user.followingstate ? 'Unfollow' : 'Follow'}
                                        </Text>
                                    </TouchableOpacity>
                                    ):(
                                    <View style={styles.followbtnme} >
                                    <Text style={styles.buttonText}></Text>
                                </View>
                            )}
                            </TouchableOpacity>
                            ))
                            
                        )}
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
                        {loading ?(
                            <View>
                                <ActivityIndicator size={'large'} color={"white"}/>
                            </View>
                        ):(
                            userfollowing.map((user,index)=>(
                                <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,myfollowing,myemail)}}>
                                    <Image
                                        source={{uri: user.profilepic}} 
                                        style={styles.profilepic}
                                    />
                                    <View>
                                        <Text style={styles.buttonText}>{user.username}</Text>
                                        <Text style={styles.follow}>{user.name}</Text>
                                    </View>
                                    {user.email !== myemail?(
                                    <TouchableOpacity 
                                    style={user.followingstate ? styles.unfollowbtn : styles.followbtn}  // Conditionally apply styles
                                    onPress={user.followingstate ? unfollows : unfollows} 
                                    >
                                        <Text style={styles.buttonText}>
                                            {user.followingstate ? 'Unfollow' : 'Follow'}
                                        </Text>
                                    </TouchableOpacity>
                                    ):(
                                    <View style={styles.followbtnme} onPress={unfollows}>
                                        <Text style={styles.buttonText}></Text>
                                    </View>)}
                                </TouchableOpacity>
                            ))
                        )}
                    </>
                )}
                {activePage === 'mutual' && (
                                        <>
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Search following"
                                            placeholderTextColor="#888"
                                            value={search}
                                            onChangeText={setSearch}
                                        />
                                        <Text style={styles.textfollowers}>All mutual Followings</Text>
                                        {loading ?(
                                             <View>
                                                 <ActivityIndicator size={'large'} color={"white"}/>
                                             </View>
                                        ):(
                                            mutual.map((user, index) =>(
                                            <TouchableOpacity key={index} style={styles.group3} onPress={()=>{gotoprofile(user.username,user.profilepic,user.name,user.email,user.bio,user.post,user.followers,user.following,myfollowing,myemail)}}>
                                                <Image
                                                    source={{uri: user.profilepic}} 
                                                    style={styles.profilepic}
                                                />
                                                <View>
                                                    <Text style={styles.buttonText}>{user.username}</Text>
                                                    <Text style={styles.follow}>{user.name}</Text>
                                                </View>
                                                <TouchableOpacity style={user.followstate ? styles.remove : styles.followbtn} onPress={unfollows}>
                                                    <Text style={styles.buttonText}>{user.followstate ?  "Unfollow" : "Follow"}</Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>)
                                            )
                                        )}
                                        {/* <Text style={styles.textfollowers}>Suggest for you</Text>
                                        <View style={styles.group3}>
                                            <Image
                                                source={require('./download.jpg')} 
                                                style={styles.profilepic}
                                            />
                                            <View>
                                                <Text style={styles.buttonText}>Username</Text>
                                            </View>
                                            <TouchableOpacity style={styles.followbtn} onPress={unfollows}>
                                                <Text style={styles.buttonText}>Follow</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default Userfollowers;

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
        width: '100%' 
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
        marginLeft: 10,
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
    follow: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "600", // Size for links
        color: '#0095F6',
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
    followbtn: {
        backgroundColor: "#007AFF",
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 60,
    },
    unfollowbtn: {
        backgroundColor: "#434343",
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 60,
    },
    followbtnme: {
        backgroundColor: "black",
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
