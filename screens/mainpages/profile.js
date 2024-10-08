import { StyleSheet, Text, View, ScrollView, Animated,Image, Alert, Modal,Share, } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';


const Profilemenu = ({navigation}) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

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
    const notificationhandle = ()=> {
      navigation.navigate("Notification");
    };
    const followingpagehandle = ()=> {
      navigation.navigate("Followingpage");
    };
    const menuhandle = ()=> {
      navigation.navigate("Menu");
    };
    const dashboardhandle = ()=> {
      navigation.navigate("Dashboard");
    };
    const edithandle = ()=> {
      navigation.navigate("Edit");
    };


  return (
    <View style={styles.container}>
      <View style={styles.group1}>
        <View style={styles.leftSection} >
          <Text style={styles.text}>Username</Text>
        </View>

        <View style={styles.rightSection}>
          {/* Bell icon with notification dot */}
          <TouchableOpacity style={styles.iconWithBadge} onPress={notificationhandle}>
            <Icon name="bell" size={30} color="white" style={styles.iconText} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>

          {/* Bars icon with red dot */}
          <TouchableOpacity style={styles.iconWithDot} onPress={menuhandle}>
            <Icon name="bars" size={30} color="white" style={styles.iconText} />
            <View style={styles.dot}></View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollcontainer}
        ref={scrollViewRef}
      >
        <View style={styles.group2}>
            <Image
                    source={require("./download.jpg")} 
                    style={styles.profilepic}
            />
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
        <View style={styles.group4}>
            <TouchableOpacity style={styles.dashboardcontainer} onPress={dashboardhandle}>
                <Text style={styles.dashboard1sttext}>Dashboard</Text>
                <Text style={styles.dashboard2sttext}>Tools and resources just for you</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group5}>
            <TouchableOpacity style={styles.buttonFollow} onPress={edithandle}>
                <Text style={styles.buttonText}>edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonFollow} onPress={sharehandle}>
                <Text style={styles.buttonText}>share profile</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.group6}>
            <Text style={styles.postText}>
                no post available
            </Text>
        </View>
      </ScrollView>
      
    </View>
  );
};

export default Profilemenu;

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
  group4: {
    height: 120,
    alignItems:"center",
    justifyContent:"center",
    padding: 20,

  },
  group5: {
    flexDirection: 'row', // Add space between buttons
    marginTop: -25, // Add some margin above the buttons
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
    margin: 5,
    marginLeft: 20,
    height: 91,
    width:110,// Set a width for visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Half of the height/width to make it round
    overflow: 'hidden', 
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
  iconWithDot: {
    position: 'relative',
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
  dashboard1sttext: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
    marginLeft: 5,
  },
  dashboard2sttext: {
    fontWeight: '200',
    color: 'white',
    marginBottom: 5,
    marginLeft: 5,
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
    height: 300,
},
modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
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
});