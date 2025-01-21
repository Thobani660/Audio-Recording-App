import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { Audio } from 'expo-av';

export default function VoiceNote({ uri }) {
  const [sound, setSound] = useState();

  const playSound = async () => {
    const { sound: playbackObj } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(playbackObj);
  };

  return (
    <View style={{ padding: 10 }}>
      <Button title="Play" onPress={playSound} />
    </View>
  );
}
