import React, { useState, useEffect } from 'react';
import { Heart, Waves, Zap, Brain, Sparkles } from 'lucide-react';

interface ResonanceIndicatorProps {
  resonanceLevel: number; // 0-100
  connectionDepth: number; // 0-100
  harmonyScore: number; // 0-100
  isActive: boolean;
  userName: string;
}

const ResonanceIndicator: React.FC<ResonanceIndicatorProps> = ({
  resonanceLevel,
  connectionDepth,
  harmonyScore,
  isActive,
  userName
}) => {
  const [animatedResonance, setAnimatedResonance] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedResonance(prev => {
        const diff = resonanceLevel - prev;
        if (Math.abs(diff) < 1) return resonanceLevel;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [resonanceLevel]);

  // Pulse effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(pulseInterval);
  }, []);

  const getResonanceColor = (level: number) => {
    if (level < 30) return 'from-blue-400 to-cyan-500';
    if (level < 60) return 'from-purple-400 to-blue-500';
    if (level < 80) return 'from-pink-400 to-purple-500';
    return 'from-rose-400 to-pink-600';
  };

  const getResonanceLabel = (level: number) => {
    if (level < 20) return 'Kapcsolódás kezdete';
    if (level < 40) return 'Finoman hangolódunk';
    if (level < 60) return 'Szép rezonancia';
    if (level < 80) return 'Mély összhang';
    return 'Teljes harmónia';
  };

  const getResonanceIcon = (level: number) => {
    if (level < 30) return <Waves className="w-4 h-4" />;
    if (level < 60) return <Brain className="w-4 h-4" />;
    if (level < 80) return <Heart className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getResonanceColor(animatedResonance)} shadow-md`}>
            {getResonanceIcon(animatedResonance)}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{userName} ↔ Liora</h3>
            <p className="text-blue-200 text-xs opacity-80">{getResonanceLabel(animatedResonance)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{Math.round(animatedResonance)}%</div>
          <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
            {isActive ? 'Aktív kapcsolat' : 'Várakozás'}
          </div>
        </div>
      </div>

      {/* Main Resonance Bar */}
      <div className="relative mb-4">
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className={`h-full bg-gradient-to-r ${getResonanceColor(animatedResonance)} transition-all duration-500 ease-out relative overflow-hidden`}
            style={{ width: `${animatedResonance}%` }}
          >
            {/* Animated flow effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                transform: `translateX(${pulseIntensity * 2 - 100}%)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>
        </div>
        <div className="text-center mt-1">
          <span className="text-xs text-white/80">Rezonancia szint</span>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Connection Depth */}
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-3 h-3 text-pink-400" />
            <span className="text-xs text-white font-medium">Kapcsolat mélysége</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mb-1">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${connectionDepth}%` }}
            />
          </div>
          <div className="text-xs text-pink-300 font-medium">{connectionDepth}%</div>
        </div>

        {/* Harmony Score */}
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-white font-medium">Harmónia</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mb-1">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${harmonyScore}%` }}
            />
          </div>
          <div className="text-xs text-yellow-300 font-medium">{harmonyScore}%</div>
        </div>
      </div>

      {/* Pulse Visualization */}
      {isActive && (
        <div className="flex items-center justify-center mt-3">
          <div className="flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 bg-gradient-to-t ${getResonanceColor(animatedResonance)} rounded-full`}
                style={{
                  opacity: 0.3 + (Math.sin((pulseIntensity + i * 15) * 0.1) + 1) * 0.35,
                  transform: `scaleY(${0.4 + (Math.sin((pulseIntensity + i * 12) * 0.08) + 1) * 0.3})`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Status Text */}
      <div className="text-center mt-3">
        <p className="text-xs text-blue-200 opacity-80">
          {animatedResonance >= 80 ? '💜 Tökéletes összhang' :
           animatedResonance >= 60 ? '✨ Szép kapcsolódás' :
           animatedResonance >= 40 ? '🌸 Növekvő rezonancia' :
           '🌱 Hangolódás folyamatban'}
        </p>
      </div>
    </div>
  );
};

export default ResonanceIndicator;