import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import { db } from '../../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { query, collection, getDocs, where,updateDoc,arrayUnion, setDoc,doc,onSnapshot } from 'firebase/firestore';
import { BackButton } from '../icons/back';
import { CameraIcon } from '../icons/camera';
import { SendIcon } from '../icons/send';
import { CloseButton } from '../icons/close';

const Messagespage = ({ navigation, route }) => {
  const { user_profilepiture, user_username, user_name, user_following, user_post, user_email, user_followers, messages_id, following, myemail, saved, favorite,chatid,existing,setSaved,setFavorite,myprofilepicture,myusername,user_bio } = route.params;
  const [newuser,setnewuser] = useState(existing)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [message_array, set_MessageArray] = useState(messages_id)
  const [messageloading,setmessageloading] = useState(false)
  const [deleteloading,setDeleteloading] = useState(false)
  const [chatidd,setchatidd]= useState(chatid)

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

  function checkFollowStatus(myFollowing, userFollowing, myEmail, userEmail) {
    const iFollowUser = myFollowing.includes(userEmail);
    const userFollowsMe = userFollowing.includes(myEmail);

    if (iFollowUser && userFollowsMe) {
      return "You both follow each other";
    } else if (userFollowsMe && !iFollowUser) {
      return "User follows you, but you don’t follow them";
    } else if (iFollowUser && !userFollowsMe) {
      return "You follow the user, but they don’t follow you";
    } else {
      return "You don’t follow each other";
    }
  }

  const followstate = checkFollowStatus(following, user_following, myemail, user_email);

  const fetchMessages = (ids) => {
    // Stop the function if the ids array is empty
    if (!ids || ids.length === 0) {
      console.warn("No message IDs provided; stopping fetchMessages.");
      return;
    }
  
    const messageCollectionRef = collection(db, 'messages');
    const messageQuery = query(messageCollectionRef, where('id', 'in', ids));
  
    // Set up a listener for real-time updates
    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => {
        const messageData = { id: doc.id, ...doc.data() };
        messageData.sender = messageData.sender === myemail ? "me" : "other";
        return messageData;
      });
  
      // Sort messages from newest to oldest
      const sortedMessages = fetchedMessages.sort((a, b) => {
        const dateA = new Date(a.createddat);
        const dateB = new Date(b.createddat);
        return dateA - dateB; // Sort from newest to oldest
      });
  
      // Update the state with the sorted messages
      setMessages(sortedMessages);
    }, (error) => {
      console.error('Error listening for message updates:', error);
    });
  
    return unsubscribe;
  };
  
  const updateChatFields = async (chatId, myEmail, currentMessage,newMessageId) => {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            lastmessageowner: myEmail,
            message: currentMessage,
            read: false,
            messageid: arrayUnion(newMessageId),
        });
    } catch (error) {
        console.error("Error updating chat fields:", error);
    }
};

const sendnewmessage = async () => {
  // Reference the messages collection
  const collectionRef = collection(db, 'messages');
  
  // Generate unique IDs for the message and chat
  let id = `${myemail}_${user_email}_${postdate()}_${Date.now()}`;
  let newchatid = `${myemail}_${user_email}_${Date.now()}`;
  
  // Document for the new message
  const newDocument = {
    content: message,
    createddat: postdate(),
    id: id,
    sender: myemail,
  };

  // Data structure for the chat document
  const chatData = {
    id: newchatid,
    lastmessageowner: myemail,
    members: [user_email, myemail],
    message: message,
    messageid: [id],
    read: false
  };

  try {
    // Reference the message document
    const docRef = doc(collectionRef, id);
    
    // Save the message document
    await setDoc(docRef, newDocument);

    if (newuser) {  
      await updateChatFields(chatidd, myemail, message, docRef.id);
      setMessages(prevMessages => [
        ...prevMessages,
        { ...newDocument, sender: "me" }
      ]);

      setMessage(''); 
    } else {
      // Reference the user document
      const userDocRef = doc(db, "users", myemail);
      const otheruserDocRef = doc(db, "users", user_email);

      // Update the user document's chat array to include the new chat ID
      await updateDoc(userDocRef, {
        chat: arrayUnion(newchatid)
      });
      await updateDoc(otheruserDocRef, {
        chat: arrayUnion(newchatid)
      });
      // Update messages state
      setMessages(prevMessages => [
        ...prevMessages,
        { ...newDocument, sender: "me" }
      ]);

      // Create a new document in the chats collection for the chat
      const chatDocRef = doc(db, "chats", newchatid);
      await setDoc(chatDocRef, chatData);

      setnewuser(false); // Reset new user flag
      setchatidd(newchatid)
    }
  } catch (error) {
    console.error("Error adding document or updating fields: ", error);
  }
};


