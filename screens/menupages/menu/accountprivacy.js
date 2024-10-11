import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountPrivacy = ({navigation}) => {
  const [selectedAudience, setSelectedAudience] = useState('public');

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <View >
          <Icon name="arrow-left" size={30} color="white" />
        </View>
        <Text style={styles.headerText}>account privacy</Text>
      </TouchableOpacity>


      <Text style={styles.mainHeading}>who can see your profile post!</Text>
      <Text style={styles.subHeading}>
        your post may show up in home feed, on your profile and at search pages
        of people who follow you only
      </Text>

      <Text style={styles.chooseText}>choose audience:</Text>

      {/* Public Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedAudience('public')}
      >
        <Icon
          name={selectedAudience === 'public' ? 'dot-circle-o' : 'circle-o'}
          size={24}
          color="white"
          style={styles.radioIcon}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>public</Text>
          <Text style={styles.subOptionText}>anyone at UniVerse</Text>
        </View>
      </TouchableOpacity>

      {/* Private Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedAudience('private')}
      >
        <Icon
          name={selectedAudience === 'private' ? 'dot-circle-o' : 'circle-o'}
          size={24}
          color="white"
          style={styles.radioIcon}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Private</Text>
          <Text style={styles.subOptionText}>anyone who follows you</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mainHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 20,
  },
  chooseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  radioIcon: {
    marginRight: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subOptionText: {
    color: 'gray',
    fontSize: 14,
  },
});

export default AccountPrivacy;
