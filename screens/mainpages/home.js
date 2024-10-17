import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { db,storage} from '../../firebase';
import { collection, getDocs,doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [posts, setPost] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPostURL = async (fileName) => {
    try {
      const storageRef = ref(storage, `postpictures/${fileName}`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error fetching post picture:', error);
      return null;
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

  const fetchUserData = async (email) => {
    try {
      const userDoc = doc(db, 'users', email);  // Use email as the document ID
      const userSnapshot = await getDoc(userDoc);
  
      if (userSnapshot.exists()) {
        const user = userSnapshot.data(); // Get the user data
  
        return {
          name: user.username,  // Correctly access username
          url: user.profilepictureURL, // Correctly access profile picture URL
        };
      } else {
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "post"));
        const postsArray = [];
        
        for (let i = 0; i < Math.min(querySnapshot.docs.length, 10); i++) { // Fetch only 10 posts initially
          const doc = querySnapshot.docs[i];
          const postData = doc.data();
          
          // Fetch the image URL if 'media' exists
          if (postData.media) {
            const postPictureURL = await fetchPostURL(postData.media);
            postData.postPictureURL = postPictureURL; // Use placeholder
          }
  
          if (postData.owner) {
            const { name, url } = await fetchUserData(postData.owner);
            const ProfilePicture = await fetchProfilePictureURL(url);
            postData.username = name;
            postData.profilePicture = ProfilePicture; 
          }
  
          postsArray.push({ id: doc.id, ...postData });
        }
  
        setPost(postsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts: ", error);
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, [posts]);



  const gotoMessage = () => {
    navigation.navigate('Inbox');
  };

  const gotoAddPost = () => {
    navigation.navigate('AddPost');
  };

  // Toggle comments section visibility
  const toggleComments = () => {
    Alert.alert(`${posts[0].name}`);
  };

  // Add a new comment
  const addComment = () => {
    if (commentText.trim()) {
      post.comments.push({
        text: commentText,
        by: 'userid1',
        createdAt: new Date(),
      });
      setCommentText('');
      Keyboard.dismiss();
    }
  };

  // Toggle like state
  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topbar}>
        <View style={styles.topappname}>
          <Text style={styles.appname}>UniVerse</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.messageIconContainer} onPress={gotoAddPost}>
            <Ionicons name="add-circle" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageIconContainer}>
            <Ionicons name="search" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageIconContainer} onPress={gotoMessage}>
            <Ionicons name="chatbox-ellipses-outline" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.ScrollViewcontainer}>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image
                source={{uri : post.profilePicture}}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.postInfo}>
                <Text style={styles.username}>{post.username}</Text>
                <Text style={styles.time}>{post.createdat}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.elipsecontainer}>
                <Ionicons name="ellipsis-horizontal" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Conditionally render postPicture if it's not null */}
            {post.postPictureURL ? (
              <Image
                source={{ uri: post.postPictureURL }} // Use the fetched image URL
                style={styles.postpicture}
              />
            ) : null}

            {/* Post Footer (likes, comments) */}
            <View style={styles.posticonContainer}>
              <View style={styles.iconWithTextcontainer}>
                <TouchableOpacity style={styles.iconWithText}>
                  <Ionicons name="heart" size={24} color="white" />
                  <Text style={styles.iconText}>{post.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWithText} onPress={toggleComments}>
                  <Ionicons name="chatbox" size={24} color="white" />
                  <Text style={styles.iconText}>{post.comments.length}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.iconWithTextcontainer}>
                <Text style={styles.iconText}>comments ({post.comments.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
</ScrollView>

    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  topbar: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 10,
  },
  ScrollViewcontainer: {
    width: 400,
    marginLeft: -3,
  },
  postpicture:{
    width: "110%",
    height: 380,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: -30,
  },
  topappname: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posticonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
  },
  messageIconContainer: {
    marginRight: 15,
  },
  appname: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  postContainer: {
    padding: 10,
    borderTopWidth: 2, // Add this line for the top border
    borderTopColor: '#1e1e1e', // Specify the color for the top border
    borderBottomColor: '#1e1e1e',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInfo: {
    flex: 1,
    marginLeft: 10,
  },
  elipsecontainer:{
    width: 100,
    borderRadius: 5,
    alignItems: 'flex-end',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
  },
  time: {
    color: 'grey',
  },
  postContent: {
    color: 'white',
    marginVertical: 5,
    marginBottom: 10,
    marginTop: 30,
  },
  iconWithText: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  iconWithTextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    marginLeft: 5,
  },
  commentSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'grey',
    paddingTop: 10,
  },
  comment: {
    color: 'white',
    marginVertical: 5,
  },
  addCommentText: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 5,
    color: 'white',
    marginTop: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginTop:8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
