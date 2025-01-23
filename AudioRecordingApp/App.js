import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';

function RecordingApp({ onBack }) {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [pausedRecording, setPausedRecording] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Microphone permission is needed to record audio.');
      }

      // Ensure proper audio mode settings for recording on iOS
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,  // Enable recording on iOS
          playsInSilentModeIOS: true,  // Allow playback in silent mode if needed
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    };

    requestPermissions();
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setPausedRecording(false);
      Alert.alert('Recording started', 'Recording is now in progress.');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordings((prev) => [
          ...prev,
          { id: Date.now().toString(), uri },
        ]);
        setRecording(null);
        setIsRecording(false);
        setPausedRecording(false);
        Alert.alert('Recording stopped', 'Your recording has been saved.');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const pauseRecording = async () => {
    if (recording) {
      try {
        await recording.pauseAsync();
        setPausedRecording(true);
        Alert.alert('Recording paused', 'Recording has been paused.');
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      try {
        await recording.startAsync();
        setPausedRecording(false);
        Alert.alert('Recording resumed', 'Recording has been resumed.');
      } catch (error) {
        console.error('Error resuming recording:', error);
      }
    }
  };

  const playRecording = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      Alert.alert('Playing recording', 'The recording is now playing.');
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  const deleteRecording = (id) => {
    setRecordings((prev) => prev.filter((recording) => recording.id !== id));
    Alert.alert('Recording deleted', 'The recording has been removed.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Audio Recorder</Text>

      <View style={styles.buttonRow}>
        {!isRecording && (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        )}
        {isRecording && (
          <>
            {!pausedRecording ? (
              <TouchableOpacity style={styles.button} onPress={pauseRecording}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={resumeRecording}>
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={stopRecording}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>Recording {item.id}</Text>
            <View style={styles.itemButtons}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playRecording(item.uri)}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRecording(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
export default function App() {
  const [showRecordingApp, setShowRecordingApp] = useState(false);

  return showRecordingApp ? (
    <RecordingApp onBack={() => setShowRecordingApp(false)} />
  ) : (
    <WelcomePage onGetStarted={() => setShowRecordingApp(true)} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 3,
  },
  recordingText: {
    fontSize: 16,
    color: '#333',
  },
  itemButtons: {
    flexDirection: 'row',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#01579b',
  },
  getStartedButton: {
    backgroundColor: '#0288d1',
    padding: 15,
    borderRadius: 10,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
