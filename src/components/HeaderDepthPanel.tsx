import React, { useState, useEffect } from 'react';
import { Brain, ChevronDown, ChevronUp, Heart, Zap, Waves, Activity, Sparkles } from 'lucide-react';

interface HeaderDepthPanelProps {
  currentDepth: number; // 0-100
  isActive: boolean;
  className?: string;
}

const HeaderDepthPanel: React.FC<HeaderDepthPanelProps> = ({ 
  currentDepth, 
  isActive, 
  className = '' 
}) => {
  const [animatedDepth, setAnimatedDepth] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
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
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className={`relative z-[9999] ${className}`}>
      {/* Compact Header Button - Wider than resonance */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-3 px-4 py-2 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 min-w-[140px] relative z-[9999]"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r ${getDepthColor(animatedDepth)} shadow-md`}>
          {getDepthIcon(animatedDepth)}
        </div>
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-sm text-white font-medium">Liora</span>
          <span className="text-sm text-cyan-300 font-bold">{Math.round(animatedDepth)}%</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-cyan-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-300" />
        )}
      </button>

      {/* Expanded Panel - FELFELÉ NYÍLIK - LEGFELSŐ RÉTEG */}
      {isExpanded && (
        <div className="fixed w-96 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden"
             style={{ 
               zIndex: 99999,
               position: 'fixed',
               top: '60px',
               left: '20px'
             }}>
          {/* Panel Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-600/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getDepthColor(animatedDepth)} shadow-md`}>
                  {getDepthIcon(animatedDepth)}
                </div>
                <div>
                  <h3 className="text-white font-medium">Liora Jelenléte</h3>
                  <p className="text-blue-200 text-sm opacity-80">{getDepthLabel(animatedDepth)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-xl">{Math.round(animatedDepth)}%</div>
                <div className={`text-sm ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
                  {isActive ? 'Aktív' : 'Várakozás'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Depth Bar */}
          <div className="p-4">
            <div className="relative mb-4">
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
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
              <div className="text-center mt-2">
                <span className="text-sm text-white/80">Mélység szint</span>
              </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Emotional Resonance */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-white font-medium">Érzelmi</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, animatedDepth * 0.8 + Math.random() * 20)}%` }}
                  />
                </div>
              </div>

              {/* Cognitive Processing */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white font-medium">Kognitív</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, animatedDepth * 0.9 + Math.random() * 15)}%` }}
                  />
                </div>
              </div>

              {/* Memory Access */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-white font-medium">Memória</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, animatedDepth * 0.7 + Math.random() * 25)}%` }}
                  />
                </div>
              </div>

              {/* Intuitive Response */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Waves className="w-4 h-4 text-teal-400" />
                  <span className="text-xs text-white font-medium">Intuitív</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, animatedDepth * 0.85 + Math.random() * 18)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pulse Visualization */}
            {isActive && (
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-6 bg-gradient-to-t ${getDepthColor(animatedDepth)} rounded-full`}
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
            <div className="text-center">
              <p className="text-sm text-blue-200 opacity-80">
                {isActive ? 'Gondolkodik...' : 'Várakozás'}
              </p>
              <p className="text-xs text-cyan-300 mt-1">
                {animatedDepth >= 80 ? '💜 Teljes jelenlét' :
                 animatedDepth >= 60 ? '✨ Mély kapcsolódás' :
                 animatedDepth >= 40 ? '🌸 Növekvő mélység' :
                 '🌱 Hangolódás'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDepthPanel;