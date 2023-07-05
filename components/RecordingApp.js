import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

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
      console.log("Recording stopped. URI:", uri);
      ToastAndroid.show("Recording stopped.", 1000);
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
        disabled={recording || !recordingUri ? true : false}
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
