import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';

const db = getFirestore();
const storage = getStorage();

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

  const getImageUrl = async (path) => {
    try {
      const imageRef = ref(storage, path);
      return await getDownloadURL(imageRef);
    } catch (error) {
      return 'https://via.placeholder.com/40';
    }
  };

  const searchFirestore = async (searchTerm) => {
    setLoading(true);
    const results = [];

    try {
      if (activeTab === 'all' || activeTab === 'people') {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userPromises = usersSnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          const { username, name, bio, profilepicture } = userData;
          if (
            (username && username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (bio && bio.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            const profilePicPath = `profilepictures/${profilepicture}`;
            const profilePictureUrl = await getImageUrl(profilePicPath);
            results.push({
              id: doc.id,
              username,
              name,
              bio,
              profileType: 'user',
              profilepicture: profilePictureUrl,
            });
          }
        });
        await Promise.all(userPromises);
      }

      if (activeTab === 'all' || activeTab === 'marketplace' || activeTab === 'tutoring') {
        const postsSnapshot = await getDocs(collection(db, 'post'));
        const postPromises = postsSnapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const { owner, category, content, media } = postData;
          const isCategoryMatch =
            activeTab === 'all' ||
            (activeTab === 'marketplace' && category === 'market place') ||
            (activeTab === 'tutoring' && category === 'tutoring service');
          if (
            isCategoryMatch &&
            ((owner && owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (content && content.toLowerCase().includes(searchTerm.toLowerCase())))
          ) {
            const postPicPath = `postpictures/${media}`;
            const postImageUrl = await getImageUrl(postPicPath);
            results.push({
              id: doc.id,
              owner,
              content,
              category,
              profileType: 'post',
              media: postImageUrl,
            });
          }
        });
        await Promise.all(postPromises);
      }

      setSearchResults(results);
      if (searchTerm) saveRecentSearch(searchTerm);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 2) {
      searchFirestore(query);
    } else {
      setSearchResults([]);
    }
  }, 300);

  const handleSearchInput = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    searchFirestore(query);
  };

  const renderSearchResult = ({ item }) => (
    <View style={styles.resultCard}>
      {item.profileType === 'post' ? (
        <View>
          <Text style={[styles.resultText, { color: '#1e90ff' }]}>🆔{item.owner}</Text>
          <Text style={styles.resultText}>-{item.content}</Text>
          <Image source={{ uri: item.media || 'https://via.placeholder.com/150' }} style={styles.postImage} />
        </View>
      ) : (
        <View style={styles.userResult}>
          <Image source={{ uri: item.profilepicture }} style={styles.profileImage} />
          <View>
            <Text style={[styles.resultText, { color: '#1e90ff' }]}>🪪{item.username} ~<Text style={{ color: 'blue', fontStyle: 'italic', fontWeight: '130' }}> {item.name}</Text></Text>
            <Text style={styles.resultText}>Bio: {item.bio}</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={handleSearchInput}
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
  resultCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
};

export default SearchScreen;

