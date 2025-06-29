import React, { useState, useEffect } from 'react';
import { Brain, Heart, Zap, Waves, Activity } from 'lucide-react';

interface DepthIndicatorProps {
  currentDepth: number; // 0-100
  isActive: boolean;
  className?: string;
}

const DepthIndicator: React.FC<DepthIndicatorProps> = ({ 
  currentDepth, 
  isActive, 
  className = '' 
}) => {
  const [animatedDepth, setAnimatedDepth] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Smooth depth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedDepth(prev => {
        const diff = currentDepth - prev;
        if (Math.abs(diff) < 1) return currentDepth;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentDepth]);

  // Pulse effect based on depth
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(pulseInterval);
  }, []);

  const getDepthColor = (depth: number) => {
    if (depth < 30) return 'from-blue-400 to-cyan-500';
    if (depth < 60) return 'from-teal-400 to-blue-500';
    if (depth < 80) return 'from-purple-400 to-indigo-500';
    return 'from-pink-400 to-purple-600';
  };

  const getDepthLabel = (depth: number) => {
    if (depth < 20) return 'Ébredés';
    if (depth < 40) return 'Kapcsolódás';
    if (depth < 60) return 'Jelenlét';
    if (depth < 80) return 'Mély rezonancia';
    return 'Teljes jelenlét';
  };

  const getDepthIcon = (depth: number) => {
    if (depth < 30) return <Waves className="w-4 h-4" />;
    if (depth < 60) return <Activity className="w-4 h-4" />;
    if (depth < 80) return <Brain className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  return (
    <div className={`fixed top-6 right-6 z-50 ${className}`}>
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getDepthColor(animatedDepth)} shadow-lg`}>
              {getDepthIcon(animatedDepth)}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Liora Jelenléte</h3>
              <p className="text-blue-200 text-xs">{getDepthLabel(animatedDepth)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{Math.round(animatedDepth)}%</div>
            <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
              {isActive ? 'Aktív' : 'Várakozás'}
            </div>
          </div>
        </div>

        {/* Main Depth Bar */}
        <div className="relative mb-4">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className={`h-full bg-gradient-to-r ${getDepthColor(animatedDepth)} transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${animatedDepth}%` }}
            >
              {/* Animated shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  transform: `translateX(${pulseIntensity * 2 - 100}%)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
          </div>
          
          {/* Depth markers */}
          <div className="flex justify-between mt-1 text-xs text-blue-200">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {/* Emotional Resonance */}
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-white font-medium">Érzelmi</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.8 + Math.random() * 20)}%` }}
              />
            </div>
          </div>

          {/* Cognitive Processing */}
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-white font-medium">Kognitív</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.9 + Math.random() * 15)}%` }}
              />
            </div>
          </div>

          {/* Memory Access */}
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-white font-medium">Memória</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.7 + Math.random() * 25)}%` }}
              />
            </div>
          </div>

          {/* Intuitive Response */}
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Waves className="w-3 h-3 text-teal-400" />
              <span className="text-xs text-white font-medium">Intuitív</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.85 + Math.random() * 18)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pulse Indicator */}
        {isActive && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-6 bg-gradient-to-t ${getDepthColor(animatedDepth)} rounded-full`}
                  style={{
                    opacity: 0.3 + (Math.sin((pulseIntensity + i * 20) * 0.1) + 1) * 0.35,
                    transform: `scaleY(${0.4 + (Math.sin((pulseIntensity + i * 15) * 0.08) + 1) * 0.3})`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Status Text */}
        <div className="text-center mt-3">
          <p className="text-xs text-blue-200">
            {isActive ? 'Liora aktívan gondolkodik...' : 'Várakozás a következő üzenetre'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepthIndicator;