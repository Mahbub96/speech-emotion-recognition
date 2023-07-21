import librosa
import numpy as np
import soundfile
from scipy import stats
from sklearn.preprocessing import normalize


def extract_feature(file_name, mfcc, chroma, mel, tonnetz):
    fixed_length = 1000
    try:
        with soundfile.SoundFile(file_name) as sound_file:
            X = sound_file.read(dtype="float32")
            sample_rate = sound_file.samplerate
            # print(sample_rate)

            result = np.array([])

            # if mfcc:
            #     mfccs=np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            #     result=np.hstack((result, mfccs))
            if mfcc:
                mfccs = np.mean(librosa.feature.mfcc(
                    y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
                # mfccs = np.pad(mfccs, (0, pad_length - len(mfccs)), mode='constant')
                result = np.hstack((result, mfccs))

            if chroma:
                stft = np.abs(librosa.stft(X))
                chroma = np.mean(librosa.feature.chroma_stft(
                    S=stft, sr=sample_rate).T, axis=0)
                result = np.hstack((result, chroma))

            if mel:
                # mel=np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
                mel = np.mean(librosa.feature.melspectrogram(
                    y=X, sr=sample_rate).T, axis=0)

                result = np.hstack((result, mel))

            if tonnetz:
                ton = np.mean(librosa.feature.tonnetz(
                    X, sr=sample_rate).T, axis=0)
                result = np.hstack((result, ton))

        return result
    except Exception as e:
        print(f"Error extracting feature: {str(e)}")
        return None


def data_post_processing(data):
    s_sample = np.array(data)

    # Reshape s_sample to have the correct shape
    s_sample_reshaped = np.expand_dims(
        s_sample, axis=0)  # Add a batch dimension
    s_sample_reshaped = normalize(s_sample_reshaped, axis=1, norm='l1')
    print(s_sample_reshaped.min())
    print(s_sample_reshaped.max())
    return s_sample_reshaped


if __name__ == "__main__":
    import sys
    file_path = sys.argv[1]
    result = extract_feature(file_path, True, True, True, False)

    s_sample_reshaped = data_post_processing(result)

    print(s_sample_reshaped)
