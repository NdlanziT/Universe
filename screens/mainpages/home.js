import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import React, { useEffect, useState,useRef,useCallback,useMemo } from 'react';

import { db,storage,auth} from '../../firebase';
import { collection, getDocs, doc, getDoc, query, where,limit,updateDoc,arrayRemove,arrayUnion,deleteDoc,setDoc,onSnapshot} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import { AddIcon } from '../icons/add_circle';
import { SearchIcon } from '../icons/search';
import { InboxIcon } from '../icons/inbox';
import { MoreOptionIcon } from '../icons/more-vertical';
import { CommentIcon } from '../icons/comment';
import { LikeIcon } from '../icons/like';
import { BackButton } from '../icons/back';
import { Bookmark } from '../icons/bookmark';
import { UserMinusIcon } from '../icons/user-minus';
import { ClosedEye } from '../icons/closedeye';
import { UserInfoIcon } from '../icons/userinfo';
import { CloseButton } from '../icons/close';
import { CircleUp } from '../icons/arrow_circle_up';
import { CameraIcon } from '../icons/camera';
import { EditIcon } from '../icons/edit';
import { RemovingIcon } from '../icons/remove';
import { BookmarkRemove } from '../icons/bookmarkremove';
import { AddFollower } from '../icons/addfollower';

// Get screen dimensions
const { width, height } = Dimensions.get('window');



