import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { RadioButtonOff } from "../../icons/raadiooff";
import { RadioButtonOn } from "../../icons/radioon";
import { BackButton } from "../../icons/back";

const PostPrivacy = ({ navigation, route }) => {
  const { privacy, setPrivacy } = route.params;
  const [selectedPrivacy, setSelectedPrivacy] = useState(privacy); // Default privacy option

  const handlePrivacyChange = (privacyOption) => {
    setSelectedPrivacy(privacyOption);
    setPrivacy(privacyOption);
    navigation.goBack();
  };

  const renderRadioButton = (value) => {
    return selectedPrivacy === value ? (
      <RadioButtonOn size={24} color="white" />
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
        <Text style={styles.title}>post audience</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>who can see your post!</Text>
      <Text style={styles.description}>
        your post may show up in home feed, on your profile and at search pages
      </Text>

      <Text style={styles.subheading}>choose audience:</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePrivacyChange("Public")}
      >
        {renderRadioButton("Public")}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Public</Text>
          <Text style={styles.optionDescription}>anyone at UniVerse</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePrivacyChange("Private")}
      >
        {renderRadioButton("Private")}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Private</Text>
          <Text style={styles.optionDescription}>anyone who follows you</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePrivacyChange("only Me")}
      >
        {renderRadioButton("only Me")}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>only me</Text>
          <Text style={styles.optionDescription}>
            only you can see the post
          </Text>
        </View>
      </TouchableOpacity>
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
    marginBottom: 20,
    marginTop: 25,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },
  heading: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    color: "#aaa",
    marginBottom: 20,
  },
  subheading: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  optionTextContainer: {
    marginLeft: 10,
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  optionDescription: {
    color: "#aaa",
    fontSize: 14,
  },
});

export default PostPrivacy;
