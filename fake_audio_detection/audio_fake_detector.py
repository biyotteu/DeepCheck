import sys
import joblib
from .shared.feature_extraction import get_all_features_from_sample
import os

class AudioFakeDetector:
    def __init__(self):
        MODEL = os.path.abspath(__file__).replace("audio_fake_detector.py","")+"models/ADC_trained_model.sav"
        self.model = joblib.load(MODEL)
    
    def detect(self, audio):
        if isinstance(audio, str):
            sample_features = get_all_features_from_sample(audio)
            results = self.model.predict([sample_features])
            proba = self.model.predict_proba([sample_features])

            if results[0] == 1:
                return {
                    "score": proba[0][1],
                    "isFake": True,
                }
            else:
                return {
                    "score": proba[0][1],
                    "isFake": False,
                }

