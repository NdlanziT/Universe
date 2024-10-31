import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth'; // Make sure to import updatePassword function from Firebase
import { CloseButton } from '../../icons/close';

const Changepassword = ({ navigation, route }) => {
    const { auth } = route.params;
    const user = auth.currentUser; // Get the currently authenticated user

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to handle password change
    const handleChangePassword = async () => {
        setLoading(true); // Show the loading indicator

        if (!newPassword || !confirmPassword) {
            Alert.alert("Please fill in both password fields.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Update the user's password
            await updatePassword(user, newPassword);
            Alert.alert("Password updated successfully!");
            setLoading(false);
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert("Failed to update password. Please try again.");
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>
                    <TouchableOpacity style={styles.iconText} onPress={() => navigation.goBack()}>
                        <CloseButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Change current password </Text>
                </View>
            </View>

            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter old password</Text>
                <TextInput
                    style={styles.detailvalue}
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter new password</Text>
                <TextInput
                    style={styles.detailvalue}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Repeat new password</Text>
                <TextInput
                    style={styles.detailvalue}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#888"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default Changepassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
    text: {
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
        backgroundColor: 'blue',
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
