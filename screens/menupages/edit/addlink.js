import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const AddLink = ({navigation}) => {
    const [username, setUsername] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <Icon name="close" size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Add new link</Text>
                </View>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Save as</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter name of link"
                    placeholderTextColor="#888"
                />
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>URl</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter URI link"
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddLink;

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
        marginRight: 12,
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
