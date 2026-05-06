# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> b0ce4e11000730268935c9613fd266a06c481732
