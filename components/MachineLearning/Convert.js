import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default async function convertToWav(inputFileUri) {
  const outputFileName = "output.wav";
  const outputFileUri = `${FileSystem.documentDirectory}${outputFileName}`;

  try {
    const { sound } = await Audio.Sound.createAsync({ uri: inputFileUri });
    await sound.exportAsync({
      uri: outputFileUri,
      format: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    });

    const { exists, size } = await FileSystem.getInfoAsync(outputFileUri);

    if (exists && size > 0) {
      return outputFileUri;
    } else {
      console.log("Error converting audio file to WAV format");
      return null;
    }
  } catch (error) {
    console.log("Error converting audio file:", error);
    return null;
  }
}
