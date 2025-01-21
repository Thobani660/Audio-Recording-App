import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState(null); // To store the recording object
  const [isRecording, setIsRecording] = useState(false); // Flag to check if recording is in progress
  const [recordedNotes, setRecordedNotes] = useState([]); // Store the list of recorded notes

  // Request microphone permission
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      console.log(status);  // Log the permission status
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
      }
    };
    getPermissions();
  }, []);

  // Start/Stop recording handler
  const handleRecord = async () => {
    Alert.alert('Button Clicked', isRecording ? 'Stopping the recording' : 'Starting the recording'); // Alert on button click
    if (isRecording) {
      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped, URI:', uri);  // Log the URI
      setRecordedNotes([...recordedNotes, { uri, id: Date.now().toString() }]);
      setRecording(null);
    } else {
      // Start a new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      console.log('Recording started:', newRecording);  // Log the recording object
      setRecording(newRecording);
    }
    setIsRecording(!isRecording);
  };

  // Play recorded audio
  const handlePlay = async (uri) => {
    Alert.alert('Button Clicked', 'Playing the audio'); // Alert on button click
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
    console.log('Playing sound:', uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={handleRecord}
        color={isRecording ? '#FF5722' : '#4CAF50'}
      />
      
      <FlatList
        data={recordedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>Voice Note: {item.id}</Text>
            <Button 
              title="Play" 
              onPress={() => handlePlay(item.uri)} 
              color="#2196F3"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noteItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
});
