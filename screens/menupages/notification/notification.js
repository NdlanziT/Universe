import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { BackButton } from '../../icons/back'; // Keep this if you still need the back button icon

const Notications = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]); // State to store notifications
    const [showNotifications, setShowNotifications] = useState(true); // Toggle to show/hide notifications

    // Sample comments to demonstrate how notifications will work
    const sampleComments = [
        { id: '1', postId: '101', userId: 'u1', message: 'Great post!', timestamp: '2024-11-01 10:00 AM' },
        { id: '2', postId: '102', userId: 'u2', message: 'Thanks for sharing!', timestamp: '2024-11-01 11:00 AM' },
        { id: '3', postId: '103', userId: 'u3', message: 'Very helpful!', timestamp: '2024-11-01 12:00 PM' },
    ];

    // Sample notifications to simulate fetching new comments, messages, and posts
    const fetchSampleNotifications = () => {
        const newNotifications = [
            { id: '1', type: 'comment', message: 'User u1 commented on your post', timestamp: new Date().toISOString(), isRead: false },
            { id: '2', type: 'message', message: 'You have a new message from User u2', timestamp: new Date().toISOString(), isRead: false },
            { id: '3', type: 'post', message: 'User u3 has posted a new update', timestamp: new Date().toISOString(), isRead: false },
        ];
        setNotifications(newNotifications);
    };

    // Simulate fetching notifications when the component mounts
    useEffect(() => {
        fetchSampleNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <BackButton size={35} color="white" />
                    <Text style={styles.headerText}>Notifications</Text>
                </TouchableOpacity>
            </View>

            {/* Notifications Section */}
            {showNotifications && (
                <ScrollView style={styles.notificationsContainer}>
                    {notifications.map(notification => (
                        <View key={notification.id} style={styles.notification}>
                            <Text style={styles.notificationMessage}>{notification.message}</Text>
                            <Text style={styles.notificationTimestamp}>{new Date(notification.timestamp).toLocaleString()}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Sample Comments Section */}
            <View style={styles.commentsContainer}>
                <Text style={styles.commentsTitle}>Sample Comments:</Text>
                {sampleComments.map(comment => (
                    <View key={comment.id} style={styles.comment}>
                        <Text style={styles.commentMessage}>{comment.message}</Text>
                        <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default Notications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark theme background
    },
    header: {
        marginTop: 30,
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F1F1F', // Slightly lighter dark color for header
        borderBottomWidth: 1,
        borderBottomColor: '#333', // Subtle border for separation
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        marginLeft: 10, // Space between icon and text
    },
    notificationsContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    notification: {
        backgroundColor: '#1E1E1E', // Dark background for notifications
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1, // Slight elevation for shadow effect
    },
    notificationMessage: {
        color: '#fff',
        fontSize: 16,
    },
    notificationTimestamp: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
    },
    commentsContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    commentsTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    comment: {
        backgroundColor: '#2A2A2A', // Darker background for comments
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    commentMessage: {
        color: '#fff',
    },
    commentTimestamp: {
        color: '#aaa',
        fontSize: 12,
    },
});
