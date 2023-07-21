import { FileSystem } from "expo";

const convertToWav = async (sourceUri) => {
  try {
    // Read the audio data from the source URI
    const audioData = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create a WAV file with a valid header
    const destinationUri = FileSystem.cacheDirectory + "audio.wav";
    await FileSystem.writeAsStringAsync(destinationUri, audioData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return destinationUri;
  } catch (error) {
    console.log("Error converting audio:", error);
    return null;
  }
};

module.exports = convertToWav;
