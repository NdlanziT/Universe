// Journal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Journal = () => {
  const navigation = useNavigation();
  const [journalText, setJournalText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulleted, setIsBulleted] = useState(false);

  const moods = [
    { label: 'Happy', emoji: '😊', color: '#ec4899' },
    { label: 'Calm', emoji: '😌', color: '#9d4edd' },
    { label: 'Manic', emoji: '😵', color: '#22d3ee' },
    { label: 'Angry', emoji: '😡', color: '#fb923c' },
  ];

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.cancelled) {
        if (result.selected) {
          setSelectedImages([...selectedImages, ...result.selected.map(asset => asset.uri)]);
        } else {
          setSelectedImages([...selectedImages, result.uri]);
        }
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert("Error", "An error occurred while picking images.");
    }
  };

  const uploadImagesToFirebase = async () => {
    const imageUrls = [];
    for (const uri of selectedImages) {
      const fileName = `${Date.now()}-${uri.split('/').pop()}`;
      const imageRef = ref(storage, `journal-images/${fileName}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  };

  const saveJournal = async () => {
    if (!journalText.trim() && selectedImages.length === 0 && !selectedMood) {
      Alert.alert("Empty Entry", "Please add some text, select images, or choose a mood before saving.");
      return;
    }

    setIsLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      let imageUrls = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImagesToFirebase();
      }

      await addDoc(collection(db, 'journals'), {
        userId,
        text: journalText,
        images: imageUrls,
        mood: selectedMood,
        createdAt: serverTimestamp(),
        favorite: false,  // Add favorite field
      });

      setJournalText('');
      setSelectedImages([]);
      setSelectedMood(null);
      Alert.alert("Success", "Your journal entry has been saved.");
      navigation.navigate('Library');  // Navigate back to Library after saving
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert("Error", "An error occurred while saving your journal entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(imageUri => imageUri !== uri));
  };

  const toggleBulletList = () => {
    setIsBulleted(!isBulleted);
    if (!isBulleted) {
      setJournalText(prevText => `• ${prevText.replace(/\n/g, "\n• ")}`);
    } else {
      setJournalText(prevText => prevText.replace(/\n• /g, "\n"));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Journal</Text>

        <Text style={styles.sectionTitle}>Select Your Mood</Text>
        <ScrollView horizontal contentContainerStyle={styles.moodContainer} showsHorizontalScrollIndicator={false}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[
                styles.moodButton,
                selectedMood === mood.label && { backgroundColor: mood.color }
              ]}
              onPress={() => setSelectedMood(mood.label)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          style={styles.journalInput}
          multiline
          placeholder="Write your journal entry here..."
          placeholderTextColor="#666"
          value={journalText}
          onChangeText={setJournalText}
        />

        {selectedImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <ScrollView horizontal>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(uri)}
                  >
                    <Icon name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={pickImages}>
          <Icon name="camera" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleBulletList}>
          <Icon name="format-list-bulleted" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveJournal}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="content-save" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollView: { padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 18, color: '#ccc', marginBottom: 10 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  moodButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', padding: 15, borderRadius: 10, marginRight: 10, width: 80 },
  moodEmoji: { fontSize: 24, marginBottom: 5 },
  moodLabel: { color: '#fff', fontSize: 14 },
  journalInput: { minHeight: 120, fontSize: 16, color: '#fff', textAlignVertical: 'top', backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, marginBottom: 20 },
  imagePreviewContainer: { marginBottom: 20 },
  imagePreview: { marginRight: 10, position: 'relative' },
  previewImage: { width: 100, height: 100, borderRadius: 10 },
  removeImageButton: { position: 'absolute', top: -10, right: -10, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 16, backgroundColor: '#1e1e1e', borderTopWidth: 1, borderTopColor: '#333' },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 20 },
});

export default Journal;
