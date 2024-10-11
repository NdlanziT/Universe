import { StyleSheet, Text, View, ScrollView, Animated,Image, Alert, Modal,Share, } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';


const Userprofile = ({navigation}) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [optionmodalVisible, setoptionModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const scrollViewRef = useRef(null);

  // Function to scroll to a specific position
    const scrollToPosition = (position) => {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    };

    const sharehandle = async () => {
        try {
            await Share.share({
                message: 'Check this out: https://example.com',
            });
        } catch (error) {
            alert(error.message);
        }
    };
    const searchhandle = ()=> {
        Alert.alert("you click a search button")
    };
    const followingpagehandle = ()=> {
        navigation.navigate("Userfollowers")
    };
    const followhandle = ()=> {
      Alert.alert("you click a follow button")
    };
    const messagehandle = ()=> {
      navigation.navigate("Message")
    };
    const blockhandle = ()=> {
        Alert.alert("you click a block button")
    };
    const reporthandle = ()=> {
        Alert.alert("you click a report button")
    };
    const hand = ()=> {
      Alert.alert("you click a fullscreen profile picture button")
    };
    const fullscreenprofile = () => {
      setImageModalVisible(true);
    };
  
    const closeImageModal = () => {
      setImageModalVisible(false);
    };


    const openoptionModal = () => {
        setoptionModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Close edit modal
    const closeoptionModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setoptionModalVisible(false));
    };
    const slideUpStyle = {
        transform: [
            {
                translateY: slideAnim.interpolate({
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
          <Icon name="arrow-left" size={30} color="white" />
          <Text style={styles.text}>Username</Text>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          {/* Bell icon with notification dot */}
            <TouchableOpacity style={styles.iconWithBadge} onPress={searchhandle}>
            <Icon name="search" size={30} color="white" style={styles.iconText} />
          </TouchableOpacity>

          {/* Bars icon with red dot */}
          <TouchableOpacity style={styles.iconWithDot} onPress={openoptionModal}>
            <Icon name="ellipsis-v" size={30} color="white" style={styles.iconText} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollcontainer}
        ref={scrollViewRef}
      >
        <View style={styles.group2}>
          <TouchableOpacity style={styles.profilecontainer} onPress={fullscreenprofile}> 
            
          <Image
                    source={require("./download.jpg")} 
                    style={styles.profilepic}
                    
            />

          </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={() => scrollToPosition(400)}>
                <Text style={styles.followingtext} >Post</Text>
                <Text style={styles.followingtext}>12</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={followingpagehandle}>
                <Text style={styles.followingtext}>Followers</Text>
                <Text style={styles.followingtext}>12</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.following} onPress={followingpagehandle}>
                <Text style={styles.followingtext}>Following</Text>
                <Text style={styles.followingtext}>12</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group3}>
            <Text style={styles.username}>name</Text>
            <Text style={styles.bio}>your bio</Text>
            <Text style={styles.link}>1st link</Text>
            <Text style={styles.link}>2nd link</Text>
        </View>
        <View style={styles.group5}>
            <TouchableOpacity style={styles.buttonFollow} onPress={followhandle}>
                <Text style={styles.buttonText}>Unfollow</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFollow} onPress={messagehandle}>
                <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group6}>
            <Text style={styles.postText}>
                no post available
            </Text>
        </View>
      </ScrollView>
      {optionmodalVisible && (
                <Modal
                    transparent={true}
                    animationType="none"
                    visible={optionmodalVisible}
                    onRequestClose={closeoptionModal}
                >
                    <TouchableOpacity style={styles.modalBackground} onPress={closeoptionModal}>
                        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                            <Animated.View style={[styles.modalContent, slideUpStyle]}>
                                <TouchableOpacity style={styles.modalbuttonred}  onPress={blockhandle}>
                                    <Text style={styles.modalTextred}>Block</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalbuttonred} onPress={reporthandle} >
                                    <Text style={styles.modalTextred}>Report</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalbutton} onPress={sharehandle}>
                                    <Text style={styles.modalText}>share profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.closeButton} onPress={closeoptionModal}>
                                    <Text style={styles.closeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}
      {/* Modal to show full screen profile picture */}
      {imageModalVisible && (
        <Modal transparent={false} animationType="slide" visible={imageModalVisible} onRequestClose={closeImageModal}>
          <View style={styles.imageModalContainer}>
            {/* Back button to close modal */}
            <TouchableOpacity style={styles.imagebackButton} onPress={closeImageModal}>
              <Icon name="arrow-left" size={35} color="white" />
            </TouchableOpacity>

            {/* Fullscreen profile picture */}
            <Image source={require("./download.jpg")} style={styles.fullScreenImage} resizeMode="contain" />
          </View>
        </Modal>
      )}
      
    </View>
  );
};

