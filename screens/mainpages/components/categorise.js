import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Categorise = ({ navigation, route }) => {
  const { setCategory } = route.params;

  const [selectedCategory, setSelectedCategory] = useState("marketplace");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategory(category);
    navigation.goBack();
  };

  const renderRadioButton = (value) => {
    return selectedCategory === value ? (
      <Ionicons name="radio-button-on" size={24} color="white" />
    ) : (
      <Ionicons name="radio-button-off" size={24} color="white" />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>categorise</Text>
      </View>

      <Text style={styles.header}>categorise your post as</Text>
      <Text style={styles.subHeader}>
        your post will show at home feeds and other pages according to what you
        specified
      </Text>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryOption}
          onPress={() => handleCategorySelect("marketplace")}
        >
          {renderRadioButton("marketplace")}
          <View style={styles.optionTextContainer}>
            <Text style={styles.categoryTitle}>market place</Text>
            <Text style={styles.categoryDescription}>
              will show at market place feed
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryOption}
          onPress={() => handleCategorySelect("tutoringservice")}
        >
          {renderRadioButton("tutoringservice")}
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
