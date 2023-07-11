import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";

// internal imports
import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Timer from "./Timer";

const convertToWav = async (sourceUri) => {
  try {
    const destinationUri = FileSystem.cacheDirectory + "audio.wav";

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.log("Error converting audio:", error);
    return null;
  }
};

const RecordingApp = () => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to record audio denied");
        return;
      }

      ToastAndroid.show("Recording Started!.", 1000);
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
      setRecording(null);
      // console.log("Recording stopped. URI:", uri);
      ToastAndroid.show("Recording stopped.", 1000);
      const wavUri = await convertToWav(uri);
      if (wavUri) {
        // extractFeature(wavUri, true, true, true, true);
        console.log("converted form of wavuri", wavUri);
      }
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  const playAudio = async () => {
    try {
      setIsRecordPlaying(true);
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: recordingUri });
      const { playableDurationMillis } = await soundObject.playAsync();

      const response = await fetch(
        "https://localhost:3050/api/v1/machine-learning/feature-extraction",
        {
          method: "POST",
          body: recordingUri,
        }
      );

      const data = await response.json();

      console.log(data);

      setTimeout(() => {
        setIsRecordPlaying(false);
      }, playableDurationMillis);
    } catch (error) {
      console.log("Error playing audio:", error);
    }
  };

  return (
    <View>
      <Timer startTimer={recording ? true : false} />
      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons
          name={recording ? "stop-circle" : "mic-circle"}
          size={64}
          color={recording ? "red" : "green"}
        />
        <Text>{recording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
      <Button
        title="Play Audio"
        onPress={playAudio}
        disabled={recording || !recordingUri || isRecordPlaying ? true : false}
      />
    </View>
  );
};

export default RecordingApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