const Home = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [optionmodalVisible, setoptionModalVisible] = useState(false);
  const [commentmodalVisible, setCommentModalVisible] = useState(false);
  const [liked,setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [loading,setLoading] = useState(true);
  const [contentloading,setContentLoading] = useState(true)
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [myemail,setMyEmail] = useState('');
  const [following,setFollowing] = useState([]);
  const [users,setUsers] = useState([]);
  const [myusername,setMyUsername] = useState('');
  const [post,setPost] = useState([])
  const [saved,setSaved] = useState([])
  const [favorite,setFavorite] = useState([])
  const [unfollowingpost,setUnfollowingPost] = useState([])
  const [myprofilepicture,setProfilePicture] = useState('')
  const currentUserId = auth.currentUser?.email
  const [collectedpostid,setCollectedpostid] = useState([]);
  const [postidsave,setPostidsave]= useState("")
  const [useremailfollow,setUseremailfollow]= useState("")
  const [addedtosave,setAddedtosave] = useState(false);
  const [addedtofavorite,setAddedtofavorite] = useState(false);
  const [followsuserstate,setFollowsuserstate] = useState(false);
  const [me,setME] = useState(false);
  const [postcomments,setPostComments] = useState([]);
  const [commentloading,setCommentLoading] = useState(true);
  const [replybar,setReplybar] = useState(false);
  const [replyto,setReplyto] = useState("");
  const [editcomment,setEditcomment] = useState(false);
  const [postidcomment,setPostidcomment] = useState("");
  const [loadingcomment,setloadingcomment] = useState(false);
  const [currentcommentid,setCurrentcommentid] = useState("");
  const [currentpostpic,setCurrentpostpic] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;

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

const handleLike = (postid, myemail, state) => {
  if (state) {
    setPost(prevPost =>
      prevPost.map(post => 
        post.id === postid ? { ...post,
           liked: false,
           likes: post.likes.filter(email => email !== myemail)
           } : post
      )
    );
    removeValueFromLikes(postid, 'likes', myemail);
  } else {
    setPost(prevPost =>
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
const handleaddfollowings = async (useremail, myemail, state) => {
  if (state) {
    // If the user is already followed, remove them from both 'following' and 'followers'
    await removeValueFromSaved(myemail, 'following', useremail);  // Remove useremail from myemail's following list
    await removeValueFromSaved(useremail, 'followers', myemail);  // Remove myemail from useremail's followers list
    setFollowing((prev) => prev.filter((email) => email !== useremail)); 
    closeoption()

  } else {
    // If the user is not followed, add them to both 'following' and 'followers'
    await addValueToSaved(myemail, 'following', useremail);  // Add useremail to myemail's following list
    await addValueToSaved(useremail, 'followers', myemail);  // Add myemail to useremail's followers list
    setFollowing((prev) => [...prev, useremail]);
    closeoption()
  }
};

const handlehide = ()=>{

}

const fullscreenprofile = (pic) => {
  setImageModalVisible(true);
  setCurrentpostpic(pic);
};

const closeImageModal = () => {
  setImageModalVisible(false);
  setCurrentpostpic('');
};



  const handleSend = () => {
    // Handle sending the message
    console.log('Message sent:', message);
    setMessage('');
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
                likes: arrayUnion(myemail), // Add myemail to the likes array
            });

            // Update the local state
            setPostComments(prevComments => 
                prevComments.map(comment => 
                    comment.id === commentId // Find the specific comment
                        ? { 
                            ...comment, 
                            liked: true, // Set liked to true
                            likes: [...comment.likes, myemail] // Add myemail to the local likes array
                        } 
                        : comment // Return the comment unchanged if it doesn't match
                )
            );

            console.log("Liked the comment!");
        } else {
            // Unliking the comment
            await updateDoc(commentRef, {
                likes: arrayRemove(myemail), // Remove myemail from the likes array
            });

            // Update the local state
            setPostComments(prevComments => 
                prevComments.map(comment => 
                    comment.id === commentId // Find the specific comment
                        ? { 
                            ...comment, 
                            liked: false, // Set liked to false
                            likes: comment.likes.filter(email => email !== myemail) // Remove myemail from the local likes array
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
    const commentid = `${currentUserId}_${Date.now()}`;
    try {
      const userRef = doc(db, 'comments', commentid);
      await setDoc(userRef, {
          content: comment,
          createdat: postdate(),
          likes: [], 
          owner: currentUserId,
          id : commentid,
          replies: [],
      });
      addValueToLikes(postidcomment,'comments',commentid)
      const newComment = {
        id: commentid,
        content: comment,
        createdat: postdate(),
        owner: currentUserId,
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

  const scrollViewRef = useRef(null);
    const scrollToPosition = (position) => {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    };

    async function fetchFollowingsPosts(currentUserId,myfollowing) {
      try {
        const postsCollectionRef = collection(db, "post");
        const querySnapshot = await getDocs(postsCollectionRef);
    
        // Process posts asynchronously
        const posts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            postData.id = doc.id;
    
            // Fetch user information for the post owner
            const user = await fetchUserById(postData.owner);
    
            // Fetch media URL (replace 'postData.media' if argument is needed)
            postData.media = await fetchPostPictureURL(postData.media);
            postData.followsuserstate = false
    
            // Check if the post is liked by the current user
            postData.liked = postData.likes && postData.likes.includes(currentUserId);
    
            if (user) {
              postData.ownerInfo = {
                name: user.name,
                username: user.username,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                post: user.post,
                email: user.email,
                profilepic: user.profilepicture,
              };
              // Determine if the post belongs to the current user
              postData.mine = user.email === currentUserId;
              postData.followsuserstate = myfollowing.includes(user.email)
            }
    
            return postData;
          })
        );
    
        // Update state with the fetched posts
        setPost(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    
    
  const fetchProfilePictureURL = async (fileName) => {
    try {
      const storageRef = ref(storage, fileName ? `profilepictures/${fileName}` : `profilepictures/download.png`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error fetching the profile in  profile picture:', error);
  
      // If the specified file does not exist, fetch the default download.png
      if (error.code === 'storage/object-not-found') {
        try {
          const defaultStorageRef = ref(storage, `profilepictures/download.png`);
          const defaultUrl = await getDownloadURL(defaultStorageRef);
          return defaultUrl;
        } catch (defaultError) {
          console.error('Error fetching default profile picture:', defaultError);
          return null;
        }
      }
  
      return null; // Return null for other types of errors
    }
  };
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
  const fetchCurrentUserData = useCallback (async () => {
    try {
      const userData = await fetchUserById(currentUserId);
      if (userData) {
        setMyEmail(userData.email);
        setFollowing(userData.following);
        setUsers([userData]);
        setProfilePicture(userData.profilepicture);
        setFavorite(userData.favourites);
        setSaved(userData.saved);
        setMyUsername(userData.username);
      }
    } catch (error) {
      console.error("Error fetching current user data:", error);
    } finally {
      setContentLoading(false); // Set loading to false when fetch is complete
    }
  }, [currentUserId]);

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
          commentData.liked = commentData.likes.includes(currentUserId);
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
            if (user.email === currentUserId){
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


  const gotoprofile = (username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail,saved,favorite)=>{
    navigation.navigate("Userprofile",{username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail,saved,favorite,setSaved,setFavorite,myprofilepicture,myusername: username})
}

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


  const toogleoption = (saved,favorites,useremail,following,postid) =>{
    setAddedtosave(saved.includes(postid));
    setAddedtofavorite(favorites.includes(postid));
    setFollowsuserstate(following.includes(useremail));
    setPostidsave(postid)
    setUseremailfollow(useremail)
    if (useremail == currentUserId){
      setME(true)
    }
    
    
    openoptionModal()

  }

  const closeoption = ()=>{
    closeoptionModal()
    setAddedtofavorite(false)
    setAddedtosave(false)
    setFollowsuserstate(false)
    setPostidsave('')
    setUseremailfollow('')
    setME(false)
  }

  const opencommentModal = () => {
    setCommentModalVisible(true);
    Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
};

  const openoptionModal = () => {
    setoptionModalVisible(true);
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
// Close edit modal
  const closeoptionModal = () => {
      Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      }).start(() => setoptionModalVisible(false));
  };
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

  const gotoMessage = () => {
    navigation.navigate('Inbox')
  };

  const gotoAddPost = () => {
    navigation.navigate('AddPost',{postype : "new"});
  };
  useEffect(() => {
    fetchCurrentUserData();
  }, [currentUserId]);
  
  useEffect(() => {
    console.log(following)
    const fetchData = async () => {
        try {
          await fetchFollowingsPosts(currentUserId,following);
        } catch (error) {
          console.error("Error fetching followings posts:", error);
        } finally {
          setLoading(false); // Set loading to false once fetching completes

        }
    };
    fetchData();
  }, []); // Add 'following' dependency to re-fetch when the following list changes


  


  useEffect(() => {
    if (loading) {
      // Animation runs when loading is true
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,  // Fade to 50% opacity
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,  // Fade back to full opacity
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // Stop animation when loading is false
      fadeAnim.setValue(1);
    }
  }, []);



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
            <AddIcon size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageIconContainer}>
            <SearchIcon size={34} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageIconContainer} onPress={gotoMessage}>
            <InboxIcon size={30} color="white" style={styles.icon} />
            <View style={styles.redDot} />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
              <Animated.View style={{ ...styles.loadingContainer, opacity: fadeAnim }}>
              <View style={styles.usernameplaceholder}>
                <View style={styles.profilePicPlaceholder} />
                <View style={styles.usernameelement}>
                  <View style={styles.user} />
                  <View style={styles.timeholder} />    
                </View>
              </View>
              <View style={styles.postPlaceholder} />
              <View style={styles.usernameplaceholder}>
                <View style={styles.profilePicPlaceholder} />
                <View style={styles.usernameelement}>
                  <View style={styles.user} />
                  <View style={styles.timeholder} />    
                </View>
              </View>
              <View style={styles.postPlaceholder} />
            </Animated.View>
            ) : (
                // Show the ScrollView with posts when loading is false
                <ScrollView style={styles.ScrollViewcontainer}>
                    {post.map((post, index) => (
                        <View key={index} style={styles.postContainer}>
                            <View style={styles.postHeader}>
                                <Image source={{uri :post.ownerInfo?.profilepic}} style={styles.avatar} />
                                <TouchableOpacity style={styles.postInfo} onPress={()=>{gotoprofile(post.ownerInfo?.username,post.ownerInfo?.profilepic,post.ownerInfo?.name,post.ownerInfo?.email,post.ownerInfo?.bio,post.ownerInfo?.post,post.ownerInfo?.followers,post.ownerInfo?.following,following,currentUserId,saved,favorite)}}>
                                    <Text style={styles.username}>{post.ownerInfo?.username}</Text>
                                    <Text style={styles.time}>{timeDifference(post.createdat)} ago</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.elipsecontainer} onPress={() => {toogleoption(saved,favorite,post.ownerInfo?.email,following,post.id)}}>
                                    <MoreOptionIcon size={30} color="white" style={styles.icon} />
                                </TouchableOpacity>
                            </View>

                            {/* Post Content */}
                            {post.media ? (
                                <View >
                                    <Text style={styles.postContent}>{post.content}</Text>
                                    <TouchableWithoutFeedback onPress={()=>{fullscreenprofile(post.media)}}><Image source={{uri : post.media}} style={styles.postpicture} /></TouchableWithoutFeedback>
                                </View>
                            ) : (
                              <View style={[styles.posttextcontainer, { backgroundColor: post.backgroundcolor || 'blue' }]}>
                              <Text style={styles.posttext}>{post.content}</Text>
                            </View>
                            )}

                            {/* Post Footer (likes, comments) */}
                            <View style={styles.posticonContainer}>
                                <View style={styles.iconWithTextcontainer}>
                                    <View style={styles.iconWithText}>
                                        {post.liked ? (
                                            <TouchableOpacity onPress={()=>{handleLike(post.id,myemail,true)}}><LikeIcon size={30} color="red" fill="red" style={styles.icon} /></TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={()=>{handleLike(post.id,myemail,false)}}><LikeIcon size={30} color="white" style={styles.icon} /></TouchableOpacity>
                                        )}
                                        <Text style={styles.iconText}>{post.likes.length}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.iconWithText} onPress={()=>{togglecomment(post.comments,post.id)}}>
                                        <CommentIcon size={30} color="white" style={styles.icon} />
                                        <Text style={styles.iconText}>{post.comments.length}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {!post.mine && (
                            <View style={styles.buttoncontainerfollow}>
                              <TouchableOpacity style={styles.buttonsendmessagebtn}>
                                <Text style={styles.username}>Send message</Text>
                              </TouchableOpacity>
                              {!post.followsuserstate && (
                              <TouchableOpacity style={styles.buttonsendmessagebtn} onPress={()=>{handleaddfollowings(post.ownerInfo?.email,currentUserId,false)}}>
                                <Text style={styles.username}>Follow</Text>
                              </TouchableOpacity>)}
                            </View>
                          )}
                        </View>
                        
                        
                    ))}
                    
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
                                  <TouchableOpacity style={styles.savedbtn} onPress={()=>{handlesavepost(postidsave, myemail, addedtosave)}}>
                                      <RemovingIcon size={30} color={"white"}/>
                                      <Text style={styles.savedtext}>Remove from Saved </Text>
                                  </TouchableOpacity>):(
                                  <TouchableOpacity style={styles.savedbtn} onPress={()=>{handlesavepost(postidsave, myemail, addedtosave)}}>
                                      <AddIcon size={30} color={"white"}/>
                                      <Text style={styles.savedtext}>Add to Saved</Text>
                                  </TouchableOpacity>)}
                                  {addedtofavorite ?(
                                  <TouchableOpacity style={styles.savedbtn} onPress={()=>{handleaddfavourites(postidsave, myemail, addedtosave)}}>
                                      <BookmarkRemove size={30} color={"white"}/>
                                      <Text style={styles.savedtext}>Remove from Favourites</Text>
                                  </TouchableOpacity>):(
                                  <TouchableOpacity style={styles.savedbtn} onPress={()=>{handleaddfavourites(postidsave, myemail, addedtosave)}}>
                                      <Bookmark size={30} color={"white"}/>
                                      <Text style={styles.savedtext}>Add to  Favourites</Text>
                                  </TouchableOpacity>)}
                                </View>
                                <View>
                                  {!me ? (
                                  <>
                                  <TouchableOpacity style={styles.savedbtn}>
                                      <UserInfoIcon size={30} color={"red"}/>
                                      <Text style={styles.savedtext}>Report</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.savedbtn} onPress={()=>{handleaddfollowings(useremailfollow, myemail, followsuserstate)}}>
                                      {followsuserstate ? (< UserMinusIcon size={30} color={"white"}/>):(<AddFollower  size={30} color={"white"}/>)}
                                      <Text style={styles.savedtext}>{followsuserstate ? "Unfollow" : "Follow"}</Text>
                                  </TouchableOpacity>
                                  </>
                                  ):(null)}

                                  <TouchableOpacity style={styles.savedbtn}>
                                      <ClosedEye size={30} color={"white"}/>
                                      <Text style={styles.savedtext}>Hide</Text>
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
                                                        <TouchableOpacity onPress={()=>{gotoprofile(comment.ownerInfo?.username,comment.ownerInfo?.profilepic,comment.ownerInfo?.name,comment.ownerInfo?.email,comment.ownerInfo?.bio,comment.ownerInfo?.post,comment.ownerInfo?.followers,comment.ownerInfo?.following,following,currentUserId,saved,favorite),closecommentModal()}}>
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
                                                     source={{uri: myprofilepicture}}
                                                     style={styles.avatar}
                                                   />
                                                 <TextInput
                                                   style={styles.input}
                                                   placeholder={`Comment as ${myusername}`}
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
                    {imageModalVisible && (
                        <Modal transparent={false} animationType="slide" visible={imageModalVisible} onRequestClose={closeImageModal}>
                          <View style={styles.imageModalContainer}>
                            {/* Back button to close modal */}
                            <TouchableOpacity style={styles.imagebackButton} onPress={closeImageModal}>
                              <BackButton size={35} color="white" />
                            </TouchableOpacity>

                            {/* Fullscreen profile picture */}
                            <Image source={{uri: currentpostpic}} style={styles.fullScreenImage} resizeMode="contain" />
                          </View>
                        </Modal>
                      )}
                </ScrollView>
            )}
            

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
    width: width,
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
  redDot: {
    position: 'absolute',
    top: -3, // Adjust this value to position the dot correctly
    right: -3, // Adjust this value to position the dot correctly
    height: 12,
    width: 12,
    backgroundColor: 'red',
    borderRadius: 5, // Make it circular
  },
  appname: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
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
  commentbutton:{
    flexDirection: 'row',
    marginLeft:40,
    width:200,
  },
  commentsloading:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height:"85%"

  },
  commentbttontext:{
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft:10,
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
  commentInfo: {
    flex: 1,
    marginLeft: 10,
    marginTop : 10,
    marginBottom: 10,
  },
  elipsecontainer:{
    width: 100,
    borderRadius: 5,
    alignItems: 'flex-end',
  },
  iconTextcomment:{
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop : 5,
    right : 6,

  },
  username: {
    color: '#f2f2f2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentcontent:{
    color: '#f2f2f2',
    fontWeight: '400',
    fontSize: 15,
  },
  time: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop : 5,
  },
  timecomment:{
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop : 5,
    marginLeft : 19,

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
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: "100%",
    borderRadius: 20,
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
});
