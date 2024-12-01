import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db, auth } from '../../firebaseConfig';

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;

  const handleDelete = async () => {
    if (event.userId === auth.currentUser.uid) {
      try {
        await db.collection('events').doc(event.id).delete();
        navigation.goBack();
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert('You can only delete your own events.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>{event.description}</Text>
      {event.userId === auth.currentUser.uid && (
        <Button title="Delete Event" onPress={handleDelete} />
      )}
      <Button title="Back to Events" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
