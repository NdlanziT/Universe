import { StyleSheet, Text, View, TouchableOpacity, TextInput,ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

import { CloseButton } from '../../icons/close';

const ChangeBio = ({navigation,route}) => {
    const { currentbio,email,setBio,setCurrentbio } = route.params
    const [value, setvalue] = useState(currentbio);
    const [loading,setloading] = useState(false)

    const updateBio = async () => {
        if(value.length > 5){
            setloading(true);
            try {
                await updateDoc(doc(db, 'users', email), {
                    bio: value,
                });
                setBio(value);
                setCurrentbio(value)
                setloading(false);
                navigation.goBack();
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        }else{
            alert('bio should be between atleast 6 characters long .')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.goBack()}>
                        <CloseButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Change bio</Text>
                </View>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Bio</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={value}
                    onChangeText={setvalue}
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={updateBio}>
                    {loading ? (
                        <ActivityIndicator color={"white"} size={'small'} />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
            </TouchableOpacity>
        </View>
    );
};

export default ChangeBio;

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
