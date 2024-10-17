import { StyleSheet, Text, View, ScrollView, Animated,Image, Alert, Modal,Share, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Change to Ionicons
import { TouchableOpacity } from 'react-native';
import { auth,db,storage } from '../../firebase';

import { collection, getDocs,doc, getDoc, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

const Profilemenu = ({navigation}) => {
    const user = auth.currentUser;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [userdata,setUserdata] = useState([])
    const [userprofile,setProfile] = useState(null)
    const [posts, setPost] = useState([]);
    const scrollViewRef = useRef(null);

  // Function to scroll to a specific position
    const scrollToPosition = (position) => {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    };

    const fetchUserData = async (userId) => {
      try {
        const userDocRef = doc(db, 'users', userId); 
        const userDoc = await getDoc(userDocRef); // Fetch the document
        
        if (userDoc.exists()) {
          // If the document exists, return the user data
          const userData = userDoc.data();
          setUserdata(userData); // Set the user data state

          const profilePictureURL = await fetchProfilePictureURL(userData.profilepictureURL);
          setProfile(profilePictureURL); // Set the profile picture URL
        } else {
          console.log('No such document!');
          return null; // If the document does not exist
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null; // Handle the error, returning null or appropriate response
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

    const fetchDocumentsByOwner = async (ownerEmail) => {
      try {
        // Create a query against the collection
        const collectionRef = collection(db, 'post'); // Replace 'yourCollection' with your actual collection name
        const q = query(collectionRef, where('owner', '==', ownerEmail));
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        // Extract the documents
        const documents = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            const post = {
              id: doc.id,
              ...postData,
            };
    
            return post; // Return the updated post object
          })
        );
    
        setPost(documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setPost([]); // Return an empty array or handle the error as needed
      }
    };
    

    useEffect(() => {
      fetchUserData(user.email)
      fetchDocumentsByOwner(user.email)
    }, [posts]);

    const sharehandle = async () => {
        try {
            await Share.share({
                message: 'Check this out: https://example.com',
            });
        } catch (error) {
            alert(error.message);
        }
    };
    const notificationhandle = ()=> {
      navigation.navigate("Notification");
    };
    const followingpagehandle = ()=> {
      navigation.navigate("Followingpage");
    };
    const menuhandle = ()=> {
      navigation.navigate("Menu");
    };
    const dashboardhandle = ()=> {
      navigation.navigate("Dashboard");
    };
    const edithandle = ()=> {
      navigation.navigate("Edit");
    };


  return (
    <View style={styles.container}>
      <View style={styles.group1}>
        <View style={styles.leftSection} >
          <Text style={styles.text}>{userdata.username}</Text>
        </View>

        <View style={styles.rightSection}>
          {/* Bell icon with notification dot */}
          <TouchableOpacity style={styles.iconWithBadge} onPress={notificationhandle}>
            <Icon name="notifications-outline" size={30} color="white" style={styles.iconText} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>

          {/* Bars icon with red dot */}
          <TouchableOpacity style={styles.iconWithDot} onPress={menuhandle}>
            <Icon name="menu" size={35} color="white" style={styles.iconText} />
            {/* <View style={styles.dot}></View> */}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollcontainer}
        ref={scrollViewRef}
      >
        <View style={styles.group2}>
            <Image
                    source={{uri : userprofile}} 
                    style={styles.profilepic}
            />
            <TouchableOpacity style={styles.following} onPress={() => scrollToPosition(400)}>
                <Text style={styles.followingtext} >Post</Text>
                <Text style={styles.followingtext}>{Array.isArray(userdata.post) ? userdata.post.length : 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={followingpagehandle}>
                <Text style={styles.followingtext}>Followers</Text>
                <Text style={styles.followingtext}>{Array.isArray(userdata.followers) ? userdata.followers.length : 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={followingpagehandle}>
                <Text style={styles.followingtext}>Following</Text>
                <Text style={styles.followingtext}>{Array.isArray(userdata.following) ? userdata.following.length : 0}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group3}>
            <Text style={styles.username}>{userdata.name}</Text>
            <Text style={styles.bio}>{userdata.bio}</Text>
            <Text style={styles.link}>1st link</Text>
            <Text style={styles.link}>2nd link</Text>
        </View>
        <View style={styles.group4}>
            <TouchableOpacity style={styles.dashboardcontainer} onPress={dashboardhandle}>
                <Text style={styles.dashboard1sttext}>Dashboard</Text>
                <Text style={styles.dashboard2sttext}>Tools and resources just for you</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group5}>
            <TouchableOpacity style={styles.buttonFollow} onPress={edithandle}>
                <Text style={styles.buttonText}>edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFollow} onPress={sharehandle}>
                <Text style={styles.buttonText}>share profile</Text>
            </TouchableOpacity>
        </View>
        
        <View style={styles.ScrollViewcontainer}>
          {posts.map((post, index) => (
            <View key={index} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <Image
                  source={{uri : userprofile}}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.postInfo}>
                  <Text style={styles.buttonText}>{userdata.username}</Text>
                  <Text style={styles.time}>{post.createdat}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.elipsecontainer}>
                  <Icon name="ellipsis-horizontal" size={20} color="white" />
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
                    <Icon name="heart" size={24} color="white" />
                    <Text style={styles.iconText}>{post.likes.length}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconWithText} >
                    <Icon name="chatbox" size={24} color="white" />
                    <Text style={styles.iconText}>{post.comments.length}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
    </View>
  );
};

export default Profilemenu;

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
    flex:1,
    flexDirection: 'row',
    height: 120,
    width: "100%",
    alignItems:"center",
  },
  group3: {
    marginLeft:25,
  },
  group4: {
    height: 120,
    alignItems:"center",
    justifyContent:"center",
    padding: 20,

  },
  group5: {
    flexDirection: 'row', // Add space between buttons
    marginTop: -25, // Add some margin above the buttons
    padding:19,

  },
  group6: {
    flex:1,
    flexDirection: 'row',
    height: 800,
    width: "100%",
    borderTopWidth: 1, // Thin line at the top
    borderTopColor: 'white',
    justifyContent: "center",
  },
  profilepic: { // Change to desired color
    flex: 1,
    margin: 5,
    marginLeft: 20,
    height: 91,
    width:110,// Set a width for visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Half of the height/width to make it round
    overflow: 'hidden', 
  },
  following: {
    backgroundColor: 'black', // Change to desired color
    flex: 1,
    margin: 5,
    height: 100, // Set a height for visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollcontainer: {
    flex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
  },
  followingtext:{
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  iconText: {
    marginLeft: 15,
  },
  iconText2: {
    marginLeft: 8,
  },
  iconWithBadge: {
    position: 'relative',
    marginRight: 20,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconWithDot: {
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  username: {
    fontSize: 15,         // Size similar to Instagram's username
    fontWeight: 'bold',         // Black color for username
    marginBottom: 4,
    color:"white"      // Spacing below the username
  },
  bio: {
    fontSize: 15,         // Size similar to Instagram's bio
    color: '#666',        // Gray color for bio text
    marginBottom: 10,     // Spacing below the bio
    lineHeight: 20,       // Line height for better readability
  },
  link: {
    fontSize: 14,         // Size for links
    color: '#0095F6',     // Instagram's link color
    textDecorationLine: 'underline', // Underlined for link effect
  },
  dashboardcontainer: {
    flex:1,
    backgroundColor: "#434343",
    width: "100%",
    height:90,
    justifyContent: "center",
    borderRadius:10,
  },
  dashboard1sttext: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
    marginLeft: 5,
  },
  dashboard2sttext: {
    fontWeight: '200',
    color: 'white',
    marginBottom: 5,
    marginLeft: 5,
  },
  buttonFollow: {
    flex: 1,
    backgroundColor: '#434343',
    borderRadius: 10, // Rounded corners
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text vertically
    height: 50,
    marginLeft:3,
  },
  buttonText: {
    color: '#fff', // White text for the follow button
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonMessageText: {
    color: '#000', // Black text for the message button
    fontWeight: 'bold',
    fontSize: 16,
  },
  postText: {
    color: '#fff', // White text for the follow button
    fontWeight: 'bold',
    fontSize: 20,
    marginTop:100,
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
    height: 300,
},
modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
},
closeButton: {
    marginTop: 20,
    alignItems: 'center',
},
closeButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
},
ScrollViewcontainer: {
  width: 400,
  marginLeft: -3,
},
postContainer: {
  padding: 10,
  marginLeft:25,
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
});