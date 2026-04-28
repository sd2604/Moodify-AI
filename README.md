# Moodify AI — Emotion-Based Music Recommender

Moodify AI is a React-based web app that detects your facial emotions in real time and recommends music that matches your mood.

It combines computer vision with music APIs to create an interactive, emotion-driven listening experience.

---

## Features

*  Real-time emotion detection via webcam
*  Mood-based music recommendations
*  Auto-play song previews
*  Mood trend tracking (last 5 minutes)
*  Multi-face detection with group mood analysis
*  Smart suggestions based on emotional patterns

---

## How It Works

1. The app accesses your webcam (with permission)
2. Facial expressions are analyzed using a pre-trained model
3. Detected emotion is mapped to a music category
4. Songs are fetched and displayed instantly
5. Emotion data is stored temporarily to track mood trends

---

## How to Use

1. Open the app in your browser
2. Allow camera access when prompted
3. Look at the screen — your emotion will be detected automatically
4. Recommended songs will appear and start playing preview
5. Watch your mood trend update in real time
6. If multiple faces are detected, group mood will be shown

---

## Tech Stack

* React (Frontend)
* face-api.js (Emotion Detection)
* Spotify Web API (Music Data)
* Recharts (Data Visualization)
* Tailwind CSS (Styling)
* Framer Motion (Animations)

---

## Installation & Setup

```bash
git clone https://github.com/your-username/moodify-ai.git
cd moodify-ai
npm install
npm start
```

---

## API Configuration

### Spotify API

* Create an app on Spotify Developer Dashboard
* Get your Client ID
* Add it in your config file

---

## Notes

* Camera access is required for core functionality
* Some songs may not have preview audio
* Best experienced on modern browsers (Chrome recommended)

---

##  Future Improvements

* Full song playback support
* Mobile optimization
* Enhanced emotion accuracy
* User accounts & saved mood history

---

## License

MIT License

---

## 👩‍💻 Author

GitHub: https://github.com/sd2604
