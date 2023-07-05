import { Audio } from "expo-av";
import React, { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const RecordingApp = () => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to record audio denied");
        return;
      }

      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recordingObject.startAsync();

      setRecording(recordingObject);
    } catch (error) {
      console.log("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      console.log("Recording stopped. URI:", uri);
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  const playAudio = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: recordingUri });
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing audio:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        {/* Render your recording logo here */}
        <Text style={{ fontSize: 20, paddingVertical: 20 }}>
          Start recording
        </Text>
      </TouchableOpacity>
      <Button title="Play Audio" onPress={playAudio} />
    </View>
  );
};

export default RecordingApp;
