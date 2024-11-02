import { StyleSheet, Text, View, ScrollView, Animated,Image, Alert, Modal,Share,Dimensions,ActivityIndicator,TextInput,
  TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef, useState,useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Change to Ionicons
import { TouchableOpacity } from 'react-native';
import { auth,db,storage } from '../../firebase';
import { collection, getDocs,doc, getDoc, query, where,updateDoc,arrayUnion,arrayRemove,deleteDoc,setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import { MenuIcon } from '../icons/menu';
import { NotificationIcon } from '../icons/notification';
import { MoreOptionIcon } from '../icons/more-vertical';
import { CommentIcon } from '../icons/comment';
import { LikeIcon } from '../icons/like';
import { BackButton } from '../icons/back';
import { AddIcon } from '../icons/add_circle';
import { SearchIcon } from '../icons/search';
import { InboxIcon } from '../icons/inbox';
import { Bookmark } from '../icons/bookmark';
import { UserInfoIcon } from '../icons/userinfo';
import { CloseButton } from '../icons/close';
import { CircleUp } from '../icons/arrow_circle_up';
import { CameraIcon } from '../icons/camera';
import { EditIcon } from '../icons/edit';
import { RemovingIcon } from '../icons/remove';
import { BookmarkRemove } from '../icons/bookmarkremove';
import { BinIcon } from '../icons/bin';

const { width, height } = Dimensions.get('window');

const Profilemenu = ({navigation}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const user = auth.currentUser;
  const [loading,setLoadinng] = useState(true)
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [phone,setPhone] = useState("")
  const [bio,setBio] = useState("")
  const [name,setName] = useState("")
  const [profilepicture,setProfilepicture] = useState("")
  const [followers,setFollowers] = useState([])
  const [following,setFollowing] = useState([])
  const [links,setLinks] = useState([])
  const [ActivePage, setActivePage] = useState('followers'); 
  const [blocked,setBlocked] = useState([])
  const [post,setPost] = useState(0);
  const [accountprivacy,setAccountprivacy] = useState('')
  const [theme,setTheme] = useState(' ')
  const [posts,setPosts] = useState([])
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [userdata,setUserData] =useState([])

  
  const [optionmodalVisible, setoptionModalVisible] = useState(false);
  const [saved,setSaved] = useState([])
  const [favorite,setFavorite] = useState([])
  const [addedtosave,setAddedtosave] = useState(false);
  const [addedtofavorite,setAddedtofavorite] = useState(false);
  const [postidsave,setPostidsave]= useState("")

  
  const [commentmodalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [postcomments,setPostComments] = useState([]);
  const [commentloading,setCommentLoading] = useState(true);
  const [replyto,setReplyto] = useState("");
  const [editcomment,setEditcomment] = useState(false);
  const [postidcomment,setPostidcomment] = useState("");
  const [loadingcomment,setloadingcomment] = useState(false);
  const [currentcommentid,setCurrentcommentid] = useState("");

  const [categorie,setccategorie] = useState("");
  const [publicity,setpublicity] = useState("")
  const [content,setcontent] = useState("")
  const [media,setmedia] = useState("")
  const [backgroundcolor,setbackgroundcolor] = useState("")

  const timeDifference = useCallback((dateString) => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    const diffInMs = currentDate - inputDate;

    const diffInMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));
    const diffInHours = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60)));
    const diffInDays = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
    const diffInYears = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365)));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 365) {
      return `${diffInDays}d`;
    } else {
      return `${diffInYears}y`;
    }
  }, []);
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
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

    const fullscreenprofile = () => {
      setImageModalVisible(true);
    };
  
    const closeImageModal = () => {
      setImageModalVisible(false);
    };
    const handleLike = (postid, myemail, state) => {
      if (state) {
        setPosts(prevPost =>
          prevPost.map(post => 
            post.id === postid ? { ...post,
               liked: false,
               likes: post.likes.filter(email => email !== myemail)
               } : post
          )
        );
        removeValueFromLikes(postid, 'likes', myemail);
      } else {
        setPosts(prevPost =>
          prevPost.map(post => 
            post.id === postid ? { ...post,
               liked: true ,
               likes: [...(post.likes || []), myemail]
              } : post
          )
        );
        addValueToLikes(postid, 'likes', myemail);
      }
    };

    const removeValueFromLikes = async (docId, field, valueToRemove) => {
      try {
          // Get a reference to the document
          const docRef = doc(db, 'post', docId); // Assuming the document is in the 'users' collection
  
          // Update the document by removing the specific value from the array field
          await updateDoc(docRef, {
              [field]: arrayRemove(valueToRemove) // Remove the specific value from the array
          });
  
          console.log(`Successfully removed ${valueToRemove} from the array`);
      } catch (error) {
          console.error("Error removing value from array:", error);
      }
  };
  
  const addValueToLikes = async (docId, field, valueToAdd) => {
      try {
          // Get a reference to the document
          const docRef = doc(db, 'post', docId); // Assuming the document is in the 'users' collection
  
          // Update the document by adding the specific value to the array field
          await updateDoc(docRef, {
              [field]: arrayUnion(valueToAdd)
          });
          console.log(`Successfully added ${valueToAdd} to the array`);
      } catch (error) {
          console.error("Error adding value to array:", error);
      }
  };
  const closeoptionModal = () => {
    Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start(() => setoptionModalVisible(false));
};
const removeValueFromSaved = async (docId, field, valueToRemove) => {
  try {
      // Get a reference to the document
      const docRef = doc(db, 'users', docId); // Assuming the document is in the 'users' collection

      // Update the document by removing the specific value from the array field
      await updateDoc(docRef, {
          [field]: arrayRemove(valueToRemove) // Remove the specific value from the array
      });

      console.log(`Successfully removed ${valueToRemove} from the array`);
  } catch (error) {
      console.error("Error removing value from array:", error);
  }
};

