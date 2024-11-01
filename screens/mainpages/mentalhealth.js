import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const moodTags = {
  Happy: 'happy',
  Calm: 'calm',
  Manic: 'confused', // Using 'confused' for manic, as there's no 'manic' tag in the API
  Angry: 'angry'
};

const Mentalhealth = () => {
  const navigation = useNavigation();
  const [selectedMood, setSelectedMood] = useState(null);
  const [quote, setQuote] = useState('Select a mood to see a quote.');
  const [loading, setLoading] = useState(false);

  const fetchQuote = async (mood) => {
    setLoading(true);
    try {
      const response = await fetch(`https://zenquotes.io/api/random?tag=${moodTags[mood]}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0].q); // Set the quote from the API response
      } else {
        setQuote('No quote found for this mood.');
      }
    } catch (error) {
      setQuote('Failed to fetch a quote. Try again later.');
    }
    setLoading(false);
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    fetchQuote(mood);
    // Add Firestore entry here if needed.
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Health Service</Text>

      {/* Mood Question */}
      <Text style={styles.question}>How are you feeling today?</Text>

      {/* Mood Options */}
      <View style={styles.moodContainer}>
        {Object.keys(moodTags).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodOption, selectedMood === mood && styles.moodSelected]}
            onPress={() => handleMoodSelect(mood)}
          >
            <Text style={styles.moodIcon}>{mood === 'Happy' ? '😊' : mood === 'Calm' ? '😌' : mood === 'Manic' ? '😵' : '😡'}</Text>
            <Text style={styles.moodLabel}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Session Card */}
      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>1 on 1 Sessions</Text>
        <Text style={styles.sessionText}>Let's open up to the things that matter the most</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => {/* Navigate to Book a Session Screen */}}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Links */}
      <View style={styles.navButtonsContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Journal')}>
          <Text>Journal ✍🏾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Library')}>
          <Text>Library 📃</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Text style={styles.quoteText}>"{quote}"</Text>
        )}
      </View>

      {/* Plan Expired Section */}
      <View style={styles.expiredCard}>
        <Text style={styles.expiredTitle}>Plan Expired</Text>
        <Text style={styles.expiredText}>Get back chat access and session credits</Text>
        <TouchableOpacity>
          <Text style={styles.buyMoreText}>Buy More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  question: { color: '#ccc', marginBottom: 16, fontSize: 16, textAlign: 'center' },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  moodOption: { alignItems: 'center', backgroundColor: '#333', padding: 16, borderRadius: 15 },
  moodSelected: { backgroundColor: '#555' },
  moodIcon: { fontSize: 28, color: '#fff' },
  moodLabel: { color: '#ccc', fontSize: 14 },
  sessionCard: { backgroundColor: '#fef3c7', borderRadius: 16, padding: 16, marginBottom: 16 },
  sessionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  sessionText: { color: '#4b5563', marginVertical: 8 },
  bookButton: { backgroundColor: '#000', padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  bookButtonText: { color: '#fff', fontWeight: 'bold' },
  navButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  navButton: { backgroundColor: '#ddd', padding: 16, borderRadius: 16, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  quoteCard: { backgroundColor: '#e5e7eb', borderRadius: 16, padding: 16, marginBottom: 16 },
  quoteText: { fontStyle: 'italic', color: '#000', textAlign: 'center' },
  expiredCard: { backgroundColor: '#059669', borderRadius: 16, padding: 16 },
  expiredTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  expiredText: { color: '#d1fae5', marginVertical: 8 },
  buyMoreText: { color: '#fff', fontWeight: 'bold' },
});

export default Mentalhealth;
