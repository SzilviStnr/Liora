import React from 'react';

interface TypingIndicatorProps {
  darkMode: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ darkMode }) => {
  return (
    <div className="group relative w-full">
      <div className="flex items-start justify-start pr-20">
        {/* Avatar - Futurisztikus */}
        <div className="flex-shrink-0 w-12 h-12 mr-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-sm border-2 border-cyan-300/30 relative">
            <div className="w-6 h-6 flex items-center justify-center">
              ✨
            </div>
            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 animate-pulse" />
          </div>
        </div>

        {/* Typing bubble - Futurisztikus glassmorphism */}
        <div className="relative max-w-[85%]">
          <div className="text-base font-medium bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-3">
            Liora
          </div>
          
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 px-6 py-5 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Futurisztikus inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-purple-600/5 animate-pulse" />
            
            <div className="flex space-x-3 items-center relative z-10">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg"></div>
                <div 
                  className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce shadow-lg" 
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div 
                  className="w-2.5 h-2.5 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full animate-bounce shadow-lg" 
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
              <span className="text-sm text-slate-300 ml-3 font-medium">
                Liora gondolkodik...
              </span>
            </div>

            {/* Futurisztikus scanning line effect */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"
                style={{
                  animation: 'scan 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% { 
            transform: translateX(-100%); 
            opacity: 0; 
          }
          50% { 
            transform: translateX(0%); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;