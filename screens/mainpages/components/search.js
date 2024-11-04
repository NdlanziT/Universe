import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getFirestore();

const SearchScreen = ({ loggedInUserEmail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const recent = await AsyncStorage.getItem('recentSearches');
    if (recent) setRecentSearches(JSON.parse(recent));
  };

  const saveRecentSearch = async (query) => {
    const updatedSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const searchFirestore = async (searchTerm) => {
    setLoading(true);
    const results = [];

    try {
      // Searching for users
      if (activeTab === 'all' || activeTab === 'people') {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const { username, name } = userData;
          if (
            (username && username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (name && name.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            results.push({
              id: doc.id,
              username,
              name,
              profileType: 'user',
              profilepicture: userData.profilepicture || 'https://via.placeholder.com/40',
            });
          }
        });
      }

      // Searching for posts
      if (activeTab === 'all' || activeTab === 'marketplace' || activeTab === 'tutoring') {
        const postsSnapshot = await getDocs(collection(db, 'post'));
        postsSnapshot.forEach((doc) => {
          const postData = doc.data();
          const { owner, category, media } = postData;
          const isCategoryMatch =
            activeTab === 'all' ||
            (activeTab === 'marketplace' && category === 'market place') ||
            (activeTab === 'tutoring' && category === 'tutoring service');
          if (
            isCategoryMatch &&
            ((owner && owner.toLowerCase().includes(searchTerm.toLowerCase())) || category.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            results.push({
              id: doc.id,
              owner,
              media,
              category,
              profileType: 'post',
            });
          }
        });
      }

      setSearchResults(results);
      if (searchTerm) saveRecentSearch(searchTerm);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) searchFirestore(query);
    else setSearchResults([]);
  };

  const renderSearchResult = ({ item }) => (
    <View style={styles.postCard}>
      {item.profileType === 'post' ? (
        <View>
          <Text style={styles.resultText}>{item.owner}</Text>
          <Text style={styles.resultText}>{item.category}</Text>
          <Image source={{ uri: item.media || 'https://via.placeholder.com/150' }} style={styles.postImage} />
        </View>
      ) : (
        <View style={styles.userResult}>
          <Image source={{ uri: item.profilepicture }} style={styles.profileImage} />
          <Text style={styles.resultText}>{item.username || item.name}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {['all', 'people', 'marketplace', 'tutoring'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderSearchResult}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              {searchQuery ? 'No results found' : 'Search for something'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#1e90ff',
  },
  tabText: {
    color: 'white',
    textTransform: 'capitalize',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyMessage: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  postCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  resultText: {
    color: 'white',
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
};

export default SearchScreen;
