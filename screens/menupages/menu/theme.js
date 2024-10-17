import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Theme = ({navigation}) => {
  const [theme, setTheme] = useState('black');

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <View >
          <Icon name="arrow-back" size={30} color="white" />
        </View>
        <Text style={styles.headerText}>Theme</Text>
      </TouchableOpacity>
      <Text style={styles.chooseText}>choose theme:</Text>

      {/* Public Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setTheme('black')}
      >
        <Icon
          name={theme === 'black' ? 'radio-button-on-outline' : 'radio-button-off-outline'}
          size={24}
          color="white"
          style={styles.radioIcon}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Black</Text>
          <Text style={styles.subOptionText}>layout will mostly be black</Text>
        </View>
      </TouchableOpacity>

      {/* Private Option */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setTheme('white')}
      >
        <Icon
          name={theme === 'white' ? 'radio-button-on-outline' : 'radio-button-off-outline'}
          size={24}
          color="white"
          style={styles.radioIcon}
        />
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

export default Theme;
