import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateDoc,doc } from 'firebase/firestore';
import { db } from '../../../firebase';

import { BackButton } from '../../icons/back';
import { RadioButtonOn } from '../../icons/radioon';
import { RadioButtonOff } from '../../icons/raadiooff';

const Theme = ({navigation,route}) => {
  const {theme, setTheme,email} = route.params;
  const [selectedTheme, Setselectedtheme] =  useState(theme)

  const handlebtn = async (theme)=>{
    try {
      await updateDoc(doc(db, 'users', email), {
          theme: theme,
      });
      setTheme(theme);
      navigation.goBack();
  } catch (error) {
    navigation.goBack();
      console.error('Error updating document: ', error);
  }
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <View >
          <BackButton size={30} color="white" />
        </View>
        <Text style={styles.headerText}>Theme</Text>
      </TouchableOpacity>
      <Text style={styles.chooseText}>choose theme:</Text>

      {/* Public Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => {Setselectedtheme('black');handlebtn("black")}}
      >
        {selectedTheme === 'black' ? <RadioButtonOn size={30} color="white" /> : <RadioButtonOff size={30} color="white" />}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Black</Text>
          <Text style={styles.subOptionText}>layout will mostly be black</Text>
        </View>
      </TouchableOpacity>

      {/* Private Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => {Setselectedtheme('white');handlebtn("white")}}
      >
        {selectedTheme === 'white' ? <RadioButtonOn size={30} color="white" /> : <RadioButtonOff size={30} color="white" />}

        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>White</Text>
          <Text style={styles.subOptionText}>layout will mostly be white</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  radioIcon: {
    marginLeft: 10,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 10,
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

export default Theme;
