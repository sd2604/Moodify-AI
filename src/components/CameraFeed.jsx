import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, Smile, Frown, Zap, Coffee, CircleOff } from 'lucide-react';

const CameraFeed = ({ currentEmotion, setCurrentEmotion }) => {
  const videoRef = useRef();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error('Error loading face-api models', err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (isModelsLoaded) {
      startVideo();
    }
  }, [isModelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam", err));
  };

  const handleVideoPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections) {
          setFaceDetected(true);
          const expressions = detections.expressions;
          
          // Map face-api expressions to our states: happy, sad, angry, neutral, surprised (map surprised to energetic/zap or just handle it)
          // For simplicity we will stick to: happy, sad, angry, neutral
          const sortedExpressions = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const dominantExpression = sortedExpressions[0];
          
          let emotionStr = dominantExpression[0];
          if (emotionStr === 'surprised') emotionStr = 'happy'; // Mapping surprise to happy/energetic
          if (emotionStr === 'fear' || emotionStr === 'disgust') emotionStr = 'angry';
          
          setConfidence(Math.round(dominantExpression[1] * 100));
          if (emotionStr !== currentEmotion) {
             setCurrentEmotion(emotionStr);
          }
        } else {
          setFaceDetected(false);
        }
      }
    }, 1000);
  };

  const manualMoods = [
    { name: 'happy', icon: <Smile className="w-5 h-5" /> },
    { name: 'sad', icon: <Frown className="w-5 h-5" /> },
    { name: 'angry', icon: <Zap className="w-5 h-5" /> },
    { name: 'neutral', icon: <CircleOff className="w-5 h-5" /> },
    { name: 'calm', icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <motion.div 
      className={`glass-panel p-6 rounded-3xl h-full relative overflow-hidden neon-border-${currentEmotion || 'neutral'} transition-all duration-500`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="font-bebas text-3xl mb-4 flex items-center gap-2">
        <Camera className="w-6 h-6 text-white/70" /> AI SCANNER
      </h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
        {!isModelsLoaded ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin mb-2" />
            <span className="text-sm text-white/50 font-space">Loading AI Models...</span>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              onPlay={handleVideoPlay}
              className="w-full h-full object-cover opacity-80"
            />
            {/* AI Scanner overlay UI */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 m-4">
               {/* Corner Brackets */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30" />
            </div>
            {faceDetected && (
              <motion.div 
                className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-t from-transparent to-${currentEmotion === 'happy' ? 'pink-500' : 'blue-500'}`}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center justify-center">
        {faceDetected ? (
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={currentEmotion}
          >
            <div className={`px-6 py-2 rounded-full glass-panel border font-space uppercase tracking-widest text-lg font-bold text-gradient-${currentEmotion}`}>
              {currentEmotion}
            </div>
            <div className="text-sm font-space text-white/50 mt-2">
              Confidence: {confidence}%
            </div>
          </motion.div>
        ) : (
           <div className="text-center font-space">
             <p className="text-white/50 text-sm mb-4">No face detected. Select manually:</p>
             <div className="flex flex-wrap gap-2 justify-center">
               {manualMoods.map(mood => (
                 <button
                   key={mood.name}
                   onClick={() => setCurrentEmotion(mood.name)}
                   className={`p-2 rounded-xl glass-panel-hover flex items-center gap-2 transition-all ${currentEmotion === mood.name ? `border border-white/50 bg-white/10` : 'border border-white/5'}`}
                 >
                   {mood.icon}
                   <span className="text-xs uppercase">{mood.name}</span>
                 </button>
               ))}
             </div>
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraFeed;