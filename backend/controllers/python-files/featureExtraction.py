import librosa
import numpy as np
import soundfile
from scipy import stats
from sklearn.preprocessing import normalize


def extract_feature(file_name, mfcc, chroma, mel, tonnetz):
    fixed_length = 1000
    try:
        X, sample_rate = soundfile.read(file_name, dtype="float32")

        result = np.array([])

        if mfcc:
            mfccs = librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40)
            mfccs = np.resize(mfccs, (mfccs.shape[0], fixed_length))
            mfccs = np.mean(mfccs.T, axis=0)
            result = np.hstack((result, mfccs))

        if chroma:
            stft = np.abs(librosa.stft(X))
            chroma = librosa.feature.chroma_stft(S=stft, sr=sample_rate)
            chroma = np.resize(chroma, (chroma.shape[0], fixed_length))
            chroma = np.mean(chroma.T, axis=0)
            result = np.hstack((result, chroma))

        if mel:
            mel = librosa.feature.melspectrogram(y=X, sr=sample_rate)
            mel = np.resize(mel, (mel.shape[0], fixed_length))
            mel = np.mean(mel.T, axis=0)
            result = np.hstack((result, mel))

        if tonnetz:
            tonnetz = librosa.feature.tonnetz(y=X, sr=sample_rate)
            tonnetz = np.resize(tonnetz, (tonnetz.shape[0], fixed_length))
            tonnetz = np.mean(tonnetz.T, axis=0)
            result = np.hstack((result, tonnetz))

        return result
    except Exception as e:
        print(f"Error extracting feature: {str(e)}")
        return None


if __name__ == "__main__":
    import sys
    file_path = sys.argv[1]
    result = extract_feature(file_path, True, True, True, False)
    data = np.array(result)

    # Reshape X_train and X_test
    data = data.reshape(data.shape[0], -1)
    # Apply z-score normalization
    data = stats.zscore(data)
    print(data.min(), data.max())

    print(data)
