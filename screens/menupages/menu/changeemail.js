import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

import { CloseButton } from '../../icons/close';

const Changeemail = ({navigation,route}) => {
    const {auth} = route.params
    const user = auth.currentUser;
    const [newEmail, setNewEmail] = useState('');
    const [oldemail, setOldemail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = async () => {
        setLoading(true);

        if (newEmail === user.email) {
            Alert.alert("New email cannot be the same as the old email.");
            setLoading(false);
            return;
        }

        // Validate new email ends with @gmail.com
        if (!newEmail.endsWith('@gmail.com')) {
            Alert.alert("Email must end with @gmail.com");
            setLoading(false);
            return;
        }

        if (oldemail !== user.email) {
            try {
                // Update the email directly
                await updateEmail(user, newEmail);
                Alert.alert("Email updated successfully!");
                emailuser(newEmail)
                setLoading(false);
                navigation.goBack();

            } catch (error) {
                Alert.alert("Failed to update email. Please try again.");
                setLoading(false);
            }
        } else {
            Alert.alert("Old email does not match current email.");
            setLoading(false);
        }
    };
    const emailuser = async (email) => {
            try {
                await updateDoc(doc(db, 'users', email), {
                    email: newEmail,
                });
            } catch (error) {
                console.error('Error updating document: ', error);
            }
    }

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.iconText} onPress={() => navigation.goBack()}>
                        <CloseButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Change current email </Text>
                </View>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter old email</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={oldemail}
                    onChangeText={setOldemail}
                    placeholderTextColor="#888"
                />
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter new email</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleEmailChange}> 
                {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
            </TouchableOpacity>
        </View>
    );
};

export default Changeemail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',// Ensure content is spaced evenly with the button at the bottom
    },
    group1: {
        marginTop: 30,
        height: 60,
        paddingHorizontal: 20,
        justifyContent: 'center', 
        marginBottom: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
    },
    iconText: {
        marginRight: 10,
        marginLeft: -10,
    },
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    detailcontainer: {
        marginTop: 20,
        marginLeft: 15,
        width: "92%",
        borderWidth: 1,
        borderBottomColor: "white",
    },
    detaillabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detailvalue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        borderColor: '#888',
        borderBottomWidth: 1,
        padding: 4,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
