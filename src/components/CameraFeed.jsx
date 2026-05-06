import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function CameraFeed() {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");

  useEffect(() => {
    const start = async () => {
      try {
        // ✅ Load models
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        // ✅ Start camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        // ✅ Detection loop
        intervalRef.current = setInterval(async () => {
          if (!videoRef.current) return;

          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
            )
            .withFaceExpressions();

          if (detections.length > 0) {
            const expressions = detections[0].expressions;

            const maxEmotion = Object.keys(expressions).reduce((a, b) =>
              expressions[a] > expressions[b] ? a : b
            );

            setEmotion(maxEmotion);
          } else {
            setEmotion("No face");
          }
        }, 2000);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    start();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 h-[400px] rounded-xl relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-lg text-sm">
        {emotion}
      </div>
    </div>
  );
}
