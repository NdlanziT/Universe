import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BackButton } from '../../icons/back';

const NotificationSettings = ({navigation}) => {
  const [pushNotification, setPushNotification] = useState(true);
  const [postNotification, setPostNotification] = useState(true);
  const [commentsLikesNotification, setCommentsLikesNotification] = useState(true);
  const [messageNotification, setMessageNotification] = useState(true);
  const [followersNotification, setFollowersNotification] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <View >
          <BackButton size={30} color="white" />
        </View>
        <Text style={styles.headerText}>notification settings</Text>
      </TouchableOpacity>

      <View style={styles.settingRow}>
        <Text style={styles.title}>push notification</Text>
        <Switch 
          value={pushNotification} 
          onValueChange={setPushNotification} 
          trackColor={{ true: 'white' }}
        />
      </View>
      <Text style={styles.subtitle}>enable to receive notification at sidebar</Text>

      <View style={styles.separator} />

      <View style={styles.settingRow}>
        <Text style={styles.title}>post</Text>
        <Switch 
          value={postNotification} 
          onValueChange={setPostNotification} 
          trackColor={{ true: 'white' }}
        />
      </View>
      <Text style={styles.subtitle}>you receive notification of people you follow when they have posted</Text>

      <View style={styles.settingRow}>
        <Text style={styles.title}>comments and likes</Text>
        <Switch 
          value={commentsLikesNotification} 
          onValueChange={setCommentsLikesNotification} 
          trackColor={{ true: 'white' }}
        />
      </View>
      <Text style={styles.subtitle}>mention you in a comment and when new user commented on your post</Text>

      <View style={styles.settingRow}>
        <Text style={styles.title}>message</Text>
        <Switch 
          value={messageNotification} 
          onValueChange={setMessageNotification} 
          trackColor={{ true: 'white' }}
        />
      </View>
      <Text style={styles.subtitle}>you receive new notification when you have a new message</Text>

      <View style={styles.settingRow}>
        <Text style={styles.title}>followers</Text>
        <Switch 
          value={followersNotification} 
          onValueChange={setFollowersNotification} 
          trackColor={{ true: 'white' }}
        />
      </View>
      <Text style={styles.subtitle}>you receive new notification when you have a new follower</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default NotificationSettings;
