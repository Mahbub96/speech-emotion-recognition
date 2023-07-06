import { Audio } from "expo-av";

function resizeArray(arr, shape) {
  const resizedArray = [];

  for (let i = 0; i < shape[0]; i++) {
    const row = [];

    for (let j = 0; j < shape[1]; j++) {
      row.push(arr[i][j % arr[i].length]);
    }

    resizedArray.push(row);
  }

  return resizedArray;
}

function getMean(arr) {
  const meanArray = [];

  for (let i = 0; i < arr.length; i++) {
    const mean = arr[i].reduce((a, b) => a + b, 0) / arr[i].length;
    meanArray.push(mean);
  }

  return meanArray;
}

export default async function extractFeature(
  file_path,
  mfcc,
  chroma,
  mel,
  tonnetz
) {
  try {
    // Load the audio file using Expo's Audio API
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: file_path });
    const status = await soundObject.getStatusAsync();

    const { durationMillis, sampleRate } = status;

    const X = durationMillis;
    const sample_rate = sampleRate;

    console.log(41, file_path, status);
    let result = [];
    // lot of bugs
    // if (mfcc) {
    //   let mfccs = librosa.feature.mfcc(X, sample_rate, { n_mfcc: 40 });
    //   mfccs = resizeArray(mfccs, [mfccs.shape[0], fixed_length]);
    //   mfccs = getMean(mfccs.T);
    //   result = result.concat(mfccs);
    // }

    // if (chroma) {
    //   const stft = np.abs(librosa.stft(X));
    //   let chroma = librosa.feature.chroma_stft(stft, sample_rate);
    //   chroma = resizeArray(chroma, [chroma.shape[0], fixed_length]);
    //   chroma = getMean(chroma.T);
    //   result = result.concat(chroma);
    // }

    // if (mel) {
    //   let mel = librosa.feature.melspectrogram(X, sample_rate);
    //   mel = resizeArray(mel, [mel.shape[0], fixed_length]);
    //   mel = getMean(mel.T);
    //   result = result.concat(mel);
    // }

    // if (tonnetz) {
    //   let tonnetz = librosa.feature.tonnetz(X, sample_rate);
    //   tonnetz = resizeArray(tonnetz, [tonnetz.shape[0], fixed_length]);
    //   tonnetz = getMean(tonnetz.T);
    //   result = result.concat(tonnetz);
    // }

    // Use the 'result' array as needed
    console.log("Extracted features:");
    return result;
  } catch (error) {
    console.log("Error loading audio file:", error);
  }
}
