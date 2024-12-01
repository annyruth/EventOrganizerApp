import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { query, collection, where, onSnapshot, getDocs } from 'firebase/firestore';

export default function FavoriteEventsScreen() {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    const favoriteQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', auth.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(favoriteQuery, (snapshot) => {
      const favorites = snapshot.docs.map((doc) => doc.data().eventId);
      fetchFavoriteEventDetails(favorites);
    });

    return () => unsubscribe();
  }, []);

  const fetchFavoriteEventDetails = async (favoriteEventIds) => {
    const eventsQuery = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const favoriteEventsData = snapshot.docs.filter((doc) =>
        favoriteEventIds.includes(doc.id)
      ).map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavoriteEvents(favoriteEventsData);
    });

    return () => unsubscribe();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
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
});
