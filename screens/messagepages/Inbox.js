import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { BackButton } from '../icons/back';
import { db, storage } from '../../firebase';
import { collection, query, getDocs, doc, getDoc, where,updateDoc,onSnapshot,deleteDoc,orderBy } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

const Inbox = ({navigation,route}) => {
    const { myemail,chat,following,saved,favorite } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [accounts, setAccounts] = useState([]); 
    const [currentaccount, setCurrentAccount] = useState('')
    const [alreadyread,setAlreadyRead] = useState(false)

    const fetchChats = (ids, currentUser) => {
        if (!ids || ids.length === 0) return;
    
        const chatsCollectionRef = collection(db, 'chats');
        const chatsQuery = query(chatsCollectionRef, where('id', 'in', ids));
    
        // Set up a real-time listener with onSnapshot
        const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
            const fetchedChats = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const chatsData = { id: doc.id, ...doc.data() };
                    try {
                        const userId = chatsData.members.find(email => email !== currentUser);
                        const user = await fetchUserById(userId);
                        if (user) {
                            chatsData.ownerInfo = {
                                ...user,
                                profilepicture: await fetchProfilePictureURL(user.profilepicture),
                                name: user.name,
                                following: user.following,
                                post: user.post,
                                email: user.email,
                                followers: user.followers,
                            };
                        }
                    } catch (error) {
                        console.warn(`Error fetching user data for chat ${doc.id}:`, error);
                    }
                    return chatsData;
                })
            );
    
            setAccounts(fetchedChats); // Update the state with new data
        }, (error) => {
            console.error('Error fetching chats:', error);
        });
    
        // Return the unsubscribe function to clean up the listener when needed
        return unsubscribe;
    };
    const fetchUserById = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                return { id: userId, ...userDocSnap.data() };
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user by id:", error);
            return null;
        }
    };

    const fetchProfilePictureURL = async (fileName) => {
        try {
            const storageRef = ref(storage, fileName ? `profilepictures/${fileName}` : `profilepictures/download.png`);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error fetching profile picture:', error);
            return null; // Return null if the profile picture is not found
        }
    };
    const markChatAsUnread = async (chatId,state) => {
        try {
          const chatRef = doc(db, 'chats', chatId);
          if (state){
            await updateDoc(chatRef, {
              read: false
            });
          }else{
          await updateDoc(chatRef, {
            read: true
          })}
      
          console.log(`Chat ${chatId} marked as unread`);
        } catch (error) {
          console.error('Error updating chat read status:', error);
        }
      };
      const deleteChat = async (chatId) => {
        if (!chatId) {
            console.error('Chat ID is required to delete a chat.');
            return;
        }
    
        try {
            const chatDocRef = doc(db, 'chats', chatId);
            await deleteDoc(chatDocRef);
            console.log(`Chat with ID ${chatId} has been deleted.`);
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    // useEffect(() => {
    //     if (chat && myemail) {
    //         fetchChats(chat, myemail);
    //     }
    // }, [chat, myemail]);

    useEffect(() => {
        const unsubscribe = fetchChats(chat, myemail);
    
        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup listener on unmount
        };
    },[chat, myemail]);

    const handleLongPress = (account,readedstate) => {
        setModalVisible(true);
        setCurrentAccount(account);
        setAlreadyRead(readedstate);
        
    };
    const handleaccount =(user_profilepiture,user_username,user_name,user_following,user_post,user_email,user_followers,messages_id,chatid,markread)=>{
        navigation.navigate("Message", {user_profilepiture,user_username,user_name,user_following,user_post,user_email,user_followers,messages_id,following,myemail,saved,favorite,chatid })
        if (markread !== myemail){
            markChatAsUnread(chatid,false)
        }
    }
    const handlemarkasreaded =(state)=>{
        markChatAsUnread(currentaccount,state)
        setModalVisible(false)
    }
    const handledeletechats =(chatid)=>{
        Alert.alert(
            "Delete chat",
            `Are you sure you want to delete the chat?`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: async () => {
                  try {
                    await deleteChat(chatid);
                  } catch (error) {
                    console.error("Error deleting post:", error);
                  }finally{
                    setModalVisible(false)
                  }
                },
              },
            ],
            { cancelable: true }
          );
    }
    const handleblock =(chatid)=>{
        Alert.alert(
            "Bloc",
            `Are you sure you want to block this user?`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: async () => {
                  try {
                    await deleteChat(chatid);
                  } catch (error) {
                    console.error("Error deleting chat:", error);
                  }finally{
                    setModalVisible(false)
                  }
                },
              },
            ],
            { cancelable: true }
          );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
                    <BackButton size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.username}>Inbox</Text>
            </View>
            {accounts.length > 0 ?(
            <ScrollView style={styles.container}>
                {accounts.map((account, index) => (
                    <TouchableOpacity
                        key={index}
                        onLongPress={() => {
                            if (!account.read) {
                                handleLongPress(account.id, true);
                            }else{
                                handleLongPress(account.id, false);
                            }
                        }}
                            onPress={()=>handleaccount(account.ownerInfo.profilepicture,account.ownerInfo.username,account.ownerInfo.name,account.ownerInfo.following,account.ownerInfo.post,account.ownerInfo.email,account.ownerInfo.followers,account.messageid,account.id,account.lastmessageowner)}
                            style={styles.accountRow}
                    >
                        <Image source={{ uri: account.ownerInfo.profilepicture }} style={styles.profilePic} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{account.ownerInfo.username}</Text>
                            <Text style={styles.message}>{account.message}</Text>
                        </View>
                        {!account.read && (
                            <View style={styles.notificationBadge}>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
            ):(
            <View style={styles.noAccountsContainer}>
                <Text style={styles.noAccountsText}>No chats available</Text>
            </View>
            )}
            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalOption} onPress={()=>{handledeletechats()}}>Delete chats</Text>
                            {alreadyread ? (
                                <Text style={styles.modalOption} onPress={()=>{handlemarkasreaded(false)}}>Mark as read</Text>
                            ):(
                                <Text style={styles.modalOption} onPress={()=>{handlemarkasreaded(true)}}>Mark as unread</Text>
                            )}
                            <Text style={styles.modalOption}onPress={handleblock}>Block</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: "35%",
        color: 'white',
    },
    noAccountsContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    noAccountsText:{
        color:"white",
        fontSize:20,
    },
    
    searchInput: {
        height: 60,
        backgroundColor: '#2c2c2c', // Dark background similar to Instagram
        color: 'white',
        borderRadius: 10,
        width: "99%",
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color:"white",
    },
    message: {
        color: 'gray',
    },
    notificationBadge: {
        backgroundColor: '#3498db', // Blue color for notification badge
        width: 15,
        height: 15,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    notificationText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    suggestTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: 'gray',
    },
    realName: {
        color: 'gray',
    },
    followButton: {
        backgroundColor: '#3498db',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    followText: {
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#28282B',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalOption: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
        color:"white"
    },
    modalClose: {
        marginTop: 15,
        backgroundColor: '#3498db',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    modalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Inbox;
