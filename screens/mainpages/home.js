import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { db } from '../../firebase'; 
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage'; 
import { storage } from '../../firebase'; 

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const userId = 'userid1'; 

// Fetch posts from Firestore
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'post'), async (snapshot) => {
    const postsData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const post = { id: doc.id, ...doc.data() };

        // Check if the post has media (like an image) stored
        if (post.media) {
          try {
            const imageUrl = await getDownloadURL(ref(storage, `postpictures/${post.media}`));
            return { ...post, imageUrl }; 
          } catch (error) {
            console.error("Error fetching image from Firebase Storage:", error.message);
            return { ...post, imageUrl: null }; 
          }
        }

        return { ...post, imageUrl: null }; 
      })
    );
    setPosts(postsData); // Set posts state with fetched data
  });

  return () => unsubscribe(); // Clean up the listener
}, []);

  // Toggle comments section visibility
  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!showComments[postId]) {
      setCommentText((prev) => ({ ...prev, [postId]: '' })); // Reset comment input if opening
    }
  };

  // Add a new comment
  const addComment = async (postId) => {
    const newComment = commentText[postId];
    if (newComment.trim()) {
      const postDocRef = doc(db, 'post', postId);
      await updateDoc(postDocRef, {
        comments: arrayUnion({
          by: userId,
          createdat: new Date(), 
          text: newComment, 
        }),
      });
      setCommentText((prev) => ({ ...prev, [postId]: '' })); 
      Keyboard.dismiss(); 
    }
  };

  const gotoMessage = () => {
    navigation.navigate('Inbox');
  };

  const gotoAddPost = () => {
    navigation.navigate('AddPost');
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder avatar
          style={styles.avatar}
        />
        <View style={styles.postInfo}>
          <Text style={styles.username}>{item.userId}</Text>
          <Text style={styles.time}>
            {item.createdAt.toDate().toLocaleString()} {/* Display created timestamp */}
          </Text>
        </View>
        <FontAwesome name="ellipsis-v" size={20} color="white" />
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Post Image */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}

      {/* Post Footer (likes, comments) */}
      <View style={styles.postFooter}>
        {/* Likes Count */}
        <View style={styles.iconWithText}>
          <FontAwesome name="heart" size={24} color="white" />
          <Text style={styles.iconText}>{item.likes}</Text> {/* Display likes count */}
        </View>

        {/* Comments */}
        <TouchableOpacity onPress={() => toggleComments(item.id)}>
          <View style={styles.iconWithText}>
            <FontAwesome name="comment" size={24} color="white" />
            <Text style={styles.iconText}>{item.comments.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sliding Comment Section */}
      {showComments[item.id] && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.commentSection}>
          <FlatList
            data={item.comments}
            renderItem={({ item }) => <Text style={styles.comment}>{item.text}</Text>}
            keyExtractor={(item, index) => index.toString()} // Use index as key for comments
          />
          <TextInput
            style={styles.addCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="grey"
            value={commentText[item.id] || ''}
            onChangeText={(text) => setCommentText((prev) => ({ ...prev, [item.id]: text }))}
            onSubmitEditing={() => addComment(item.id)}
          />
        </Animated.View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topbar}>
        <View style={styles.topappname}>
          <Text style={styles.appname}>UniVerse</Text>
          <FontAwesome onPress={() => {}} name="caret-down" size={30} color="white" style={styles.icon1} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={gotoAddPost}>
            <FontAwesome name="plus-circle" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <FontAwesome onPress={() => {}} name="search" size={30} color="white" style={styles.icon} />
          <TouchableOpacity style={styles.messageIconContainer} onPress={gotoMessage}>
            <FontAwesome name="inbox" size={30} color="white" style={styles.icon} />
            {/* Add badge for new messages */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsContainer}
      />
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#000',
  },
  topappname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appname: {
    color: 'white',
    fontSize: 30,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  messageIconContainer: {
    position: 'relative',
  },
  postContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
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
  },
  postsContainer: {
    paddingBottom: 20, 
  },
});
