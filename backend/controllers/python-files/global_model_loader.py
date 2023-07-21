import os

from keras.models import load_model

# Global variable to store the model
model = None
model_loaded = False


def load_trained_model():
    global model, model_loaded

    if not model_loaded:
        try:

            current_directory = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(
                current_directory, 'trainnedModel', 'lstm_model.h5')
            model = load_model(model_path)
            model_loaded = True
        except Exception as e:
            print('Error loading the model:', e)


# Call the function to load the model when this module is imported
load_trained_model()
