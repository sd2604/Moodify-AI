import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const moodScores = {
  happy: 100,
  surprised: 80,
  energetic: 80,
  calm: 60,
  neutral: 50,
  sad: 20,
  angry: 0,
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2 rounded border border-white/10 text-xs font-space">
        <p className="text-white/80">{payload[0].payload.time}</p>
        <p className="font-bold text-white uppercase">{payload[0].payload.emotion}</p>
      </div>
    );
  }
  return null;
};

const MoodChart = ({ moodHistory }) => {
  const data = moodHistory.map((entry) => ({
    time: entry.time,
    emotion: entry.emotion,
    score: moodScores[entry.emotion] || 50,
  }));

  return (
    <motion.div 
      className="glass-panel p-6 rounded-3xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="font-bebas text-2xl mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-white/70" /> MOOD TIMELINE
      </h3>
      
      <div className="h-40 w-full mt-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#fff" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ff0080', strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-white/30 font-space text-sm">
            Waiting for emotional data...
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodChart;