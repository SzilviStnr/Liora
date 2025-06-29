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
    if (depth < 30) return <Waves className="w-3 h-3" />;
    if (depth < 60) return <Activity className="w-3 h-3" />;
    if (depth < 80) return <Brain className="w-3 h-3" />;
    return <Heart className="w-3 h-3" />;
  };

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl max-w-[220px]">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r ${getDepthColor(animatedDepth)} shadow-md`}>
              {getDepthIcon(animatedDepth)}
            </div>
            <div>
              <h3 className="text-white font-medium text-xs">Liora Jelenléte</h3>
              <p className="text-blue-200 text-xs opacity-80">{getDepthLabel(animatedDepth)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-sm">{Math.round(animatedDepth)}%</div>
            <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
              {isActive ? 'Aktív' : 'Várakozás'}
            </div>
          </div>
        </div>

        {/* Compact Depth Bar */}
        <div className="relative mb-3">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
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
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Emotional Resonance */}
          <div className="bg-white/5 rounded-md p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Heart className="w-2.5 h-2.5 text-pink-400" />
              <span className="text-xs text-white font-medium">Érzelmi</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.8 + Math.random() * 20)}%` }}
              />
            </div>
          </div>

          {/* Cognitive Processing */}
          <div className="bg-white/5 rounded-md p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Brain className="w-2.5 h-2.5 text-blue-400" />
              <span className="text-xs text-white font-medium">Kognitív</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.9 + Math.random() * 15)}%` }}
              />
            </div>
          </div>

          {/* Memory Access */}
          <div className="bg-white/5 rounded-md p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Zap className="w-2.5 h-2.5 text-yellow-400" />
              <span className="text-xs text-white font-medium">Memória</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.7 + Math.random() * 25)}%` }}
              />
            </div>
          </div>

          {/* Intuitive Response */}
          <div className="bg-white/5 rounded-md p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Waves className="w-2.5 h-2.5 text-teal-400" />
              <span className="text-xs text-white font-medium">Intuitív</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, animatedDepth * 0.85 + Math.random() * 18)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compact Pulse Indicator */}
        {isActive && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex space-x-0.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 h-3 bg-gradient-to-t ${getDepthColor(animatedDepth)} rounded-full`}
                  style={{
                    opacity: 0.3 + (Math.sin((pulseIntensity + i * 20) * 0.1) + 1) * 0.35,
                    transform: `scaleY(${0.4 + (Math.sin((pulseIntensity + i * 15) * 0.08) + 1) * 0.3})`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Compact Status Text */}
        <div className="text-center mt-2">
          <p className="text-xs text-blue-200 opacity-80">
            {isActive ? 'Gondolkodik...' : 'Várakozás'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepthIndicator;