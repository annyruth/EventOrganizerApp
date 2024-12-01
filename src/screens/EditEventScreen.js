import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);

  const handleEditEvent = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (auth.currentUser.uid !== event.userId) {
      Alert.alert('Error', 'You can only edit events you created.');
      return;
    }

    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert('Success', 'Event updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        />
        <Button title="Save Changes" onPress={handleEditEvent} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    },
  });
  