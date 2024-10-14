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
import { db, storage } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddPost = ({ navigation }) => {
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("marketplace");
    const [privacy, setPrivacy] = useState("public");
    const [image, setImage] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("blue");
    const [loading, setLoading] = useState(false);

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
    const handleUploadPost = async () => {
        if (!content) {
            Alert.alert("Please enter some content for your post");
            return;
        }

        setLoading(true);

        const postId = Date.now().toString();
        const userId = "userid1";
        let imageUrl = null;
        try {
            if (image) {
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `postpictures/${postId}`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef);
            }

            await setDoc(doc(db, "post", postId), {
                content,
                category,
                privacy,
                createdAt: new Date(),
                userId,
                imageUrl,
                likes: 0,
                comments: [],
                backgroundColor,
                isPublic: privacy === "public",
            });

            // Reset state after successful post creation
            setContent("");
            setCategory("marketplace");
            setPrivacy("public");
            setImage(null);
            setBackgroundColor("blue");
            setLoading(false);

            navigation.goBack();
        } catch (error) {
            console.error("Error uploading post: ", error);
            Alert.alert("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>new post</Text>
                <TouchableOpacity onPress={handleUploadPost}>
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
                        "white",
                        "yellow",
                        "pink",
                        "gray",
                        "black",
                    ].map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => setBackgroundColor(color)}
                            style={[styles.colorBlock, { backgroundColor: color }]}
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.iconRow}>
                <TouchableOpacity onPress={handleChooseImage}>
                    <Ionicons name="camera" size={28} color="#4b4bff" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="at" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {image && (
                <View style={styles.imagePreview}>
                    <Image source={{ uri: image }} style={styles.image} />
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
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});

export default AddPost;
