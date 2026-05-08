import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, Smile, Frown, Zap, Coffee, CircleOff } from 'lucide-react';
import cameraFrame from '../images/camera-frame.png';

const CameraFeed = ({ currentEmotion, setCurrentEmotion }) => {
  const videoRef = useRef();
  const detectionIntervalRef = useRef(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const lastEmotionRef = useRef(currentEmotion);
  const consecutiveCounts = useRef({ emotion: null, count: 0 });

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
    if (!isModelsLoaded) return;
    startVideo();
  }, [isModelsLoaded]);

  useEffect(() => {
    // Cleanup to prevent duplicate intervals and camera stream leaks.
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Starts webcam stream after model load.
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam", err));
  };

  // Converts less useful labels into app-supported moods.
  const normalizeEmotion = (emotion) => {
    if (emotion === 'surprised') return 'happy';
    if (emotion === 'fear' || emotion === 'disgust') return 'angry';
    return emotion;
  };

  // Runs every 500ms while video is playing and updates mood safely.
  const handleVideoPlay = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detections = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections) {
          setFaceDetected(true);
          const expressions = detections.expressions;
          
          const sortedExpressions = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const dominantExpression = sortedExpressions[0];
          const score = dominantExpression[1];
          
          const emotionStr = normalizeEmotion(dominantExpression[0]);
          
          setConfidence(Math.round(score * 100));

          if (score > 0.6) {
            if (consecutiveCounts.current.emotion === emotionStr) {
              consecutiveCounts.current.count += 1;
            } else {
              consecutiveCounts.current.emotion = emotionStr;
              consecutiveCounts.current.count = 1;
            }

            if (consecutiveCounts.current.count >= 2 && lastEmotionRef.current !== emotionStr) {
              lastEmotionRef.current = emotionStr;
              setCurrentEmotion(emotionStr);
            }
          }
        } else {
          setFaceDetected(false);
          setConfidence(0);
          consecutiveCounts.current = { emotion: null, count: 0 };
        }
      }
    }, 500);
  };

  // Manual fallback moods are useful when face is not detected.
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
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
    >
      <h2 className="font-bebas text-3xl mb-4 flex items-center gap-2">
        <Camera className="w-6 h-6 text-white/70" /> AI SCANNER
      </h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/45 border border-white/10 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
        <div className="relative w-full max-w-[620px] aspect-[860/599]">
          {/* Live feed embedded inside transparent screen region */}
          <div className="absolute left-[15.2%] top-[40.3%] w-[52.2%] h-[48.8%] rounded-[8%] overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            {!isModelsLoaded ? (
              <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center animate-pulse">
                <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin mb-2" />
                <span className="text-xs text-white/60 font-space">Loading AI Models...</span>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                onPlay={handleVideoPlay}
                className="w-full h-full object-cover opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/10 via-transparent to-violet-300/10 pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 rounded-[8%] pointer-events-none" />
            <motion.div
              className="absolute left-[8%] right-[8%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"
              animate={{ y: ['14%', '86%', '14%'], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Camera frame image overlay */}
          <img
            src={cameraFrame}
            alt="AI scanner camera frame"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
          />

          {/* subtle lens glass reflection */}
          <div className="absolute left-[23%] top-[44%] w-[20%] h-[10%] rounded-full bg-white/20 blur-sm opacity-40 pointer-events-none" />
          <div className="absolute left-[16%] top-[40.3%] w-[50%] h-[48.8%] rounded-[8%] border border-cyan-300/15 pointer-events-none shadow-[0_0_18px_rgba(103,232,249,0.2),0_0_14px_rgba(196,181,253,0.16)]" />
        </div>
        {isModelsLoaded && (
          <>
            {faceDetected && (
              <motion.div 
                className={`absolute left-[15.2%] top-[40.3%] w-[52.2%] h-[48.8%] rounded-[8%] pointer-events-none opacity-20 bg-gradient-to-t from-transparent to-${currentEmotion === 'happy' ? 'pink-500' : 'blue-500'}`}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            
            {faceDetected && confidence > 60 && (
              <motion.div
                className="absolute top-4 right-4 glass-panel px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 pointer-events-none z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={`badge-${currentEmotion}`}
              >
                <span className="text-xl">
                  {currentEmotion === 'happy' ? '😊' : currentEmotion === 'sad' ? '😢' : currentEmotion === 'angry' ? '😡' : '😌'}
                </span>
                <span className={`font-space font-bold uppercase text-glow text-gradient-${currentEmotion}`}>
                  {currentEmotion}
                </span>
              </motion.div>
            )}

            {!faceDetected && (
              <div className="absolute top-4 right-4 glass-panel px-4 py-2 rounded-full border border-white/20 pointer-events-none z-10">
                <span className="font-space text-sm text-white/70 animate-pulse">Scanning...</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center justify-center">
        {faceDetected ? (
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={currentEmotion}
          >
            <div className={`px-5 py-1.5 rounded-full border border-white/20 bg-black/35 backdrop-blur-sm font-space uppercase tracking-wider text-sm font-bold text-gradient-${currentEmotion} shadow-[0_0_14px_rgba(103,232,249,0.2)]`}>
              {currentEmotion}
            </div>
            <div className="text-xs font-space text-white/60">
              Confidence: {confidence}%
            </div>
          </motion.div>
        ) : (
           <div className="text-center font-space">
             <p className="text-white/50 text-sm mb-4">Scanning... (Or select manually):</p>
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