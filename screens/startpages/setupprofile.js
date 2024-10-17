import { StyleSheet, Text, View, ActivityIndicator, Animated, Modal, TouchableOpacity, TextInput,Image, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import { db,storage } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const Setupprofile = ({ route,navigation }) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    const slideAnimEdit = useRef(new Animated.Value(0)).current;

    const { name, phone, email, user } = route.params;

    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [media, setMedia] = useState(null);
    const [imagename,setImagename] = useState("");


const input_user_info = async (email, username, bio, name, phone) => {
    setLoading(true);
    
    try {
        let imagename; // Declare imagename to use it later

        if (media) {
            // Create the image name synchronously
            imagename = `${name}${email}${phone}${user.id}`;

            const response = await fetch(media.uri); // Fetch the image from the URI
            const blob = await response.blob();  // Convert the image to a blob

            const storageRef = ref(storage, `profilepictures/${imagename}`); // Create a reference to the storage location
            await uploadBytes(storageRef, blob); // Upload the image blob
            
            // Get the URL for the uploaded image (if you need it)
            const imageUrl = await getDownloadURL(storageRef); // You can keep this for other purposes if needed
        } else {
            imagename = null; // Set imagename to null if no media is selected
        }

        const userRef = doc(db, 'users', email); // Use email as the document ID
        await setDoc(userRef, {
            email: email,
            name: name,
            username: username,
            bio: bio,
            phone: phone,
            apptheme: true,
            verify: false,
            post: [],
            following: [],
            followers: [],
            blocked: [],
            chat: [],
            favourites: [],
            saved: [],
            profilepictureURL: imagename, // Assign imagename directly
            links: {},
        });

        navigation.navigate('Tab');
    } catch (error) {
        console.error('Error updating your data in the database: ', error);
    } finally {
        setLoading(false); // Stop loading indicator
    }
};

    


    const handlesettinprofile = ()=>{
        input_user_info(email,username,bio,name,phone)
    }


    const handleSelectMedia = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this app to access your photos!");
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow both images and videos
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setMedia(result.assets[0]);
        }
        handleProfile()
        closeEditModal()

        
      };

    const removemedia = ()=> {
        setMedia(null);
        handleProfile()
        closeEditModal()
  
    };

    const handleProfile = () => {
        setLoading(true);
    
        // Simulate a delay to see the loading indicator
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };


    // Open edit modal
    const openEditModal = () => {
        settimemodalinvisible(true);
        Animated.timing(slideAnimEdit, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Close edit modal
    const closeEditModal = () => {
        Animated.timing(slideAnimEdit, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => settimemodalinvisible(false));
    };

    const slideUpStyleEdit = {
        transform: [
            {
                translateY: slideAnimEdit.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}> 
                    <Text style={styles.text}>Set up profile</Text>
                </View>
            </View>
            <View style={styles.profilecontainer}>
            <Image
                source={media && media.uri ? { uri: media.uri } : require('./download.png')}
                style={styles.profilepic}
            />
            <TouchableOpacity onPress={openEditModal}>
                <Text style={styles.profiletext}>Set new profile picture</Text>
            </TouchableOpacity>
        </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Username</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="value"
                    placeholderTextColor="#888"
                />
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Bio</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="value"
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handlesettinprofile} disabled={loading}>
                <Text style={styles.loginText}>{loading ? 'setting up profile...' : 'continue'}</Text>
            </TouchableOpacity>
            {timemodalinvisible && (
                <Modal
                    transparent={true}
                    animationType="none"
                    visible={timemodalinvisible}
                    onRequestClose={closeEditModal}
                >
                    <TouchableOpacity style={styles.modalBackground} onPress={closeEditModal}>
                    {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.indicator} />}
                        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                            <Animated.View style={[styles.modalContent, slideUpStyleEdit]}>
                                <Text style={styles.modalText}>Edit profile picture</Text>
                                <TouchableOpacity style={styles.lastButton} onPress={handleSelectMedia}>
                                    <Text style={styles.lastText}>Add a new profile picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.removeButton} onPress={removemedia}>
                                    <Text style={styles.lastText}>Remove the current picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                                    <Text style={styles.closeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default Setupprofile;

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
    profilecontainer: {
        marginTop:20,
        alignItems: 'center',
    },
    profilepic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    profiletext: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold',
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    personal_info_container: {
        marginTop: 10,
        padding: 19,
        borderWidth:1,
        borderBottomColor:"white",
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
    linktext: {
        color: '#007AFF',
        marginTop: 10,
        marginLeft: 20,
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 270,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    closeButton: {
        marginTop: 50,
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor:"#007AFF",
        padding: 10,
        borderRadius: 10,
    },
    lastText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    removeButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor:"red",
        padding: 10,
        borderRadius: 10,
    },
    indicator: {
        marginTop: 400,
        marginBottom: 30,
    },
    
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
