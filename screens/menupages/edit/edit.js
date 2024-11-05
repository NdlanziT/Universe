import { StyleSheet, Text, View, ActivityIndicator, Animated, Modal, TouchableOpacity, TextInput,Image, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes,getDownloadURL } from "firebase/storage";

import { db,storage } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';


import { BackButton } from '../../icons/back';
import { ForwardIcon } from '../../icons/foward';

const Edit = ({navigation,route}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    const slideAnimEdit = useRef(new Animated.Value(0)).current;

    const [loading, setLoading] = useState(false);
    const [media, setMedia] = useState(null);
    const {name,username,bio,profilepicture,email,setUsername,setBio,setProfilepicture,phone,setPhone} = route.params;
    const [currentusername,setCurrentusername] = useState(username);
    const [currentbio,setCurrentbio] = useState(bio)
    const [currentprofilepicture,setCurrentprofilepicture] = useState(profilepicture)




    const updateprofilepic = async () => {
        setLoading(true);
        try {
            let imagename = null;
    
            if (media) {
                const currentTime = new Date();
                imagename = `${name}_${currentTime.getTime()}_${email}`;
                const response = await fetch(media.uri);
                const blob = await response.blob();
                const storageRef = ref(storage, `profilepictures/${imagename}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                setProfilepicture(downloadURL); // Set the new profile picture URL
                setCurrentprofilepicture(downloadURL); // Set the current profile picture URL
            }
    
            await updateDoc(doc(db, 'users', email), {
                profilepicture: imagename, // Update with the new image name
            });
        } catch (error) {
            console.error('Error updating your data in the database: ', error);
            Alert.alert("Error", "Failed to update your profile picture. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteprofile = async () => {
        setloading(true);
        try{
            await updateDoc(doc(db, 'users', email), {
                profilepicture: null,
            });
            setCurrentprofilepicture(null) // Set the current profile picture URL
            setProfilepicture(null)
            setLoading(false)
            Alert.alert("your profile has picture is succesfuly deleted")

        }catch (error) {
            setLoading(false)
            console.error('Error updating your data in the database: ', error);
        }
    };

    useEffect(() => {
        if (media) {
            updateprofilepic(); // Move this call here to ensure state is updated
            closeEditModal();
        }
    }, [media]);


    const handlegotomanageaccount = ()=>{
        navigation.navigate("Manageaccount",{phone,setPhone})
    }
    const handleverify = ()=>{
        Alert.alert("verify is not yet available")
    }
    const handleusername = ()=>{
        navigation.navigate("Changeusername",{currentusername,email,setUsername,setCurrentusername})
    }
    const handlebio = ()=>{
        navigation.navigate("Changebio",{currentbio,email,setBio,setCurrentbio})
    }


    const handleSelectMedia = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            setMedia(result.assets[0]);
        }
    };
    

    const removemedia = ()=> {
        deleteprofile()
        closeEditModal()
  
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
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.iconText} >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Edit profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.profilecontainer}>
            <Image
                source={{ uri : currentprofilepicture }}
                style={styles.profilepic}
            />
            <TouchableOpacity onPress={openEditModal}>
                <Text style={styles.profiletext}>Edit profile</Text>
            </TouchableOpacity>
        </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>username</Text>
                <TouchableOpacity onPress={handleusername}><Text style={styles.valuelabel}>{currentusername}</Text></TouchableOpacity>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Bio</Text>
                <TouchableOpacity onPress={handlebio}><Text style={styles.valuelabel}>{currentbio}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handlegotomanageaccount}>
                <Text style={styles.linktext}>Personal information details settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleverify}>
                <Text style={styles.linktext}>show your profile is verified</Text>
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

export default Edit;

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
        marginRight: 10,
        marginLeft: -10,
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
    
    valuelabel: {
        color: 'grey',
        fontSize: 20,
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
        marginBottom: 5,
        marginTop: 10,
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
        backgroundColor: '#28282B',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 270,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
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
        backgroundColor: 'black',
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
});
