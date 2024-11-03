import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { BackButton } from '../icons/back';
import { db, storage } from '../../firebase';
import { collection, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

const Inbox = ({ navigation, route }) => {
    const { myemail, chat } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [search, setSearch] = useState("");
    const [accounts, setAccounts] = useState([]); 


    const fetchChats = async (ids, currentUser) => {
        if (!ids || ids.length === 0) return;
        try {
            const chatsCollectionRef = collection(db, 'chats');
            const chatsQuery = query(chatsCollectionRef, where('id', 'in', ids));
            const querySnapshot = await getDocs(chatsQuery);

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
                            };
                        }
                    } catch (error) {
                        console.warn(`Error fetching user data for chat ${doc.id}:`, error);
                    }
                    return chatsData;
                })
            );

            setAccounts(fetchedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
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

    useEffect(() => {
        if (chat && myemail) {
            fetchChats(chat, myemail);
        }
    }, [chat, myemail]);

    const handleLongPress = (account) => {
        setSelectedAccount(account);
        setModalVisible(true);
    };

    const handleAccount = (account) => {
        navigation.navigate("Message", { account });
    };

    const handleMarkAsRead = () => {
        Alert.alert("You marked an account as unread");
    };

    const handleDeleteChats = () => {
        Alert.alert("You deleted chats with an account");
    };

    const handleBlock = () => {
        navigation.navigate('Inbox');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
                    <BackButton size={30} color="white" />
                    <Text style={styles.username}>Inbox</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search chats"
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                />
                {accounts.length > 0 ? (
                    accounts.map((account, index) => (
                        <TouchableOpacity
                            key={index}
                            onLongPress={() => handleLongPress(account)}
                            onPress={() => handleAccount(account)}
                            style={styles.accountRow}
                        >
                            <Image source={{ uri: account.ownerInfo.profilepicture }} style={styles.profilePic} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{account.ownerInfo.name}</Text>
                                <Text style={styles.message}>{account.message}</Text>
                            </View>
                            {account.read && <View style={styles.notificationBadge}></View>}
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noChatsText}>No chats available</Text>
                )}
            </ScrollView>

            {/* Modal for options */}
            {selectedAccount && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalOption} onPress={handleDeleteChats}>Delete Chats</Text>
                            <Text style={styles.modalOption} onPress={handleMarkAsRead}>Mark as Unread</Text>
                            <Text style={styles.modalOption} onPress={handleBlock}>Block</Text>
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
        justifyContent: 'space-between',
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
        marginLeft: 10,
        color: 'white',
    },
    searchInput: {
        height: 60,
        backgroundColor: '#2c2c2c',
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
        color: "white",
    },
    message: {
        color: 'gray',
    },
    notificationBadge: {
        backgroundColor: '#3498db',
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    noChatsText: {
        color: 'gray',
        textAlign: 'center',
        marginVertical: 20,
    },
    suggestTitle: {
        fontSize: 18,
        color: 'white',
        marginVertical: 10,
    },
    followButton: {
        backgroundColor: '#3498db',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    followText: {
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalOption: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    modalClose: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 5,
    },
    modalCloseText: {
        fontSize: 16,
    },
});

export default Inbox;
