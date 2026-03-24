import sys
import json
import pandas as pd
from textblob import TextBlob
import os

# Mapping of emotions to emojis
EMOJI_MAPPING = {
    "calm": "😌",
    "anxiety": "😰",
    "anger": "😠",
    "fear": "😨",
    "surprise": "😲",
    "sadness": "😢",
    "love": "❤️",
    "happy": "😊",
    "joy": "😊",
    "neutral": "😐",
    "relief": "😌",
    "enthusiasm": "🤩",
    "hate": "😡",
    "boredom": "😑"
}

def analyze_emotion(text):
    try:
        # Get the path to the dataset
        script_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_path = os.path.join(script_dir, "emotion_dataset_50000.csv")
        
        # 1. Basic cleaning and sentiment signal
        text_lower = text.lower()
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        # Check for negations
        negations = ["not", "no", "never", "n't", "don't", "can't", "won't", "isn't", "aren't"]
        is_negated = any(neg in text_lower.split() for neg in negations)

        if not os.path.exists(dataset_path):
            return get_fallback_sentiment(text)

        # Load dataset
        df = pd.read_csv(dataset_path)
        
        # 2. Try exact phrase match
        exact_match = df[df['text'].str.lower() == text_lower]
        if not exact_match.empty:
            emotion = exact_match.iloc[0]['emotion'].lower()
            return {"emotion": emotion, "emoji": EMOJI_MAPPING.get(emotion, "😌")}

        # 3. Keyword heuristic with dataset frequency
        # Filter out common short words and very frequent neutral words
        words = [w.strip(".,!?") for w in text_lower.split() if len(w) > 3]
        
        emotion_scores = {}
        for word in words:
            # Use regex for word boundaries
            matches = df[df['text'].str.contains(rf'\b{word}\b', case=False, na=False, regex=True)]
            if not matches.empty:
                counts = matches['emotion'].value_counts()
                for emotion, count in counts.items():
                    emotion = emotion.lower()
                    # Weight by count but also normalize
                    score = count / len(matches)
                    emotion_scores[emotion] = emotion_scores.get(emotion, 0) + score

        if emotion_scores:
            # Adjust scores based on polarity
            if polarity > 0.2:
                emotion_scores['happy'] = emotion_scores.get('happy', 0) + 1.0
                emotion_scores['joy'] = emotion_scores.get('joy', 0) + 1.0
            elif polarity < -0.2:
                emotion_scores['sadness'] = emotion_scores.get('sadness', 0) + 1.0
                emotion_scores['anger'] = emotion_scores.get('anger', 0) + 0.5
            
            # If negated, we should be careful with the top emotion
            sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
            top_emotion = sorted_emotions[0][0]
            
            # Simple negation flip for happy/sad
            if is_negated:
                if top_emotion in ["happy", "joy", "love"]:
                    top_emotion = "sadness"
                elif top_emotion == "calm":
                    top_emotion = "anxiety"

            return {"emotion": top_emotion, "emoji": EMOJI_MAPPING.get(top_emotion, "😌")}

        return get_fallback_sentiment(text)

    except Exception as e:
        return {"emotion": "calm", "emoji": "😌", "debug": str(e)}

def get_fallback_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        return {"emotion": "happy", "emoji": "😊"}
    elif polarity < -0.1:
        return {"emotion": "sadness", "emoji": "😢"}
    return {"emotion": "calm", "emoji": "😌"}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        result = analyze_emotion(input_text)
        print(json.dumps(result))
    else:
        print(json.dumps({"emotion": "calm", "emoji": "😌"}))
