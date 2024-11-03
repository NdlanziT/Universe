import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDocs, collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Dialog from 'react-native-dialog';

const Library = ({ navigation }) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      const journalCollection = collection(db, 'journals'); // Change this to 'journalEntries'
      const journalSnapshot = await getDocs(journalCollection);
      const entries = journalSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setJournalEntries(entries);
      setTotalEntries(entries.length);
      setFavoriteCount(entries.filter((entry) => entry.favorite).length);
    };
    fetchEntries();
  }, []);

  const filteredJournals = journalEntries.filter(journal =>
    (journal.text && journal.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (journal.createdDate && new Date(journal.createdDate * 1000).toLocaleDateString().includes(searchQuery))
  );

  const handleDelete = async () => {
    if (selectedJournal) {
      await deleteDoc(doc(db, 'journals', selectedJournal.id));
      setJournalEntries(journalEntries.filter(j => j.id !== selectedJournal.id));
      setTotalEntries(totalEntries - 1);
      setFavoriteCount(journalEntries.filter((entry) => entry.favorite).length);
      setShowDeleteDialog(false);
      setSelectedJournal(null);
    }
  };

  const handleToggleFavorite = async () => {
    if (selectedJournal) {
      await updateDoc(doc(db, 'journals', selectedJournal.id), { favorite: !selectedJournal.favorite });
      setJournalEntries(journalEntries.map(entry =>
        entry.id === selectedJournal.id ? { ...entry, favorite: !selectedJournal.favorite } : entry
      ));
      setFavoriteCount(journalEntries.filter((entry) => entry.favorite).length);
      setSelectedJournal(null);
    }
  };

  const handleLongPressStart = (journal) => {
    const timer = setTimeout(() => setSelectedJournal(journal), 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    setLongPressTimer(null);
  };

  const openModal = (entry) => {
    setSelectedJournal(entry);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJournal(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Journal"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" style={styles.searchIcon} />
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Total Entries: {totalEntries}</Text>
        <Text style={styles.counterText}>Favorites: {favoriteCount}</Text>
      </View>

      <FlatList
        data={filteredJournals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <TouchableOpacity
              onPress={() => openModal(item)}
              onTouchStart={() => handleLongPressStart(item)}
              onTouchEnd={handleLongPressEnd}
            >
              <View style={[
                item.mood.toLowerCase() === 'awesome' ? styles.moodAwesome :
                item.mood.toLowerCase() === 'happy' ? styles.moodHappy :
                styles.moodTerrific]}>
                <View style={styles.entryHeader}>
                  <Icon name="calendar-today" style={styles.icon} />
                  <Text style={styles.entryDate}>{new Date(item.createdDate * 1000).toLocaleDateString()}</Text>
                  {item.favorite && <Icon name="star" style={styles.favoritedIcon} />}
                </View>
                <Text style={styles.entryMood}>{item.mood}</Text>
                <Text style={styles.entryContent}>
                  <Text style={styles.entryPreview}>{item.text.slice(0, 15)}...</Text>
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => { setSelectedJournal(item); setShowDeleteDialog(true); }}>
                <Icon name="delete" size={24} color="#ff4d4d" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleToggleFavorite(); }}>
                <Icon name={item.favorite ? "star" : "star-border"} size={24} color={item.favorite ? "#FFD700" : "#ccc"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Dialog Modals */}
      <Dialog.Container visible={selectedJournal !== null && showDeleteDialog}>
        <Dialog.Title>Journal Options</Dialog.Title>
        <Dialog.Description>
          Choose an action for this journal entry
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setShowDeleteDialog(false)} />
        <Dialog.Button label="Delete" onPress={() => setShowDeleteDialog(true)} />
        <Dialog.Button label={selectedJournal?.favorite ? 'Unstar' : 'Star'} onPress={handleToggleFavorite} />
      </Dialog.Container>

      <Dialog.Container visible={showDeleteDialog}>
        <Dialog.Title>Delete Journal Entry?</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setShowDeleteDialog(false)} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>

      {/* Modal for viewing journal entry */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Journal Entry</Text>
            {selectedJournal?.images && selectedJournal.images.length > 0 && (
              <FlatList
                data={selectedJournal.images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.modalImage} />
                )}
              />
            )}
            <TextInput
              style={styles.modalTextInput}
              value={selectedJournal?.text}
              multiline={true}
              editable={false}
            />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flex: 1,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    padding: 10,
    paddingLeft: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    color: '#FFF',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 15,
    color: '#888',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  counterText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  entryContainer: {
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  moodAwesome: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
  },
  moodHappy: {
    backgroundColor: '#66BB6A',
    borderRadius: 10,
    padding: 10,
  },
  moodTerrific: {
    backgroundColor: '#FF7043',
    borderRadius: 10,
    padding: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 5,
    color: '#FFF',
  },
  entryDate: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  favoritedIcon: {
    color: '#FFD700',
    fontSize: 20,
  },
  entryMood: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  entryPreview: {
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalTextInput: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF7043',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFF',
  },
});

export default Library;
