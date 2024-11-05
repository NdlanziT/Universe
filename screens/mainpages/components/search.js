import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';
import { BlurView } from '@react-native-community/blur';
import { SharedElement } from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 280;
const db = getFirestore();
const storage = getStorage();

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'people', label: 'People', icon: 'people-outline' },
  { id: 'marketplace', label: 'Marketplace', icon: 'cart-outline' },
  { id: 'tutoring', label: 'Tutoring', icon: 'book-outline' }
];

const SearchScreen = ({ navigation, loggedInUserEmail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myProfileData, setMyProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showRecent, setShowRecent] = useState(true);

  // Animation values
  const searchBarAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRecentSearches();
    fetchMyProfileData();
    animateEntrance();
  }, []);

  useEffect(() => {
    // Hide recent searches when there are results or user is typing
    setShowRecent(!searchQuery && !searchResults.length);
  }, [searchQuery, searchResults]);
  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(searchBarAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchMyProfileData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const myData = usersSnapshot.docs
        .find(doc => doc.data().email === loggedInUserEmail);
      if (myData) {
        const data = myData.data();
        const profilePicUrl = await getImageUrl(`profilepictures/${data.profilepicture}`);
        setMyProfileData({
          ...data,
          profilePicture: profilePicUrl
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Enhanced search functionality
  const searchFirestore = async (searchTerm) => {
    setLoading(true);
    const results = [];
    try {
      if (activeTab === 'all' || activeTab === 'people') {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userPromises = usersSnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          const { username, name, bio, profilepicture, email, posts, followers, following, saved, favorite } = userData;
          
          if (
            (username && username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (bio && bio.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            const profilePicUrl = await getImageUrl(`profilepictures/${profilepicture}`);
            results.push({
              id: doc.id,
              username,
              name,
              email,
              bio,
              profileType: 'user',
              profilepicture: profilePicUrl,
              posts,
              followers,
              following,
              saved,
              favorite
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
          
          // Fetch post owner's profile picture
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const ownerDoc = usersSnapshot.docs.find(userDoc => 
            userDoc.data().username === owner
          );
          const ownerProfilePic = ownerDoc ? 
            await getImageUrl(`profilepictures/${ownerDoc.data().profilepicture}`) :
            'https://via.placeholder.com/40';

          const isCategoryMatch = activeTab === 'all' ||
            (activeTab === 'marketplace' && category === 'market place') ||
            (activeTab === 'tutoring' && category === 'tutoring service');

          if (
            isCategoryMatch &&
            ((owner && owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (content && content.toLowerCase().includes(searchTerm.toLowerCase())))
          ) {
            const postImageUrl = await getImageUrl(`postpictures/${media}`);
            results.push({
              id: doc.id,
              owner,
              content,
              category,
              profileType: 'post',
              media: postImageUrl,
              ownerProfilePic,
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

  // Modern Card Components
  const PostCard = ({ item, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.postCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.postHeader}>
          <Image
            source={{ uri: item.ownerProfilePic }}
            style={styles.postOwnerImage}
          />
          <Text style={styles.postOwnerText}>{item.owner}</Text>
          {item.category === 'market place' && (
            <View style={styles.categoryTag}>
              <Icon name="cart-outline" size={16} color="#fff" />
              <Text style={styles.categoryText}>Marketplace</Text>
            </View>
          )}
          {item.category === 'tutoring service' && (
            <View style={[styles.categoryTag, { backgroundColor: '#4CAF50' }]}>
              <Icon name="book-outline" size={16} color="#fff" />
              <Text style={styles.categoryText}>Tutoring</Text>
            </View>
          )}
        </View>
        
        <SharedElement id={`item.${item.id}.image`}>
          <Image
            source={{ uri: item.media }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </SharedElement>
        
        <View style={styles.postContent}>
          <Text style={styles.postText} numberOfLines={2}>
            {item.content}
          </Text>
        </View>
      </AnimatedTouchable>
    );
  };

  const handleSearchInput = debounce((text) => {
    setSearchQuery(text);
    if (text) {
      searchFirestore(text);
    } else {
      setSearchResults([]); // Clear results if input is empty
    }
  }, 300); // Adjust debounce time as needed
  

  const refreshSearchResults = async () => {
    setRefreshing(true);
    await searchFirestore(searchQuery);
    setRefreshing(false);
  };
  
  const handleProfileNavigation = (item) => {
    navigation.navigate('Profile', { userId: item.id });
  };
  
  const handlePostPress = (item) => {
    navigation.navigate('PostDetail', { postId: item.id });
  };
  
  const getImageUrl = async (path) => {
    try {
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching image URL:', error);
      return 'https://via.placeholder.com/150'; // Fallback image
    }
  };
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };
  
  const saveRecentSearch = async (searchTerm) => {
    try {
      const updatedSearches = [searchTerm, ...recentSearches]
        .slice(0, 5) // Limit to the last 5 searches
        .filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
  
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };
  
  const UserCard = ({ item, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.userCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <SharedElement id={`user.${item.id}.photo`}>
          <Image
            source={{ uri: item.profilepicture }}
            style={styles.userProfileImage}
          />
        </SharedElement>
        
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {item.username} <Text style={[styles.name, { fontStyle: 'italic' }]}>{item.name}</Text>
          </Text>
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
        </View>

        <Icon
          name="chevron-forward"
          size={24}
          color="#1e90ff"
          style={styles.arrowIcon}
        />
      </AnimatedTouchable>
    );
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      ITEM_HEIGHT * index,
      ITEM_HEIGHT * (index + 2),
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View
        style={[
          {
            transform: [{ scale }],
          },
        ]}
      >
        {item.profileType === 'post' ? (
          <PostCard
            item={item}
            onPress={() => handlePostPress(item)}
          />
        ) : (
          <UserCard
            item={item}
            onPress={() => handleProfileNavigation(item)}
          />
        )}
      </Animated.View>
    );
  };

  const CategoryTab = ({ category, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.categoryTab,
        isActive && styles.categoryTabActive
      ]}
    >
      <Icon 
        name={category.icon} 
        size={20} 
        color={isActive ? '#1e90ff' : '#888'}
        style={styles.categoryIcon}
      />
      <Text style={[
        styles.categoryLabel,
        isActive && styles.categoryLabelActive
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            transform: [
              {
                translateY: searchBarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={handleSearchInput}
          placeholder="Search people, marketplace, tutoring..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
               {searchQuery !== '' && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </Animated.View>

            {/* Category Tabs */}
            <View style={styles.categoryTabsContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryTab
              category={item}
              isActive={activeTab === item.id}
              onPress={() => setActiveTab(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoryTabsList}
        />
      </View>

      {/* Recent Searches */}
      {showRecent && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery(item);
                  searchFirestore(item);
                }}
                style={styles.recentSearchItem}
              >
                <Icon name="time-outline" size={20} color="#888" style={styles.recentSearchIcon} />
                <Text style={styles.recentSearchText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      )}

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={refreshSearchResults}
        refreshing={refreshing}
        contentContainerStyle={styles.resultsContainer}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#1e90ff" />
          ) : (
            searchQuery ? (
              <Text style={styles.noResultsText}>No results found</Text>
            ) : null
          )
        }
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E', // Darker card background
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF', // White text
  },
  clearButton: {
    marginLeft: 10,
  },
  categoryTabsContainer: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
  },
  categoryTabsList: {
    paddingHorizontal: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#252525',
  },
  categoryTabActive: {
    backgroundColor: '#1e90ff22',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#1e90ff',
  },
  recentSearchesContainer: {
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  recentSearchIcon: {
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#1e90ff',
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  postCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  postOwnerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postOwnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 5,
    marginLeft: 'auto',
  },
  categoryText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  postImage: {
    height: 150,
    width: '100%',
  },
  postContent: {
    padding: 10,
  },
  postText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  userCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    color: '#888',
  },
  bio: {
    fontSize: 12,
    color: '#888',
  },
  arrowIcon: {
    marginLeft: 10,
  },
};

export default SearchScreen;