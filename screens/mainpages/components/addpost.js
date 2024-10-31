import React, { useState,useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { db, storage,auth } from "../../../firebase";
import { doc, setDoc,updateDoc,getDoc } from 'firebase/firestore';
import { ref, uploadBytes } from "firebase/storage";

import { BackButton } from "../../icons/back";
import { CameraIcon } from "../../icons/camera";
import { UserInfoIcon } from "../../icons/userinfo";
import { Undo } from "../../icons/undo";

const AddPost = ({ navigation,route }) => {
    const {postype,editcategory,editprivacy,editcontent,editpic,editbackgroundcolor,postid,setRefreshKey} = route.params
    const user = auth.currentUser;
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("market place");
    const [privacy, setPrivacy] = useState("Public");
    const [image, setImage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("black");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (postype == "edit") {
          setContent(editcontent || "");
          setCategory(editcategory || "market place");
          setPrivacy(editprivacy || "Public");
          setImage(editpic || "");
          setBackgroundColor(editbackgroundcolor || "black");
          if (editpic){
            setPosttype("image")
          }
        }
      }, [posttype, editcategory, editprivacy, editcontent, editpic, editbackgroundcolor]);

    const [posttype,setPosttype] = useState("text");

    const postdate = () => {
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        let hours = d.getHours();
        let minutes = d.getMinutes();


        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
      
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

    const togglecamera = ()=>{
        setPosttype("photo")
        handleChooseImage()
    }
    const removepicture = ()=>{
        setPosttype("text")
        setImage("")
    }

    // Function to pick an image from gallery
    const handleChooseImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Function to upload post and image to Firebase
    const handleUploadPost = async (email, content, privacy, category, backgroundColor, image) => {
        if (!content) {
            Alert.alert("Please enter some content for your post");
            return;
        }
    
        setLoading(true);
    
        try {
            let imagename = "";
            const postid = `${email}_${privacy}_${Date.now()}`; // Generate unique post ID
    
            // Handle image upload if provided
            if (image) { // Ensure image is defined
                const timestamp = Date.now();
                imagename = `${email}_${timestamp}`;
    
                // Fetch the image from the URI and handle fetch errors
                const response = await fetch(image);
                if (!response.ok) {
                    throw new Error("Failed to fetch image from the provided URI");
                }
    
                const blob = await response.blob(); // Convert image to blob
    
                // Create reference to Firebase storage and upload blob
                const storageRef = ref(storage, `postpictures/${imagename}`);
                await uploadBytes(storageRef, blob);
            }
    
            // Add the post to Firestore with the image name if present
            const userRef = doc(db, 'post', postid);
            await setDoc(userRef, {
                content: content,
                createdat: postdate(), // Use new Date() instead of postdate()
                media: imagename, // Store the image name or an empty string if no image
                owner: email,
                privacy: privacy,
                likes: [], // Initialize empty likes array
                comments: [], // Initialize empty comments array
                category: category, // Correct spelling from "categorie"
                backgroundcolor: backgroundColor,
            });

            addPostNumber()
    
            // Reset form fields after successful post creation
            setContent("");
            setCategory("market place");
            setPrivacy("Public");
            setImage(null); // Ensure image is cleared
            setBackgroundColor("black");
            setLoading(false);
            navigation.goBack();
        } catch (error) {
            console.error("Error uploading post:", error); // Log detailed error
            Alert.alert("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };
    const handleEditPost = async (email, content, privacy, category, backgroundColor, image, postid) => {
        if (!content) {
            Alert.alert("Please enter some content for your post");
            return;
        }
    
        setLoading(true);
    
        try {
            let imagename = "";
    
            // Handle image upload if provided
            if (image) {
                const timestamp = Date.now();
                imagename = `${email}_${timestamp}`;
    
                // Fetch the image from the URI and handle fetch errors
                const response = await fetch(image);
                if (!response.ok) {
                    throw new Error("Failed to fetch image from the provided URI");
                }
    
                const blob = await response.blob(); // Convert image to blob
    
                // Create reference to Firebase storage and upload blob
                const storageRef = ref(storage, `postpictures/${imagename}`);
                await uploadBytes(storageRef, blob);
            }
    
            // Add the post to Firestore with the image name if present
            const userRef = doc(db, 'post', postid);
            await updateDoc(userRef, {
                content: content,
                createdat: postdate(), // Use current date
                media: imagename, // Store the image name or an empty string if no image
                owner: email,
                privacy: privacy,
                category: category, // Correct spelling from "categorie"
                backgroundcolor: backgroundColor,
            });
    
            // Reset form fields after successful post creation
            setContent("");
            setCategory("market place");
            setPrivacy("Public");
            setImage(null);
            setBackgroundColor("black");
            setLoading(false);
            setRefreshKey(oldKey => oldKey + 1)
            navigation.goBack();
        } catch (error) {
            console.error("Error uploading post:", error); // Log detailed error
            Alert.alert("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };
    
    
    const addPostNumber = async () => {
        try {
            const taskRef = doc(db, 'users', user.email);
            
            // Get the current value of 'post'
            const docSnap = await getDoc(taskRef);
            
            if (docSnap.exists()) {
                const currentPostNumber = docSnap.data().post || 0; // Default to 0 if 'post' is undefined
                
                // Increment the post number
                await updateDoc(taskRef, {
                    post: currentPostNumber + 1, // Increment by 1
                });
    
                Alert.alert('Task Updated', 'Your post number was successfully updated.');
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'User document does not exist.');
            }
        } catch (error) {
            console.error('Error updating document: ', error);
            Alert.alert('Error', 'There was a problem updating the task.');
        }
    };
    
      

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackButton size={30} color="white" />
                </TouchableOpacity>
                {(postype == "new")?((
                <Text style={styles.title}>new post</Text>)):(
                <Text style={styles.title}>edit post</Text>
                )}
                <TouchableOpacity onPress={() => {
                    if (postype === "new") {
                        handleUploadPost(user.email, content, privacy, category, backgroundColor, image);
                    } else if (postype === "edit") {
                        handleEditPost(user.email, content, privacy, category, backgroundColor, image, postid);
                    }
                }}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#4b4bff" />
                        ) : (
                            <Text style={styles.postButton}>{postype== "new" ? "Post" : "update"}</Text>
                        )}
                </TouchableOpacity>
            </View>



            <View style={styles.dropdownArea}>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => navigation.navigate("Categorise", { setCategory,category })}
                >
                    <Text style={styles.dropdownText}>categorise as: {category}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => navigation.navigate("PostPrivacy", { setPrivacy,privacy })}
                >
                    <Text style={styles.dropdownText}>privacy: {privacy}</Text>
                </TouchableOpacity>
            </View>

            {posttype == "text" && (
                    <View style={[styles.postArea, { backgroundColor }]}>
                        <TextInput
                            placeholder="What's on your mind?"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            placeholderTextColor="white"
                            style={styles.postText}
                        />
                </View>
            )}

            {image && (
                    <View style={styles.imagePreview}>
                        <View style={styles.detailcontainer}>
                            <Text style={styles.detaillabel}>write caption</Text>
                            <TextInput
                                style={styles.detailvalue}
                                value={content}
                                onChangeText={setContent}
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
              )}

            {posttype == "text" && (
                <View style={styles.bottomBar}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.colorScroll}
                    >
                        {[
                            "black",
                            "blue",
                            "green",
                            "red",
                            "brown",
                            "purple",
                            "#9933ff",
                            "yellow",
                            "pink",
                            "gray",
                            "#1a1a1a",
                            "#5900b3",
                        ].map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => setBackgroundColor(color)}
                                style={[styles.colorBlock, { backgroundColor: color }]}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {posttype  && (
            <View style={styles.iconRow}>
            <TouchableOpacity onPress={togglecamera}>
                <CameraIcon size={35} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={removepicture}>
                <Undo size={30} color="#007AFF" />
            </TouchableOpacity>
        </View>
            )}



            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 25,
    },
    title: {
        color: "white",
        fontSize: 20,
    },
    postButton: {
        color: "#4b4bff",
        fontSize: 18,
    },
    dropdownArea: {
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: "#1e1e1e",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    dropdownText: {
        color: "white",
        textTransform: "lowercase",
    },
    postArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
    },
    postText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    colorScroll: {
        paddingVertical: 10,
    },
    colorBlock: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    imagePreview: {
        marginTop: 20,
        alignItems: "center",
    },
    image: {
        width: 380,
        height: 500,
    },
    detailcontainer: {
        marginBottom: 20,
        marginLeft: -6,
        width: "98%",
        borderWidth: 1,
        borderBottomColor: "white",
    },
    detaillabel: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detailvalue: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        borderColor: 'gray',
        borderBottomWidth: 1,
        padding: 4,
    },
    detailremove:{
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
});

export default AddPost;
