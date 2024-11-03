import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db, auth } from '../../../firebase'; // Assuming you have configured Firebase
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ReportScreen = ({ navigation, route }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [reportMessage, setReportMessage] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const reportOptions = [
        "Spam",
        "Inappropriate Content",
        "Hate Speech",
        "Violence",
        "Harassment",
        "Other"
    ];

    const handleSubmitReport = async () => {
        if (!selectedReason && !reportMessage) {
            Alert.alert("Incomplete Report", "Please select a reason or describe the issue.");
            return;
        }

        try {
            // Adding the report data to Firestore
            const currentUser = auth.currentUser;
            const userId = currentUser ? currentUser.uid : 'Anonymous';

            await addDoc(collection(db, 'reports'), {
                postId: route?.params?.postId || 'N/A',
                reportReason: selectedReason,
                comments: reportMessage,
                userId: userId,
                timestamp: Timestamp.now()
            });

            setReportMessage('');
            setSelectedReason('');
            setReportSubmitted(true);
            Alert.alert("Report Submitted", "Thank you for helping keep our community safe.");
            navigation.goBack();
        } catch (error) {
            console.error("Error submitting report:", error);
            Alert.alert("Error", "There was an issue submitting your report. Please try again.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Report Post</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <Text style={styles.instructions}>Please select a reason for reporting this post.</Text>
            <View style={styles.optionsContainer}>
                {reportOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.option,
                            selectedReason === option && styles.selectedOption
                        ]}
                        onPress={() => setSelectedReason(option)}
                    >
                        <Icon
                            name={selectedReason === option ? "checkbox-outline" : "square-outline"}
                            size={24}
                            color="#FFFFFF"
                        />
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.commentsLabel}>Additional Comments (Optional):</Text>
            <TextInput
                style={styles.commentsInput}
                multiline
                placeholder="Describe the issue"
                placeholderTextColor="#999999"
                value={reportMessage}
                onChangeText={setReportMessage}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>

            {reportSubmitted && <Text style={styles.successText}>Thank you for submitting the report!</Text>}
        </ScrollView>
    );
};

export default ReportScreen;

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#121212', flexGrow: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
    instructions: { fontSize: 16, color: '#BBBBBB', marginBottom: 10 },
    optionsContainer: { marginBottom: 20 },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#333333',
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedOption: { backgroundColor: '#1E88E5' },
    optionText: { fontSize: 16, color: '#FFFFFF', marginLeft: 10 },
    commentsLabel: { fontSize: 16, color: '#BBBBBB', marginBottom: 10 },
    commentsInput: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        height: 100,
        marginBottom: 20,
        textAlignVertical: 'top'
    },
    submitButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 8,
    },
    submitButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
    successText: { marginTop: 15, color: 'green', textAlign: 'center' },
});
