import { StyleSheet, Text, View, ActivityIndicator, Animated, Modal, TouchableOpacity, TextInput,Image, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const Edit = ({navigation}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    const slideAnimEdit = useRef(new Animated.Value(0)).current;

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);


    const handlecategory = ()=>{
        Alert.alert("category is not yet available")    }
    const handlelink = ()=>{
        navigation.navigate("Links")
    }
    const handlegotomanageaccount = ()=>{
        navigation.navigate("Manageaccount")
    }
    const handleverify = ()=>{
        Alert.alert("verify is not yet available")
    }
    const handleusername = ()=>{
        navigation.navigate("Changeusername")
    }
    const handlebio = ()=>{
        navigation.navigate("Changebio")
    }


    const handleSelectMedia = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this app to access your photos!");
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
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
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Edit profile</Text>
                </View>
            </View>
            <View style={styles.profilecontainer}>
            <Image
                source={media && media.uri ? { uri: media.uri } : require('./download.jpg')}
                style={styles.profilepic}
            />
            <TouchableOpacity onPress={openEditModal}>
                <Text style={styles.profiletext}>Edit profile</Text>
            </TouchableOpacity>
        </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Username</Text>
                <TouchableOpacity onPress={handleusername}><Text style={styles.detailvalue}>value</Text></TouchableOpacity>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Bio</Text>
                <TouchableOpacity onPress={handlebio}><Text style={styles.detailvalue}>value</Text></TouchableOpacity>
            </View>
            <View style={styles.personal_info_container}>
                <Text style={styles.detailvalue}>Personal information</Text>
                <TouchableOpacity style={styles.button} onPress={handlecategory}>
                    <Text style={styles.buttonText}>Categorie</Text>
                    <Text style={styles.buttonText}>(Tutor) {<Icon name="arrow-right" size={25} color="white" style={styles.iconText} />}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handlelink}>
                    <Text style={styles.buttonText}>Other website links</Text>
                    <Text style={styles.buttonText}>{<Icon name="arrow-right" size={25} color="white" style={styles.iconText} />}</Text>
                </TouchableOpacity>
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
});
