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
      className={`glass-panel p-6 rounded-3xl h-full relative overflow-hidden neon-border-${currentEmotion || 'neutral'} transition-all duration-500`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
    >
      <h2 className="font-bebas text-3xl mb-4 flex items-center gap-2">
        <Camera className="w-6 h-6 text-white/70" /> AI SCANNER
      </h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/45 border border-white/10 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
        {!isModelsLoaded ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin mb-2" />
            <span className="text-sm text-white/50 font-space">Loading AI Models...</span>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden bg-black/50 border border-white/15 shadow-[0_0_30px_rgba(56,189,248,0.12)]">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                onPlay={handleVideoPlay}
                className="w-full h-full object-cover opacity-85"
              />

              {/* Transparent futuristic frame */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute inset-0 rounded-2xl border border-white/10" />
                <div className="absolute inset-x-[14%] inset-y-[12%] rounded-xl border border-white/15" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30" />

                <div className="absolute top-0 left-0 w-10 h-10 rounded-tl-2xl border-t-2 border-l-2 border-cyan-300/70 shadow-[0_0_14px_rgba(103,232,249,0.45)]" />
                <div className="absolute top-0 right-0 w-10 h-10 rounded-tr-2xl border-t-2 border-r-2 border-violet-300/70 shadow-[0_0_14px_rgba(196,181,253,0.45)]" />
                <div className="absolute bottom-0 left-0 w-10 h-10 rounded-bl-2xl border-b-2 border-l-2 border-violet-300/70 shadow-[0_0_14px_rgba(196,181,253,0.45)]" />
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-br-2xl border-b-2 border-r-2 border-cyan-300/70 shadow-[0_0_14px_rgba(103,232,249,0.45)]" />

                <div className="absolute inset-x-[10%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="absolute inset-y-[10%] left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                <motion.div
                  className="absolute left-[8%] right-[8%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"
                  animate={{ y: ['18%', '82%', '18%'], opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-cyan-200/10 to-transparent" />
              </div>
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