import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Inbox = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [search, setSearch] = useState("");

    const accounts = [
        { name: 'Lindorh Kuhle Msibi', message: 'Hello there motherfucker...', image: require('./download.jpg'), newMessages: 3 },
        { name: 'Biggy5slimez', message: 'Hey, how’s it going?', image: require('./download.jpg'), newMessages: 0 },
        { name: 'Aphile😍', message: 'What’s up!', image: require('./download.jpg'), newMessages: 1 },
        { name: 'Instagram User', message: 'Long time no see!', image: require('./download.jpg'), newMessages: 0 },
        { name: 'kharacter', message: 'See you later', image: require('./download.jpg'), newMessages: 2 },
    ];

    const suggestedAccounts = [
        { name: 'User 1', realName: 'name 1', image: require('./download.jpg') },
        { name: 'User 2', realName: 'name 2', image: require('./download.jpg') },
        { name: 'User 3', realName: 'name 3', image: require('./download.jpg') },
        { name: 'User 4', realName: 'name 4', image: require('./download.jpg') },
    ];

    const handleLongPress = (account) => {
        setSelectedAccount(account);
        setModalVisible(true);
    };
    const handleaccount =(account)=>{
        navigation.navigate("Message", { account })
    }
    const handlemarkasreaded =()=>{
        Alert.alert("you mark as unread an account")
    }
    const handledeletechats =()=>{
        Alert.alert("you delete chats an account")
    }
    const handleblock =()=>{
        navigation.navigate('Inbox');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="white" />
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
                {accounts.map((account, index) => (
                    <TouchableOpacity
                        key={index}
                        onLongPress={() => handleLongPress(account)}
                        onPress={()=>handleaccount(account)}
                        style={styles.accountRow}
                    >
                        <Image source={account.image} style={styles.profilePic} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{account.name}</Text>
                            <Text style={styles.message}>{account.message}</Text>
                        </View>
                        {account.newMessages > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationText}>{account.newMessages}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
                <Text style={styles.suggestTitle}>Accounts to follow</Text>
                {suggestedAccounts.map((account, index) => (
                    <View key={index} style={styles.accountRow}>
                        <Image source={account.image} style={styles.profilePic} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{account.name}</Text>
                            <Text style={styles.realName}>{account.realName}</Text>
                        </View>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followText}>Follow back</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
                            <Text style={styles.modalOption} onPress={handledeletechats}>Delete Chats</Text>
                            <Text style={styles.modalOption} onPress={handlemarkasreaded}>Mark as Unread</Text>
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
        width: 25,
        height: 25,
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
        backgroundColor: '#fff',
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