export default Userprofile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  group1: {
    marginTop: 30,
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  group2: {
    flex:1,
    flexDirection: 'row',
    height: 120,
    width: "100%",
    alignItems:"center",
  },
  group3: {
    marginLeft:25,
  },
  seemorebtn: {
    flexDirection: 'row',
    justifyContent:"space-between",
    padding: 20,
    marginBottom: -30,
    alignItems: 'center',

  },
  group5: {
    flexDirection: 'row', // Add space between buttons
    marginTop: 25, // Add some margin above the buttons
    padding:19,

  },
  group6: {
    flex:1,
    flexDirection: 'row',
    height: 800,
    width: "100%",
    borderTopWidth: 1, // Thin line at the top
    borderTopColor: 'white',
    justifyContent: "center",
  },
  profilepic: { // Change to desired color
    flex: 1,
    height: 91,
    width:100,// Set a width for visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Half of the height/width to make it round
    overflow: 'hidden', 
  },
  profilecontainer:{
    marginLeft: 10,
    height: 100,
    width:100,
    borderRadius: 50,// Set a width for visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  following: {
    backgroundColor: 'black', // Change to desired color
    flex: 1,
    margin: 5,
    height: 100, // Set a height for visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollcontainer: {
    flex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  followingtext:{
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  iconText: {
    marginLeft: 15,
  },
  iconText2: {
    marginLeft: 8,
  },
  iconWithBadge: {
    position: 'relative',
    marginRight: 20,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seemoretext: { 
    color: 'white', 
    fontWeight: '600',
    marginLeft: 10,
   },
   iconWithDot: {
    position: 'relative',
    marginRight: 2,
    marginLeft: -10,
  },
  dot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  username: {
    fontSize: 22,         // Size similar to Instagram's username
    fontWeight: 'thin',         // Black color for username
    marginBottom: 4,
    color:"white"      // Spacing below the username
  },
  bio: {
    fontSize: 18,         // Size similar to Instagram's bio
    color: '#666',        // Gray color for bio text
    marginBottom: 10,     // Spacing below the bio
    lineHeight: 20,       // Line height for better readability
  },
  link: {
    fontSize: 14,         // Size for links
    color: '#0095F6',     // Instagram's link color
    textDecorationLine: 'underline', // Underlined for link effect
  },
  dashboardcontainer: {
    flex:1,
    backgroundColor: "#434343",
    width: "100%",
    height:90,
    justifyContent: "center",
    borderRadius:10,
  },
  buttonFollow: {
    flex: 1,
    backgroundColor: '#434343',
    borderRadius: 10, // Rounded corners
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text vertically
    height: 50,
    marginLeft:3,
  },
  buttonText: {
    color: '#fff', // White text for the follow button
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonMessageText: {
    color: '#000', // Black text for the message button
    fontWeight: 'bold',
    fontSize: 16,
  },
  postText: {
    color: '#fff', // White text for the follow button
    fontWeight: 'bold',
    fontSize: 20,
    marginTop:100,
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
    height: 190,
},
modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
},
modalTextred: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    color:"red",
    marginBottom: 15,
},
closeButton: {
    marginTop: 20,
    alignItems: 'center',
},
closeButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
},
imageModalContainer: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},
fullScreenImage: {
  width: '100%',
  height: '100%',
},
imagebackButton: {
  position: 'absolute',
  top: 10,
  left: 20,
  zIndex: 1,
},
});