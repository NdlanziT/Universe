import React, { useState } from "react";
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
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddPost = ({ navigation }) => {
    const user = auth.currentUser;
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("marketplace");
    const [privacy, setPrivacy] = useState("public");
    const [image, setImage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("blue");
    const [loading, setLoading] = useState(false);

    const [posttype,setPosttype] = useState("text");

    const postdate = () => {
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        let hours = d.getHours();
        let minutes = d.getMinutes();
      
        // Pad single digit minutes and hours with leading zeros
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
      
        return `${day}-${month}-${year} ${hours}:${minutes}`;
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
    const handleUploadPost = async (email,content,privacy,category,backgroundColor) => {
        if (!content) {
            Alert.alert("Please enter some content for your post");
            return;
        }
        setLoading(true);
    
        try {
            let imagename;
            let postid = `${email}_${category}_${Date.now()}`
    
            if (image) {
                const timestamp = Date.now();
                imagename = `${email}_${timestamp}`
                const response = await fetch(media.uri); // Fetch the image from the URI
                const blob = await response.blob();  // Convert the image to a blob
                const storageRef = ref(storage, `profilepictures/${imagename}`); // Create a reference to the storage location
                await uploadBytes(storageRef, blob); // Upload the image blob
                const imageUrl = await getDownloadURL(storageRef); // You can keep this for other purposes if needed
            } else {
                imagename = ""; // Set imagename to null if no media is selected
            }
    
            // Add the post to Firestore with media containing the image name
            const userRef = doc(db, 'post', postid);
            await setDoc(userRef, {
                content: content,
                createdat: postdate(),
                media: imagename, // Store the imageName as media, or null if no image
                owner: email,
                privacy: privacy,
                likes: [], 
                comments: [],
                categorie: category,
                backgroundcolor: backgroundColor,
            });

            addPostToUserArray(email,postid)
    
            // Reset states after the post is successfully uploaded
            setContent("");
            setCategory("marketplace");
            setPrivacy("public");
            setImage(null);
            setBackgroundColor("blue");
            setLoading(false);
    
            navigation.goBack();
        } catch (error) {
            Alert.alert("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };

    const addPostToUserArray = async (email, postid) => {
        try {
            const userRef = doc(db, 'users', email);
            
            // Update the 'post' array by adding the new post data using arrayUnion
            await updateDoc(userRef, {
                post: arrayUnion(postid) // Append the new post to the 'posts' array
            });
    
            console.log('Post added successfully to user posts array!');
        } catch (error) {
            console.error('Error adding post to user posts array: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>new post</Text>
                <TouchableOpacity onPress={()=>{handleUploadPost(user.email,content,privacy,category,backgroundColor)}}>
                    <Text style={styles.postButton}>post</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.dropdownArea}>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => navigation.navigate("Categorise", { setCategory })}
                >
                    <Text style={styles.dropdownText}>categorise as: {category}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => navigation.navigate("PostPrivacy", { setPrivacy })}
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

            {posttype == "photo" && (
                    image && (
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
                        <TouchableOpacity onPress={removepicture}>
                            <Text style={styles.detailremove}>remove picture</Text>
                            <Text style={styles.detailremove}>{image.length}</Text>
                        </TouchableOpacity>
                    </View>
                    )
              )}

            {posttype == "text" && (
                <View style={styles.bottomBar}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.colorScroll}
                    >
                        {[
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
                <Ionicons name="camera" size={30} color="#4b4bff" />
            </TouchableOpacity>
            <TouchableOpacity >
                <Ionicons name="at" size={30} color="white" />
            </TouchableOpacity>
        </View>
            )}



            {loading && <ActivityIndicator size="large" color="#4b4bff" />}
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
