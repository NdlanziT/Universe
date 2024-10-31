import { StyleSheet, Text, View, TouchableOpacity, TextInput,ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { updateDoc,doc } from 'firebase/firestore';
import { db } from '../../../firebase';

import { CloseButton } from '../../icons/close';

const Changephone = ({navigation,route}) => {
    const [loading, setLoading] = useState('');
    const [oldphone,setOldhone] = useState('');
    const [confirmPhone, setConfirmPhone] = useState('');
    const {auth,phone,setPhone} = route.params

    const handlePhoneChange = async ()=>{
        setLoading(true)
        if(oldphone === ''){
            alert('Please enter your old phone number')
            setLoading(false);
        }else if(confirmPhone === ''){
            alert('Please enter your new phone number')
            setLoading(false);
        } else if(oldphone !== phone){
            alert('Old and new phone number are not same')
            setLoading(false);
        } else if(confirmPhone.length!== 10){
            alert('new Phone number should be 10 digits')
        } else {
            try {
              await updateDoc(doc(db, 'users', email), {
                  phone: confirmPhone,
              });
              setPhone(confirmPhone);
              setLoading(false);
              navigation.goBack();
          } catch (error) {
            setLoading(false);
            navigation.goBack();
              console.error('Error updating document: ', error);
          }
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <View style={styles.leftSection}>             
                    <TouchableOpacity style={styles.iconText} onPress={() => navigation.goBack()}>
                        <CloseButton size={30} color="white" style={styles.iconText} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Change current phone</Text>
                </View>
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter old phone number</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={oldphone}
                    onChangeText={setOldhone}   
                    placeholderTextColor="#888"
                />
            </View>
            <View style={styles.detailcontainer}>
                <Text style={styles.detaillabel}>Enter new phone number</Text>
                <TextInput
                    style={styles.detailvalue}
                    value={confirmPhone}
                    onChangeText={setConfirmPhone}
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handlePhoneChange}>
                {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
            </TouchableOpacity>
        </View>
    );
};

export default Changephone;

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
