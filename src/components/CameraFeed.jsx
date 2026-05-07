import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, Smile, Frown, Zap, Coffee, CircleOff } from 'lucide-react';

const CameraFeed = ({ currentEmotion, setCurrentEmotion }) => {
  const videoRef = useRef();
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
          
          let emotionStr = dominantExpression[0];
          if (emotionStr === 'surprised') emotionStr = 'happy';
          if (emotionStr === 'fear' || emotionStr === 'disgust') emotionStr = 'angry';
          
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
          consecutiveCounts.current = { emotion: null, count: 0 };
        }
      }
    }, 500);
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
      className={`glass-panel p-6 rounded-3xl h-full relative overflow-hidden neon-border-${currentEmotion || 'neutral'} transition-all duration-500 hover:rotate-1 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
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
            {/* HUD Overlay & Crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center mix-blend-screen opacity-30">
               <div className="w-full h-[1px] bg-white/20 absolute" />
               <div className="h-full w-[1px] bg-white/20 absolute" />
               <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white/50 rounded-full" />
               </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/50 shadow-[0_0_20px_rgba(255,255,255,1)] animate-scanline z-30 opacity-50" />

            {/* AI Scanner Corners */}
            <div className="absolute inset-0 pointer-events-none m-6 z-20">
               <motion.div 
                 className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 shadow-[-5px_-5px_15px_rgba(255,255,255,0.3)]" 
                 animate={{ opacity: faceDetected ? [1, 0.5, 1] : 0.3 }} transition={{ repeat: Infinity, duration: 1 }} 
               />
               <motion.div 
                 className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 shadow-[5px_-5px_15px_rgba(255,255,255,0.3)]" 
                 animate={{ opacity: faceDetected ? [1, 0.5, 1] : 0.3 }} transition={{ repeat: Infinity, duration: 1.2 }} 
               />
               <motion.div 
                 className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 shadow-[-5px_5px_15px_rgba(255,255,255,0.3)]" 
                 animate={{ opacity: faceDetected ? [1, 0.5, 1] : 0.3 }} transition={{ repeat: Infinity, duration: 1.1 }} 
               />
               <motion.div 
                 className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 shadow-[5px_5px_15px_rgba(255,255,255,0.3)]" 
                 animate={{ opacity: faceDetected ? [1, 0.5, 1] : 0.3 }} transition={{ repeat: Infinity, duration: 1.3 }} 
               />
            </div>
            {faceDetected && (
              <motion.div 
                className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-t from-transparent to-${currentEmotion === 'happy' ? 'pink-500' : 'blue-500'}`}
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