const addValueToSaved = async (docId, field, valueToAdd) => {
  try {
      // Get a reference to the document
      const docRef = doc(db, 'users', docId); // Assuming the document is in the 'users' collection

      // Update the document by adding the specific value to the array field
      await updateDoc(docRef, {
          [field]: arrayUnion(valueToAdd)
      });
      console.log(`Successfully added ${valueToAdd} to the array`);
  } catch (error) {
      console.error("Error adding value to array:", error);
  }
};
const handlesavepost = (postid, myemail, state) => {
  if (state) {
    removeValueFromSaved(myemail, 'saved', postid);

    setSaved((prevSaved) => {
      if (prevSaved.includes(postid)) {
        return prevSaved.filter((item) => item !== postid);
      }
      return prevSaved; // Return unchanged array if value wasn't in the array
    });
    closeoption()
  } else {
    // State is false, indicating the post is not saved and needs to be added
    addValueToSaved(myemail, 'saved', postid);

    setSaved((prevSaved) => {
      // Ensure that the post is only added if it's not already in the array
      if (!prevSaved.includes(postid)) {
        return [...prevSaved, postid]; // Add the postid to the saved array
      }
      return prevSaved; // Return unchanged array if postid is already there
    })
    closeoption()
  }
};
const handleaddfavourites = (postid, myemail, state) => {
  if (state) {
    removeValueFromSaved(myemail, 'favourites', postid);


    setFavorite((prevSaved) => {
      if (prevSaved.includes(postid)) {
        return prevSaved.filter((item) => item !== postid);
      }
      return prevSaved; // Return unchanged array if value wasn't in the array
      
    })
    closeoption()
  } else {
    addValueToSaved(myemail, 'favourites', postid);

    setFavorite((prevSaved) => {
      // Ensure that the post is only added if it's not already in the array
      if (!prevSaved.includes(postid)) {
        return [...prevSaved, postid]; // Add the postid to the saved array
      }
      return prevSaved; // Return unchanged array if postid is already there
     
    })
    closeoption()
  }
};
const openoptionModal = () => {
  setoptionModalVisible(true);
  Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
  }).start();
};
const toogleoption = (saved,favorites,postid,categorie,privacy,content,pic,backgroundcolor) =>{
  setAddedtosave(saved.includes(postid));
  setAddedtofavorite(favorites.includes(postid));
  setPostidsave(postid)

  setccategorie(categorie)
  setpublicity(privacy)
  setcontent(content)
  setmedia(pic)
  setbackgroundcolor(backgroundcolor)

  openoptionModal()

}

