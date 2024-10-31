import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { BackButton } from "../../icons/back";
import { RadioButtonOn } from "../../icons/radioon";
import { RadioButtonOff } from "../../icons/raadiooff";


const Categorise = ({ navigation, route }) => {
  const { setCategory,category } = route.params;

  const [selectedCategory, setSelectedCategory] = useState(category);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategory(category);
    navigation.goBack();
  };

  const renderRadioButton = (value) => {
    return selectedCategory === value ? (
      <RadioButtonOn size={30} color="white" />
    ) : (
      <RadioButtonOff size={24} color="white" />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topBar} onPress={() => navigation.goBack()}>
        <View >
          <BackButton size={30} color="white" />
        </View>
        <Text style={styles.title}>categorise</Text>
      </TouchableOpacity>

      <Text style={styles.header}>categorise your post as</Text>
      <Text style={styles.subHeader}>
        your post will show at home feeds and other pages according to what you
        specified
      </Text>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryOption}
          onPress={() => handleCategorySelect("market place")}
        >
          {renderRadioButton("market place")}
          <View style={styles.optionTextContainer}>
            <Text style={styles.categoryTitle}>market place</Text>
            <Text style={styles.categoryDescription}>
              will show at market place feed
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryOption}
          onPress={() => handleCategorySelect("tutoring service")}
        >
          {renderRadioButton("tutoring service")}
          <View style={styles.optionTextContainer}>
            <Text style={styles.categoryTitle}>tutoring service</Text>
            <Text style={styles.categoryDescription}>
              will show at tutoring service feed
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    color: "white",
    paddingLeft: 10,
    textTransform: "lowercase",
  },
  header: {
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
  },
  subHeader: {
    color: "gray",
    fontSize: 12,
    marginBottom: 20,
  },
  categoryContainer: {
    borderTopWidth: 1,
    borderColor: "#333",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionTextContainer: {
    marginLeft: 10,
  },
  categoryTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryDescription: {
    color: "gray",
    fontSize: 12,
  },
});

export default Categorise;
