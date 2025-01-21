import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Audio } from 'expo-av';

const HomeScreen = () => {
  const [recordings, setRecordings] = useState([]); // List of voice notes
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState();

  // Function to start recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to stop recording
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordings([...recordings, { uri }]);
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Play recording
  const playRecording = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View>
      <Text>Audio Recording App</Text>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={isRecording ? stopRecording : startRecording} />
      <FlatList
        data={recordings}
        renderItem={({ item }) => (
          <View>
            <Text>{item.uri}</Text>
            <Button title="Play" onPress={() => playRecording(item.uri)} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;
