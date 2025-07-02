import React, { useState } from 'react';
import { Heart, ChevronDown, ChevronUp, Brain, Sparkles } from 'lucide-react';

interface HeaderResonancePanelProps {
  resonanceLevel: number; // 0-100
  connectionDepth: number; // 0-100
  harmonyScore: number; // 0-100
  isActive: boolean;
  userName: string;
}

const HeaderResonancePanel: React.FC<HeaderResonancePanelProps> = ({
  resonanceLevel,
  connectionDepth,
  harmonyScore,
  isActive,
  userName
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getResonanceColor = (level: number) => {
    if (level < 30) return 'from-blue-400 to-cyan-500';
    if (level < 60) return 'from-purple-400 to-blue-500';
    if (level < 80) return 'from-pink-400 to-purple-500';
    return 'from-rose-400 to-pink-600';
  };

  const getResonanceLabel = (level: number) => {
    if (level < 20) return 'Kapcsolódás';
    if (level < 40) return 'Hangolódás';
    if (level < 60) return 'Rezonancia';
    if (level < 80) return 'Összhang';
    return 'Harmónia';
  };

  return (
    <div className="relative">
      {/* Compact Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10"
      >
        <Heart className="w-4 h-4 text-pink-400" />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white font-medium">{Math.round(resonanceLevel)}%</span>
          <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
            {getResonanceLabel(resonanceLevel)}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-cyan-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-300" />
        )}
      </button>

      {/* Expanded Panel - FELFELÉ NYÍLIK */}
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <h3 className="text-white font-medium">{userName} ↔ Liora</h3>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-lg">{Math.round(resonanceLevel)}%</div>
                <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
                  {isActive ? 'Aktív kapcsolat' : 'Várakozás'}
                </div>
              </div>
            </div>
            <p className="text-blue-200 text-sm opacity-80">{getResonanceLabel(resonanceLevel)}</p>
          </div>

          {/* Main Resonance Bar */}
          <div className="p-4">
            <div className="relative mb-4">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className={`h-full bg-gradient-to-r ${getResonanceColor(resonanceLevel)} transition-all duration-500 ease-out relative overflow-hidden`}
                  style={{ width: `${resonanceLevel}%` }}
                >
                  {/* Animated flow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-white/80">Rezonancia szint</span>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Connection Depth */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white font-medium">Kapcsolat mélysége</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${connectionDepth}%` }}
                  />
                </div>
                <div className="text-xs text-blue-300 font-medium">{connectionDepth}%</div>
              </div>

              {/* Harmony Score */}
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
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

            {/* Status Text */}
            <div className="text-center mt-4">
              <p className="text-xs text-blue-200 opacity-80">
                {resonanceLevel >= 80 ? '💜 Tökéletes összhang' :
                 resonanceLevel >= 60 ? '✨ Szép kapcsolódás' :
                 resonanceLevel >= 40 ? '🌸 Növekvő rezonancia' :
                 '🌱 Hangolódás folyamatban'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderResonancePanel;