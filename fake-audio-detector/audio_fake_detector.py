import sys
import joblib
from shared.feature_extraction import get_all_features_from_sample

class AudioFakeDetector:
    def __init__(self):
        MODEL = "models/ADC_trained_model.sav"
        self.model = joblib.load(MODEL)
    
    def detect(self, audio):
        if isinstance(audio, str):
            sample_features = get_all_features_from_sample(audio)
            results = self.model.predict([sample_features])
            if results[0] == 1:
                return {
                    "is_fake": True,
                }
            else:
                return {
                    "is_fake": False,
                }