const closeoption = ()=>{
  closeoptionModal()
  setAddedtofavorite(false)
  setAddedtosave(false)
  setPostidsave('')
  
  setccategorie("")
  setpublicity("")
  setcontent("")
  setmedia("")
  setbackgroundcolor("")
}
const slideUpStyle = {
  transform: [
      {
          translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [450, 0],
          }),
      },
  ],
};
const replytouser = (username,email)=>{
  setReplyto(username)
}
const editmycomment = (commentid, comment)=>{
  setComment(comment)
  setEditcomment(true)
  setCurrentcommentid(commentid)
}
const deletecomment = (commentid,postid) => {

  Alert.alert(
    "Delete comment",
    `Are you sure you want to delete the comment?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'comments', commentid));
            removeValueFromLikes(postidcomment,'comments',commentid)
            console.log("Document deleted!");
            setPostComments((prevComments) => 
              prevComments.filter(comment => comment.id !== commentid)
          );
          setPost(prevPost =>
            prevPost.map(post =>
                post.id === postid 
                    ? { ...post, comments: post.comments.filter(id => id !== commentid) } // Remove the comment ID
                    : post
            )
        );
          }
          catch (error) {
            console.error("Error deleting document:", error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};

const addCommentLikes = async (commentId, state) => {
  try {
      const commentRef = doc(db, 'comments', commentId);

      if (!state) {
          // Liking the comment
          await updateDoc(commentRef, {
              likes: arrayUnion(email), // Add myemail to the likes array
          });

          // Update the local state
          setPostComments(prevComments => 
              prevComments.map(comment => 
                  comment.id === commentId // Find the specific comment
                      ? { 
                          ...comment, 
                          liked: true, // Set liked to true
                          likes: [...comment.likes, email] // Add myemail to the local likes array
                      } 
                      : comment // Return the comment unchanged if it doesn't match
              )
          );

          console.log("Liked the comment!");
      } else {
          // Unliking the comment
          await updateDoc(commentRef, {
              likes: arrayRemove(email), // Remove myemail from the likes array
          });

          // Update the local state
          setPostComments(prevComments => 
              prevComments.map(comment => 
                  comment.id === commentId // Find the specific comment
                      ? { 
                          ...comment, 
                          liked: false, // Set liked to false
                          likes: comment.likes.filter(email => email !== email) // Remove myemail from the local likes array
                      } 
                      : comment // Return the comment unchanged if it doesn't match
              )
          );

          console.log("Unliked the comment!");
      }
  } catch (error) {
      console.error("Error updating the comment likes:", error);
  }
};
const handleupdatecomment = async () => {
  setloadingcomment(true);
  try {
    const commentRef = doc(db, 'comments', currentcommentid);

    // Update the existing comment in Firestore
    await updateDoc(commentRef, {
        content: comment, // New content
        createdat: postdate(), // Optionally update createdat or keep it as is
    });

    // Update the local state with the modified comment
    setPostComments(prevComments => 
      prevComments.map(prevComment => 
          prevComment.id === currentcommentid // Check for the correct ID
              ? {
                  ...prevComment, 
                  content: comment, // Update with the new content
                  createdat: postdate(), // Update createdat to the current date/time
              }
              : prevComment // Return unchanged comment
      )
  );
    setEditcomment(false),
    setComment("")
    setCurrentcommentid("")

} catch (error) {
    console.error("Error updating comment:", error);
    setEditcomment(false),
    setComment("")
    setCurrentcommentid("")
} 

}
const handdlesendcomment = async (postid) => {
  setloadingcomment(true)
  const commentid = `${email}_${Date.now()}`;
  try {
    const userRef = doc(db, 'comments', commentid);
    await setDoc(userRef, {
        content: comment,
        createdat: postdate(),
        likes: [], 
        owner: email,
        id : commentid,
        replies: [],
    });
    addValueToLikes(postidcomment,'comments',commentid)
    const newComment = {
      id: commentid,
      content: comment,
      createdat: postdate(),
      owner: email,
      liked: false,
      likes: [],
      ownerInfo: {
          username: myusername,
          profilepic: myprofilepicture
      },
      mine: true // Indicate that the current user owns this comment
  };
    setPostComments((prevComments) => [...prevComments, newComment]);
    setloadingcomment(false)
    setComment("")
    setPost(prevPost =>
      prevPost.map(post => 
        post.id === postid 
          ? { ...post, comments: [...(post.comments || []), commentid] }
          : post
      ))
  }
  catch (error) {
    console.error("Error updating document:", error);
  }
};
const deletePostById = (postId) => {

  Alert.alert(
    "Delete post",
    `Are you sure you want to delete the post?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            // Delete the post from Firestore
            const postDocRef = doc(db, "post", postId);
            const taskRef = doc(db, 'users', email);
            await deleteDoc(postDocRef);
        
            // Update the posts state by filtering out the deleted post
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
            setPost((prev) => prev - 1)
            await updateDoc(taskRef, {
              post: post - 1,
            });
          } catch (error) {
            console.error("Error deleting post:", error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};
const gotoAddPost = () => {
  navigation.navigate('AddPost',{postype : "edit",editcategory: categorie,editprivacy : publicity,editcontent : content , editpic : media,editbackgroundcolor : backgroundcolor,postid : postidsave,setRefreshKey});
  closeoption()
};
const fetchComments = async (ids) => {
  setCommentLoading(true);
  try {
    const commentsCollectionRef = collection(db, 'comments');
    const commentsQuery = query(commentsCollectionRef, where('id', 'in', ids));
    const querySnapshot = await getDocs(commentsQuery);
    const fetchedComments = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const commentData = { id: doc.id, ...doc.data() };

        const user = await fetchUserById(commentData.owner);
        commentData.liked = commentData.likes.includes(email);
        if(user){
          commentData.ownerInfo = {
            name: user.name,
            username: user.username,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            post: user.post,
            email: user.email,
            profilepic: user.profilepicture,
          };
          if (user.email === email){
            commentData.mine = true;
          }else{
            commentData.mine = false;
          }
        }
        return commentData;
      })
    );
    setPostComments(fetchedComments);
    setCommentLoading(false);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};
