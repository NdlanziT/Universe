import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const messages = [
  {
    date: '30 June 2002 18:00',
    text: 'Razor🔥👍',
    replied: 'Replied to your story',
    profileImage: require('./download.jpg'),
    sender: 'other', // other or me
  },
  {
    date: '15 July 2023 14:30',
    text: 'How have you been?',
    replied: 'Replied to your message',
    profileImage: require('./download.jpg'),
    sender: 'me', // other or me
  },
  {
    date: '22 August 2023 10:45',
    text: 'Let’s catch up sometime!',
    replied: 'Replied to your story',
    profileImage: require('./download.jpg'),
    sender: 'other', // other or me
  },
  {
    date: '05 October 2023 09:15',
    text: 'Looking forward to the weekend!',
    replied: 'Replied to your message',
    profileImage: require('./download.jpg'),
    sender: 'me', // other or me
  },
  {
    date: '05 October 2023 09:15',
    text: 'heyy',
    replied: 'Replied to your message',
    profileImage: require('./download.jpg'),
    sender: 'me', // other or me
  },
  {
    date: '05 October 2023 09:15',
    text: 'can you hear me',
    replied: 'Replied to your message',
    profileImage: require('./download.jpg'),
    sender: 'me', // other or me
  }
];

const Messagespage = ({navigation}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Handle sending the message
    console.log('Message sent:', message);
    setMessage('');
  };

  const handlegotoprofileuser = () => {
    navigation.navigate("Userprofile")
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backbtn} onPress={() => navigation.goBack()}>
            <Icon  name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Image source={require('./download.jpg')} style={styles.smallProfileImage} />
          <View>
            <Text style={styles.name}>username</Text>
            <Text style={styles.status}>Active 10m ago</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Icon name="information-circle-outline" size={24} color="white" />
        </View>
      </View>

      {/* Messages List */}
      <ScrollView contentContainerStyle={styles.messageList}>
      <View style={styles.profileSection}>
        <Image source={require('./download.jpg')} style={styles.bigProfileImage} />
        <Text style={styles.name}>username</Text>
        <Text style={styles.username}>name</Text>
        <Text style={styles.followDetails}>59 followers · 2 posts</Text>
        <Text style={styles.followInfo}>You follow each other on Instagram</Text>
        <Text style={styles.followInfo}>You both follow masesi347 and 3 others</Text>
        <TouchableOpacity style={styles.viewProfileButton} onPress={handlegotoprofileuser}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
        {messages.map((item, index) => (
          <View key={index} style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.row}>
              {item.sender === 'other' && (
                <Image source={item.profileImage} style={styles.profileImage} />
              )}
            <View style={item.sender === 'me' ? styles.bubbleme : styles.bubble}>
                <Text style={item.sender === "me" ? styles.messageTextme : styles.messageText}>{item.text}</Text>
            </View>
            </View>
          </View>
        ))}
      </ScrollView>


      <View style={styles.inputContainer}>
        {message === '' ? (
          <Icon name="camera" size={30} color="gray" style={styles.inputIcon} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="send a message."
           placeholderTextColor="gray"
          value={message}
          onChangeText={setMessage}
        />
        {message !== '' ? (
          <TouchableOpacity onPress={handleSend}>
            <Icon name="send" size={30} color="blue" style={styles.inputIcon} />
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
  bubbleme: {
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
    marginRight: 20,
    marginLeft: 20,
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
