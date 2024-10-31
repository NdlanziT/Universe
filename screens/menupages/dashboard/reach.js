import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Animated,Modal } from 'react-native';
import React, { useState,useRef  } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import { BackButton } from '../../icons/back';
import { ArrowDown } from '../../icons/arrowdown';

const Reach = ({navigation}) => {
    const [timemodalinvisible, settimemodalinvisible] = useState(false);
    const slideAnimEdit = useRef(new Animated.Value(0)).current;

    const [timerange,setTimerange] = useState("last 7 days")

    const seven = ()=>{
        setTimerange("last 7 days")
        closeeditmodal();
    }
    const thirty = ()=>{
        setTimerange("last 30 days")
        closeeditmodal();
    }
    const ninety = ()=>{
        setTimerange("last 90 days")
        closeeditmodal();
    }

    // Open edit modal
    const opentimeModal = () => {
        settimemodalinvisible(true);
        Animated.timing(slideAnimEdit, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Close edit modal
    const closeeditmodal = () => {
        Animated.timing(slideAnimEdit, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => settimemodalinvisible(false));
    };

    const slideUpStyleEdit = {
        transform: [
            {
                translateY: slideAnimEdit.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.group1}>
                <TouchableOpacity style={styles.leftSection} onPress={() => navigation.goBack()}>             
                    <View style={styles.iconText}  >
                        <BackButton size={30} color="white" style={styles.iconText} />
                    </View>
                    <Text style={styles.text}>Reach</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.group2}>
                    <TouchableOpacity style={styles.buttondetails} onPress={opentimeModal}>
                        <Text style={styles.text}>{timerange} {<ArrowDown size={20} color="white" style={styles.iconText} />}</Text>
                    </TouchableOpacity>
                    <View style={styles.stats}>
                        <Text style={styles.statsText}>10 sep - 12 oct</Text>
                        
                    </View>
            </View>
            <View style={styles.group6} >
                        <Text style={styles.text}>25</Text>
                        <Text style={styles.text}>Accounts reached</Text>
            </View>
            <Text style={styles.reachedaudience}>Reached Audience</Text>
            <View style={styles.group3} >
                    <View style={styles.details}>
                        <Text style={styles.statsText}>followers</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>25 </Text>
                        
                    </View>
            </View>
            <View style={styles.group3}>
                    <View style={styles.details}>
                        <Text style={styles.statsText}>Unfollowers</Text>
                    </View>
                    <View style={styles.statsnumber}>
                        <Text style={styles.text}>25 </Text>
                        
                    </View>
            </View>

            
            <View style={styles.group4}>
                <View style={styles.details}>
                    <Text style={styles.toolsheadings}>Profile Activity</Text>
                    <Text style={styles.statsText}>vs 7 oct - 29 sep</Text>
                </View>
                <View style={styles.statsnumber}>
                    <Text style={styles.percentagetext}>25%</Text>  
                </View>
            </View>

            {timemodalinvisible && (
                <Modal
                    transparent={true}
                    animationType="none"
                    visible={timemodalinvisible}
                    onRequestClose={closeeditmodal}
                >
                    <TouchableOpacity style={styles.modalBackground} onPress={closeeditmodal}>
                        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                            <Animated.View style={[styles.modalContent, slideUpStyleEdit]}>
                                <Text style={styles.modalText}>Pick time range</Text>
                                <TouchableOpacity style={styles.lastButton} onPress={seven}>
                                    <Text style={styles.lastText}>Last 7 days</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.lastButton} onPress={thirty}>
                                    <Text style={styles.lastText}>Last 30 days</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.lastButton} onPress={ninety}>
                                    <Text style={styles.lastText}>Last 90 days</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.closeButton} onPress={closeeditmodal}>
                                    <Text style={styles.closeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default Reach;

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
    group2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        marginBottom: 15,
    },
    group3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
    },
    group4: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: 'white',
        alignItems: 'center',
        marginTop: 10,
    },
    group5: {
        flexDirection:"row",
        padding: 15,
    },
    group6: {
        height:170,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    iconText: {
        marginRight: 10,
        marginLeft: -10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center', // Make sure the text is centered
        flex: 1, 
    },
    text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    percentagetext:{
        color: 'green',
        fontWeight: 'thin',
        fontSize: 22,
    },
    details: {
        marginLeft: 15,
    },
    buttondetails: {
        marginLeft: 15,
        backgroundColor:"#434343",
        width: 150,
        height:45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    stats: {
        marginRight: 10,
    },
    statsText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'thin',
    },
    statsnumber: {
        marginTop: -3,
        marginRight: 15,
    },
    toolsheadings: {
        marginTop:20,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    verify: {
        backgroundColor:"blue",
        borderRadius: 50,
        width: 25,
        height: 25,
        justifyContent:"center",
    },
    reachedaudience: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        marginLeft:12,
        marginBottom:5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    closeButton: {
        marginTop: 25,
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor:"#434343",
        padding: 10,
        borderRadius: 10,
    },
    lastText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