async function fetchUserById(userId) {
  try {
    const userDocRef = doc(db, "users", userId);

    // Get the document snapshot
    const userDocSnap = await getDoc(userDocRef);

    // Check if the document exists
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log(userData.following)
      return {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        profilepicture: await fetchProfilePictureURL(userData.profilepicture),
        post: userData.post,
        followers: userData.followers,
        following: userData.following,
        saved: userData.saved,
        favourites: userData.favourites,
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
}
const togglecomment = (ids,postid) =>{
  setPostidcomment(postid)
  if(ids.length > 0){
    fetchComments(ids)
  }else{
    setPostComments([]);
    setCommentLoading(false);
  }
  opencommentModal()
}
const closecomment = () => {
  closecommentModal();
  setPostComments([])
  setComment("")
  setPostidcomment('')
}
const opencommentModal = () => {
  setCommentModalVisible(true);
  Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
  }).start();
};
const closecommentModal = () => {
  Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
  }).start(() => setCommentModalVisible(false));
};
const slideUpStylecomment = {
  transform: [
      {
          translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [900, 0],
          }),
      },
  ],
};

  // Function to scroll to a specific position
    const scrollToPosition = (position) => {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    };

    const fetchUserData = async (email) => {
      try {
          const userRef = doc(db, 'users', email);
          const userDoc = await getDoc(userRef); 
  
          if (userDoc.exists()) {
              // If the document exists, copy the data into currentUserData
              const currentUserData = userDoc.data();
              currentUserData.profilepic = await fetchProfilePictureURL(currentUserData.profilepicture);
              setUserData(currentUserData); // Log the user data for debugging or verification
              setUsername(currentUserData.username)
              setPhone(currentUserData.phone)
              setEmail(currentUserData.email)
              setBio(currentUserData.bio)
              setName(currentUserData.name)
              setFollowers(currentUserData.followers)
              setFollowing(currentUserData.following)
              setLinks(currentUserData.links)
              setPost(currentUserData.post)
              setUserData(currentUserData); // Return the user data if needed
              setProfilepicture(currentUserData.profilepic)
              setPost(currentUserData.post)
              setBlocked(currentUserData.blocked)
              setAccountprivacy(currentUserData.privacy)
              setTheme(currentUserData.theme)
              setLoadinng(false)
              setSaved(currentUserData.saved);
              setFavorite(currentUserData.favourites);
          } else {
              console.error("No such user exists!"); // Handle the case where the document does not exist
              return null; // Return null or handle as needed
          }
      } catch (error) {
          console.error("Error fetching user data: ", error); // Handle any errors that occur during the fetch
          return null; // Return null or handle as needed
      }
  };

    const fetchProfilePictureURL = async (fileName) => {
      try {
        if (fileName == null || fileName.length ==''){
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

    async function fetchPosts(email) {
      try {
        // Create a query that fetches posts with owner matching the email
        const postsCollectionRef = collection(db, "post");
        const postsQuery = query(postsCollectionRef, where("owner", "==", email));
        const querySnapshot = await getDocs(postsQuery);
    
        // Process posts asynchronously
        const posts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            postData.id = doc.id;
    
            // Fetch media URL if needed
            postData.media = await fetchPostPictureURL(postData.media);
    
            // Add additional properties if needed
            postData.liked = postData.likes && postData.likes.includes(email);
    
            return postData;
          })
        );
    
        // Update state with the fetched posts
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    const fetchPostPictureURL = async (fileName) => {
      try {
        if (fileName !== null){
          const storageRef = ref(storage, `postpictures/${fileName}`);
          const url = await getDownloadURL(storageRef);
          return url;
        }else{
          return null;
        }
      } catch (error) {
        console.error('Error fetching pod picture:', error);
        return null;
      }
    };
    


    useEffect(() => {
      fetchUserData(user.email)
    }, [post]);

    useEffect(() => {
      if(loading == false){
        fetchPosts(user.email)
      }
    }, [loading,refreshKey]);

    const sharehandle = async () => {
        try {
            await Share.share({
                message: `username: ${userdata.username}_${user.uid}`,
            });
        } catch (error) {
            alert(error.message);
        }
    };
    const notificationhandle = ()=> {
      navigation.navigate("Notification");
    };
    const followingpagehandle = ()=> {
      navigation.navigate("Followingpage",{following,followers,username,email,ActivePage,setActivePage,setFollowers,setFollowing});
    };
    const menuhandle = ()=> {
      navigation.navigate("Menu",{following,phone,blocked,accountprivacy,theme,email,setFollowing,setTheme,setPhone});
    };
    const dashboardhandle = ()=> {
      navigation.navigate("Dashboard");
    };
    const edithandle = ()=> {
      navigation.navigate("Edit",{name,username,bio,profilepicture,links,email,setName,setUsername,setBio,setProfilepicture,setLinks});
    };
    console.log(profilepicture)


  return (
    
    <View style={styles.container}>
      <View style={styles.group1}>
        <TouchableOpacity style={styles.leftSection}  onPress={() => setRefreshKey(oldKey => oldKey + 1)}>
          <Text style={styles.text}>{username}</Text>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          {/* Bell icon with notification dot */}
          <TouchableOpacity style={styles.iconWithBadge} onPress={notificationhandle}>
            <NotificationIcon size={30} color="white" style={styles.iconText} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>

          {/* Bars icon with red dot */}
          <TouchableOpacity style={styles.iconWithDot} onPress={menuhandle}>
            <MenuIcon size={45} color="white" style={styles.iconText} />
            {/* <View style={styles.dot}></View> */}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (<ScrollView 
        style={styles.scrollcontainer}
        ref={scrollViewRef}
      >
        <View style={styles.group2}>
          <TouchableOpacity onPress={fullscreenprofile}>
            <Image
                source={{ uri: profilepicture }} // Use dynamic URI for the profile picture
                style={styles.profilepic}
            />
          </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={() => scrollToPosition(400)}>
                <Text style={styles.followingtext} >Post</Text>
                <Text style={styles.followingtext}>{post}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={()=>{
              setActivePage("followers")
              followingpagehandle()}}>
                <Text style={styles.followingtext}>Followers</Text>
                <Text style={styles.followingtext}>{Array.isArray(followers) ? followers.length : 0}</Text>
                </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={()=>{
              setActivePage("following")
              followingpagehandle()}}>
                <Text style={styles.followingtext}>Following</Text>
                <Text style={styles.followingtext}>{Array.isArray(following) ? following.length : 0}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group3}>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.link}>{email}</Text>
            <Text style={styles.username}>{phone}</Text>
            <Text style={styles.bio}>{bio}</Text>

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
                source={{ uri: profilepicture }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.postInfo}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.time}>{timeDifference(post.createdat)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.elipsecontainer} onPress={() => {toogleoption(saved,favorite,post.id,post.category,post.privacy,post.content,post.media,post.backgroundcolor)}}>
                <MoreOptionIcon size={30} color="white" style={styles.icon} />
              </TouchableOpacity>
            </View>

            {post.media ? (
              <View>
              <Text style={styles.postContent}>{post.content}</Text>
              <Image
                source={{uri : post.media}}// Use the fetched image URL
                style={styles.postpicture}
              />
              </View>
            ) : 
            <View style={[styles.posttextcontainer, { backgroundColor: post.backgroundcolor || 'blue' }]}>
              <Text style={styles.posttext}>{post.content}</Text>
            </View>
            
            }

            {/* Post Footer (likes, comments) */}
            <View style={styles.posticonContainer}>
              <View style={styles.iconWithTextcontainer}>
                <TouchableOpacity style={styles.iconWithText}>
                {post.liked ? (
                    <TouchableOpacity onPress={()=>{handleLike(post.id,email,true)}}><LikeIcon size={30} color="red" fill="red" style={styles.icon} /></TouchableOpacity>
                    ) : (
                    <TouchableOpacity onPress={()=>{handleLike(post.id,email,false)}}><LikeIcon size={30} color="white" style={styles.icon} /></TouchableOpacity>
                )}
                  <Text style={styles.iconText}>{post.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWithText} onPress={()=>{togglecomment(post.comments,post.id)}}>
                <CommentIcon size={30} color="white" style={styles.icon} />
                  <Text style={styles.iconText}>{post.comments.length}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        </View>
      </ScrollView>)}
      
      {imageModalVisible && (
        <Modal transparent={false} animationType="slide" visible={imageModalVisible} onRequestClose={closeImageModal}>
          <View style={styles.imageModalContainer}>
            {/* Back button to close modal */}
            <TouchableOpacity style={styles.imagebackButton} onPress={closeImageModal}>
              <BackButton size={35} color="white" />
            </TouchableOpacity>

            {/* Fullscreen profile picture */}
            <Image source={{uri: profilepicture}} style={styles.fullScreenImage} resizeMode="contain" />
          </View>
        </Modal>
      )}
                    
      { optionmodalVisible && (<Modal
                transparent={true}
                animationType="none"
                visible={optionmodalVisible}
                onRequestClose={closeoption}
  >
      <TouchableOpacity style={styles.modalBackground} onPress={closeoption}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
              <Animated.View style={[styles.modalContent, slideUpStyle]}>
                  <TouchableOpacity style={styles.closeButton} onPress={closeoption}>
                      <CloseButton size={30} color={"white"}/>
                  </TouchableOpacity>
                  <View style={styles.savedcontainer}>
                    {addedtosave ?(
                    <TouchableOpacity style={styles.savedbtn} onPress={()=>{handlesavepost(postidsave, email, addedtosave)}}>
                        <RemovingIcon size={30} color={"white"}/>
                        <Text style={styles.savedtext}>Remove from Saved </Text>
                    </TouchableOpacity>):(
                    <TouchableOpacity style={styles.savedbtn} onPress={()=>{handlesavepost(postidsave, email, addedtosave)}}>
                        <AddIcon size={30} color={"white"}/>
                        <Text style={styles.savedtext}>Add to Saved</Text>
                    </TouchableOpacity>)}
                    {addedtofavorite ?(
                    <TouchableOpacity style={styles.savedbtn} onPress={()=>{handleaddfavourites(postidsave, email, addedtosave)}}>
                        <BookmarkRemove size={30} color={"white"}/>
                        <Text style={styles.savedtext}>Remove from Favourites</Text>
                    </TouchableOpacity>):(
                    <TouchableOpacity style={styles.savedbtn} onPress={()=>{handleaddfavourites(postidsave, email, addedtosave)}}>
                        <Bookmark size={30} color={"white"}/>
                        <Text style={styles.savedtext}>Add to  Favourites</Text>
                    </TouchableOpacity>)}
                  </View>
                  <View>
                    <TouchableOpacity style={styles.savedbtn} onPress = {()=>{gotoAddPost()}}>
                        <EditIcon size={30} color={"white"}/>
                        <Text style={styles.savedtext}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.savedbtn} onPress={()=>deletePostById(postidsave)}>
                        <BinIcon size={30} color={"red"}/>
                        <Text style={styles.savedtext}>Delete</Text>
                    </TouchableOpacity>
                  </View>
              </Animated.View>
          </TouchableOpacity>
      </TouchableOpacity>
       </Modal>
      )}
      {commentmodalVisible && (<Modal
                   transparent={true}
                   animationType="none"
                   visible={commentmodalVisible}
                   onRequestClose={closecomment}
               >
                   <TouchableOpacity style={styles.modalBackground} onPress={closecomment}>
                       <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                           <Animated.View style={[styles.modalContentcomment, slideUpStylecomment]}>
                               <View style={styles.closeButtoncomment} >
                                   <Text style={styles.commentheader}>Comments</Text>
                                   <TouchableOpacity onPress={closecomment} ><CloseButton size={30} color={"white"}/></TouchableOpacity>
                               </View>
                               <View style={styles.commentline}/>
                               {commentloading ?(
                                <View style={styles.commentsloading}>
                                  <ActivityIndicator color={"white"} size={'small'}/>
                                </View>
                               ):(
                                <ScrollView>
                                  {postcomments.map((comment,index)=>{

                                    return (
                                      <View key={index}>
                                        <TouchableOpacity   style={styles.postHeader}  onPress={()=>{if (replyto === comment.ownerInfo?.username) {
                                            setReplyto(''); // Clear reply if it's already set to this username
                                          } else {
                                            replytouser(comment.ownerInfo?.username,comment.ownerInfo?.email); // Set reply to the clicked username
                                          }}}>
                                          <TouchableOpacity>
                                          <Image
                                            source={{uri : comment.ownerInfo?.profilepic}}
                                            style={styles.avatar}
                                          />
                                          </TouchableOpacity>
                                          <View style={styles.commentInfo}>
                                            <Text style={styles.username}>{comment.ownerInfo?.username} <Text style={styles.timecomment}>{timeDifference(comment.createdat)}</Text></Text>
                                            <Text style={styles.commentcontent}>{comment.content}</Text>
                                          </View>
                                          <TouchableOpacity style={styles.elipsecontainer} onPress={()=>{addCommentLikes(comment.id,comment.liked)}}>
                                          {comment.liked ? (
                                                <LikeIcon size={24} color="red" fill='red' style={styles.icon} />
                                              ) : (
                                                <LikeIcon size={24} color="white"  style={styles.icon} />
                                              )}
                                          <Text style={styles.iconTextcomment}>{comment.likes.length}</Text>
                                          </TouchableOpacity>
                                        </TouchableOpacity>
                                        <View style={styles.commentbutton}>
                                          {comment.mine && (
                                         <>
                                          <TouchableOpacity onPress={()=>{if (editcomment) { setEditcomment(false),setComment(""),setCurrentcommentid("")}else{editmycomment(comment.id,comment.content)}}}>
                                          <     Text style={styles.commentbttontext}>{editcomment ? "Cancel" : "Edit"}</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={()=>{deletecomment(comment.id,postidcomment)}}>
                                                <Text style={styles.commentbttontext}>Delete</Text>
                                          </TouchableOpacity>
                                          </>
                                          )}

                                        </View>
                                      </View>
                                    )
                                  })}
                                  
                                </ScrollView>)}

                                {replyto.length > 0  && ( 
                                  <View style={styles.replyicon}>
                                    <Text style={styles.replytext}>Reply to {replyto}</Text>
                                    <TouchableOpacity onPress={()=>{setReplyto("")}}><CloseButton size={24} color='white'/></TouchableOpacity>
                                </View>
                                )}
                               <View style={styles.inputContainer}>
                                   <Image
                                       source={{uri: profilepicture}}
                                       style={styles.avatar}
                                     />
                                   <TextInput
                                     style={styles.input}
                                     placeholder={`Comment as ${username}`}
                                     placeholderTextColor="gray"
                                     value={comment}
                                     onChangeText={setComment}
                                   />
                                   {comment !== '' && (
                                      <TouchableOpacity 
                                        onPress={() => {
                                          if (editcomment) {
                                            // Call the update function if in edit mode
                                            handleupdatecomment();
                                          } else {
                                            // Call the add function if not in edit mode
                                            handdlesendcomment(postidcomment);
                                          }
                                        }}
                                      >
                                        <Text style={styles.inputIcon}>
                                          {loadingcomment ? (
                                            <ActivityIndicator size="small" color={editcomment ? "white" : "#007AFF"} />
                                          ) : (
                                            <CircleUp size={40} color={editcomment ? "white" : "#007AFF"} />
                                          )}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                 </View>
                           </Animated.View>
                       </TouchableOpacity>
                   </TouchableOpacity>
      </Modal>)}
      
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
  width: width,
  marginLeft: 3,
},
postpicture:{
  width: "110%",
  height: 380,
  marginBottom: 10,
  marginTop: 20,
  marginLeft: -30,
},
postContainer: {
  padding: 15,
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
posttext: {
  color: 'white',
  fontSize:24,
  width: "90%",
  alignItems: 'center',
},
iconWithText: {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 30,
},
iconWithTextcontainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
iconText: {
  color: 'white',
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
posttextcontainer:{
  flex:1,
  marginTop: 30,
  marginBottom: 20,
  justifyContent: 'center',
  alignItems: 'center',
  height: 250,
  width: "100%",
  backgroundColor: 'blue',
  borderRadius: 20,
},
loadingContainer:{
  alignItems: 'center',
  marginTop: 25,
}, modalBackground: {
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
  padding: 15,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  height: "50%",
},
modalContentcomment: {
backgroundColor: 'black',
padding: 15,
borderTopLeftRadius: 30,
borderTopRightRadius: 30,
height: "100%",
},
modalText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 15,
},
modalTextred: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'black',
  color:"red",
  marginBottom: 15,
},
closeButton: {
alignItems: 'flex-end',
  marginLeft: -10,
  // borderBottomColor: 'gray', // Set the color of the bottom border
  // borderBottomWidth: 1,   
},
closeButtoncomment: {
alignItems: 'flex-end',
marginLeft: -10,
marginTop: -5,
justifyContent: 'space-between',
flexDirection: 'row',
marginBottom: -9,
  // borderBottomColor: 'gray', // Set the color of the bottom border
  // borderBottomWidth: 1,   
},
commentheader:{
fontSize: 18,
fontWeight: 'bold',
color: 'white',
marginLeft: 10,

},
commentline:{
height: 1,
backgroundColor: 'grey',
marginTop: 20,
marginLeft: -20,
width: "120%",
},
closeButtonText: {
  marginBottom: 10,
  color: 'red',
  fontSize: 16,
  fontWeight: 'bold',
},
savedcontainer:{
flexDirection: 'column',
marginBottom: 10,
borderBottomColor: 'gray', // Set the color of the bottom border
borderBottomWidth: 1,  
},
savedbtn:{
flexDirection: 'row',
marginBottom: 10,
marginTop:10,
alignItems: 'center',
},

savedtext: {
marginLeft: 20,
color: 'white',
fontSize: 20,
fontWeight: 'bold',
},
inputContainer: {
flexDirection: 'row',
alignItems: 'center',
padding: 10,
borderTopWidth: 1,
borderColor: 'gray',
},
input: {
flex: 1,
padding: 10,
borderWidth: 1,
borderColor: 'gray',
borderRadius: 20,
color:"white",
marginLeft: 10,
marginRight: 10,
},
loadingContainer: {
flex: 1,
marginTop:24,
alignItems: 'center',
},
usernameplaceholder:{
width: '100%',
flexDirection: 'row',
alignItems: 'center',

},
profilePicPlaceholder: {
width: 50,
height: 50,
borderRadius: 25,  // Circular profile picture
backgroundColor: 'gray',  // Light gray
marginBottom: 20,
},
user: {
width: 150,
height: 15,
borderRadius: 25,  // Circular profile picture
backgroundColor: 'gray',  // Light gray
marginBottom: 5,
},
timeholder: {
width: 80,
height: 15,
borderRadius: 25,  // Circular profile picture
backgroundColor: 'gray',  // Light gray
marginBottom: 5,
},
usernameelement:{
marginTop: -18,
marginLeft: 10,
},
postPlaceholder: {
width: '100%',
height: 200,
backgroundColor: 'gray',  // Slightly darker gray for post
borderRadius: 10,
marginBottom: 10,
},
replyicon: {
flexDirection: 'row',
padding: 10,
maxWidth: '110%',
height: 50,
alignItems: 'center',
justifyContent: 'space-between',
backgroundColor: '#2c2c2c', // Makes the icon background transparent
},

replytext: {
color: 'white', // Adjust this to white for better visibility on black background
marginLeft: 15,
fontWeight: 'bold',
},
buttoncontainerfollow:{
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginTop: 10,
},
buttonsendmessagebtn:{
padding: 10,
backgroundColor: '#007AFF',
borderRadius: 10,
marginTop:8,
justifyContent: 'center',
alignContent: 'center',

},
imageModalContainer: {
flex: 1,
backgroundColor: 'black',
justifyContent: 'center',
alignItems: 'center',
},
fullScreenImage: {
width: '100%',
height: '100%',
},
imagebackButton: {
position: 'absolute',
top: 10,
left: 10,
zIndex: 1,
},
commentsloading:{
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  height:"85%"

},
commentInfo: {
  flex: 1,
  marginLeft: 10,
  marginTop : 10,
  marginBottom: 10,
},

commentcontent:{
  color: '#f2f2f2',
  fontWeight: '400',
  fontSize: 15,
},
iconTextcomment:{
  color: 'grey',
  fontSize: 15,
  fontWeight: 'bold',
  marginTop : 5,
  right : 6,

},
commentbutton:{
  flexDirection: 'row',
  marginLeft:40,
  width:200,
},
commentbttontext:{
  color: 'gray',
  fontSize: 15,
  fontWeight: 'bold',
  marginLeft:10,
},
});