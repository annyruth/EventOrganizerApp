import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, onSnapshot, where, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch events
    const eventQuery = query(collection(db, 'events'));
    const unsubscribeEvents = onSnapshot(eventQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch favorite events
    const favoriteQuery = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser?.uid));
    const unsubscribeFavorites = onSnapshot(favoriteQuery, (snapshot) => {
      const favoriteEventIds = snapshot.docs.map(doc => doc.data().eventId);
      setFavorites(favoriteEventIds);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeFavorites();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error logging out', error.message);
    }
  };

  const handleDeleteEvent = async (eventId, userId) => {
    if (auth.currentUser.uid !== userId) {
      Alert.alert('Error', 'You can only delete events you created.');
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      Alert.alert('Success', 'Event deleted successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleFavorite = async (eventId) => {
    const isAlreadyFavorite = favorites.includes(eventId);
    if (isAlreadyFavorite) {
      await handleRemoveFavorite(eventId);
      return;
    }

    try {
      await addDoc(collection(db, 'favorites'), {
        userId: auth.currentUser.uid,
        eventId,
      });
      Alert.alert('Success', 'Event added to favorites!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRemoveFavorite = async (eventId) => {
    try {
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', auth.currentUser.uid),
        where('eventId', '==', eventId)
      );

      const snapshot = await getDocs(favoritesQuery);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      Alert.alert('Success', 'Event removed from favorites!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>

            {item.userId === auth.currentUser?.uid && (
              <>
                <Button
                  title="Edit"
                  onPress={() => navigation.navigate('EditEvent', { event: item })}
                />
                <Button
                  title="Delete"
                  onPress={() => handleDeleteEvent(item.id, item.userId)}
                />
              </>
            )}

            <TouchableOpacity onPress={() => handleFavorite(item.id)}>
              <Text style={styles.favorite}>
                {favorites.includes(item.id) ? '★' : '☆'} Favorite
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Add Event" onPress={() => navigation.navigate('AddEvent')} />
      <Button title="View Favorites" onPress={() => navigation.navigate('FavoriteEvents')} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  event: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favorite: {
    color: 'blue',
    marginTop: 8,
  },
});
