
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo vector icons
import { UserInfoIcon } from '../../icons/userinfo';
import { HistoryIcon } from '../../icons/historyicon';
import { BackButton } from '../../icons/back';
import { SearchIcon } from '../../icons/search';

const SearchResult = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Mock suggestions based on common searches
  const suggestions = [
    'Kicks',
    'dm for prices',
    'tutoring',
    'cables',
    'How-To Guides',
  ];

  // Load search history from local storage or set default
  useEffect(() => {
    const loadHistory = async () => {
      const history = ['tutoring service', 'shoes'];
      setSearchHistory(history);
    };
    loadHistory();
  }, []);
  const handleSuggestionSelect = (suggestion) => {
    navigateToSearchResult(suggestion);
  };
  const handleHistorySelect = (historyItem) => {
    navigateToSearchResult(historyItem);
  };
  const clearSearch = () => {
    setSearchQuery('');
  };
  const navigateToSearchResult = (query) => {
    console.log(`Navigating to SearchResultPage with query: ${query}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => console.log('Back button pressed')}>
        <BackButton size={30} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
        <SearchIcon size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {searchQuery === '' ? (
          <>
            {/* Display search history */}
            {searchHistory.length > 0 && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Search History</Text>
                {searchHistory.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.historyItem} onPress={() => handleHistorySelect(item)}>
                    <HistoryIcon size={30} color="white" />
                    <Text style={styles.historyText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <Text style={styles.historyTitle}>Suggested search</Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => handleSuggestionSelect(suggestion)}>
                <HistoryIcon size={30} color="white" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
         <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Your search</Text>
        <TouchableOpacity style={styles.historyItem} onPress={() => handleSuggestionSelect(searchQuery)}>
          <HistoryIcon size={30} color="white" />
          <Text style={styles.suggestionText}>{searchQuery}</Text>
        </TouchableOpacity>
        </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent:'space-between',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  clearButton: {
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  historyContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyText: {
    marginLeft: 10,
    color: 'white',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionText: {
    marginLeft: 10,
    color: 'white',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: 'white',
  },
});

export default SearchResult;
