import sys
import joblib
from .shared.feature_extraction import get_all_features_from_sample
import os
import soundfile as sf
import librosa
from PIL import Image
import numpy as np

import matplotlib.pyplot as plt
from scipy import signal

class AudioFakeDetector:
    def __init__(self):
        MODEL = os.path.abspath(__file__).replace("audio_fake_detector.py","")+"models/ADC_trained_model.sav"
        self.model = joblib.load(MODEL)
    
    def detect(self, audio):
        if isinstance(audio, str):
            data, samplerate = sf.read(audio, dtype="float64")

            # Plot waveform
            plt.figure(figsize=(10, 4))
            plt.fill_between(range(len(data)), data, color="#5362F6")

            
            # Save the figure without borders
            plt.axis('off')
            spectrom_path = audio.replace("."+audio.split("/")[-1].split(".")[-1],".png")
            spectrom_url = "https://deepcheck.site/tmp/audio/" + spectrom_path.split("/")[-1]
            plt.savefig(spectrom_path, bbox_inches='tight', pad_inches=0)
            
            sample_features = get_all_features_from_sample(audio)
            results = self.model.predict([sample_features])
            proba = self.model.predict_proba([sample_features])

            if results[0] == 1:
                return {
                    "score": proba[0][1],
                    "isFake": True,
                    "spectrogram":spectrom_url
                }
            else:
                return {
                    "score": proba[0][1],
                    "isFake": False,
                    "spectrogram":spectrom_url
                }

