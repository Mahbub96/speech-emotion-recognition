import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";

// internal imports
import axios from "axios";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Timer from "./Timer";

const RecordingApp = () => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to record audio denied");
        return;
      }

      console.log("Recording Started!");
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
      setEmotion("");
      setLoading(true);
      console.log("Recording stopped. URI:", uri);

      const wavUri = await convertToWav(uri);
      if (wavUri) {
        console.log("Converted form of wavUri:", wavUri);
        uploadAudioFile(wavUri);
      } else {
        console.log("Error converting audio to WAV format");
      }
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

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

  const uploadAudioFile = async (audioUri) => {
    try {
      const audioFile = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append("recording", audioFile, "audio.wav");

      const response = await axios.post(
        "http://192.168.0.107:3050/api/v1/machine-learning/feature-extraction",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // const arrData = response.data.split(" ");
      const arrData = response.data.split(" ");
      const finalEmotion = arrData[arrData.length - 1];

      // Extract the emotion using regular expressions
      const emotions = finalEmotion.match(/step\s+(\w+)/)[1];

      setLoading(false);
      setEmotion(emotions);
      console.log(91, emotions);
    } catch (error) {
      console.log("Error uploading audio file:", error);
    }
  };

  const playAudio = async () => {
    try {
      setIsRecordPlaying(true);
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: recordingUri });
      const { playableDurationMillis } = await soundObject.playAsync();

      setTimeout(() => {
        setIsRecordPlaying(false);
      }, playableDurationMillis);
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <View>
      {emotion ? (
        <Text style={styles.emotion}>Your Emotion is : {emotion}</Text>
      ) : loading ? (
        <Text style={styles.emotion}>Finding Emotion...</Text>
      ) : (
        <Text></Text>
      )}
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
    marginBottom: 20,
  },
  emotion: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    top: -100,
  },
});
