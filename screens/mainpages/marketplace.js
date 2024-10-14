import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../firebase'; 

const Marketplace = ({ navigation }) => {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await firestore
          .collection('posts')
          .where('category', '==', 'marketplace')
          .get();
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.log('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: item.userProfilePicture }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>posted {item.createdAt}</Text>
          </View>
          <TouchableOpacity style={styles.menuIcon}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        ) : null}

        <View style={styles.interactionsContainer}>
          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="heart-outline" size={20} color="white" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text style={styles.interactionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="share-social-outline" size={20} color="white" />
            <Text style={styles.interactionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="bookmark-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Market Place</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  menuIcon: {
    marginLeft: 'auto',
  },
  postContent: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  interactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  postsList: {
    paddingBottom: 20,
  },
});

export default Marketplace;