const deleteChatfields = async (chatId, myEmail) => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastmessageowner: myEmail,
      message: "message was deleted",
      read: false,
    });
  } catch (error) {
    console.error("Error updating chat fields:", error);
  }
};

const deletemessage = async (lastone,messageid)=>{
    
    try{
      const MessageRef = doc(db, 'messages', messageid);
        await updateDoc(MessageRef, {
            content: 'message was deleted',
        });
      if(lastone){
        await deleteChatfields(chatId, myEmail);
      }
    }catch (error) {

    }
  }

  const gotoprofile = (username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail,saved,favorite)=>{
    navigation.navigate("Userprofile",{username,profilepic,name,email,bio,post,followers,following,myfollowing,myemail,saved,favorite,setSaved,setFavorite,myprofilepicture,myusername})
}

useEffect(() => {
  const unsubscribe = fetchMessages(message_array);

  return () => {
    if (unsubscribe) unsubscribe(); // Cleanup listener if it exists
  };
}, [message_array]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backbtn} onPress={() => navigation.goBack()}>
          <BackButton size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Image source={{ uri: user_profilepiture }} style={styles.smallProfileImage} />
          <View>
            <Text style={styles.name}>{user_username}</Text>
            <Text style={styles.status}>{user_name}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <CloseButton size={30} color="black" />
        </View>
      </View>

      {/* Messages List */}
      <ScrollView contentContainerStyle={styles.messageList}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user_profilepiture }} style={styles.bigProfileImage} />
          <Text style={styles.name}>{user_username}</Text>
          <Text style={styles.username}>{user_name}</Text>
          <Text style={styles.followDetails}>{user_following.length} following · {user_post} post</Text>
          <Text style={styles.followInfo}>{followstate}</Text>
          <TouchableOpacity style={styles.viewProfileButton} onPress={()=>{gotoprofile(user_username,user_profilepiture,user_name,user_email,user_bio,user_post,user_followers,user_following,following,myemail,saved,favorite)}}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
        {messages.map((item, index) => (
          <View key={index} style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.date}>{item.createddat}</Text>
            <View style={styles.row}>
              {item.sender === 'other' && (
                <Image source={{ uri: user_profilepiture }} style={styles.profileImage} />
              )}
              <View style={item.sender === 'me' ? styles.bubbleMe : styles.bubble}>
                <Text style={item.sender === "me" ? styles.messageTextMe : styles.messageText}>{item.content}</Text>
              </View>
            </View>
            {item.sender === 'me' && (
            <View style={styles.editMessageContainer}>
                <TouchableOpacity style={styles.editMessageBtn} onPress={()=>{deletemessage(true,item.id)}}>
                  {deleteloading ? (
                    <ActivityIndicator size="small" color="white" />
                  ):(
                    <Text style={styles.editMessageText}>Delete</Text>
                  )}
                </TouchableOpacity>
            </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send a message."
          placeholderTextColor="gray"
          value={message}
          onChangeText={setMessage}
        />
        {message !== '' ? (
          <TouchableOpacity onPress={()=>{sendnewmessage()}}>
            <Text style={styles.inputIcon}>
              {messageloading ? (
                <ActivityIndicator size="small" color="white" />
              ):(
                <SendIcon size={40} color="#007AFF" />
              )}
              </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 25,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    color:"white"
  },
  editMessageContainer:{
    flexDirection: 'row',         // Align children in a row
    justifyContent: 'flex-end',
    width: "98%",
    marginTop: -25,
    marginRight:5,
  },
  editMessageBtn:{
    marginLeft:-10,
  },
  editMessageText:{
    fontWeight: 'bold',
    color:"gray"
  },
  status: {
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  bigProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    color: '#888',
  },
  followDetails: {
    marginVertical: 5,
    color:"white"
  },
  followInfo: {
    color: '#888',
  },
  viewProfileButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  viewProfileText: {
    color: '#000',
  },
  messageList: {
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'flex-start', // Default to start for 'other' messages
  },
  myMessage: {
    alignItems: 'flex-end', // Align my messages to the end
  },
  otherMessage: {
    alignItems: 'flex-start', // Align other messages to the start
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  bubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  backbtn:{
    marginLeft: 10,
    width: 40,
  },
  bubbleMe: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    color: 'white',
  },
  replyText: {
    color: '#888',
  },
  messageTextme: {
    marginTop: 5,
    color:"white",
  },
  messageText: {
    marginTop: 5,
  },
  date: {
    alignSelf: 'center',
    color: '#888',
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    color:"white"
  },
});

export default Messagespage;