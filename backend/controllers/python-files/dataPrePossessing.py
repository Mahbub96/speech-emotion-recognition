
emotions = {

    '01': 'happy',
    '02': 'sad',
    '03': 'angry',
    '04': 'surprised',
    '05': 'neutral',
    '06': 'disgust',
    '07': 'fear',

}

'''
X_train = np.array(X_train)
X_test = np.array(X_test)

# Initialize the label encoder
le = LabelEncoder()

# Convert the labels to numerical values
y_train = np.array(le.fit_transform(y_train))
y_test = np.array(le.transform(y_test))

# data normalization

# Reshape X_train and X_test
X_train = X_train.reshape(X_train.shape[0], -1)
X_test = X_test.reshape(X_test.shape[0], -1)

# Apply normalization
X_train = normalize(X_train, axis=1, norm='l1')
X_test = normalize(X_test, axis=1, norm='l1')

X_train = normalize(X_train, axis=1, norm='l1')
X_test = normalize(X_test, axis=1, norm='l1')
'''
