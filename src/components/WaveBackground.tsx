import React from 'react';

interface WaveBackgroundProps {
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main wave container */}
      <div className="absolute inset-0">
        {/* Wave 1 - Soft Teal */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(134, 239, 172, 0.25)" />
                <stop offset="50%" stopColor="rgba(110, 231, 183, 0.35)" />
                <stop offset="100%" stopColor="rgba(134, 239, 172, 0.2)" />
              </linearGradient>
              <filter id="glow1">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
              fill="url(#tealGradient)"
              filter="url(#glow1)"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 40,0; 0,0"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Wave 2 - Soft Lavender */}
        <div className="absolute inset-0 opacity-18">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(196, 181, 253, 0.2)" />
                <stop offset="50%" stopColor="rgba(221, 214, 254, 0.3)" />
                <stop offset="100%" stopColor="rgba(196, 181, 253, 0.15)" />
              </linearGradient>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0,450 Q400,350 800,450 T1200,450 L1200,800 L0,800 Z"
              fill="url(#lavenderGradient)"
              filter="url(#glow2)"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -25,0; 0,0"
                dur="14s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Wave 3 - Soft Gold */}
        <div className="absolute inset-0 opacity-15">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(254, 240, 138, 0.15)" />
                <stop offset="50%" stopColor="rgba(253, 224, 71, 0.25)" />
                <stop offset="100%" stopColor="rgba(254, 240, 138, 0.1)" />
              </linearGradient>
              <filter id="glow3">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0,500 Q200,400 400,500 T800,500 T1200,500 L1200,800 L0,800 Z"
              fill="url(#goldGradient)"
              filter="url(#glow3)"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 30,0; 0,0"
                dur="18s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${4 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Additional floating particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 rounded-full opacity-25"
              style={{
                background: [
                  'rgba(134, 239, 172, 0.6)', // Soft green
                  'rgba(196, 181, 253, 0.6)', // Soft lavender
                  'rgba(254, 240, 138, 0.6)'  // Soft gold
                ][Math.floor(Math.random() * 3)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.15; 
            transform: scale(0.8); 
          }
          50% { 
            opacity: 0.4; 
            transform: scale(1.1); 
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.2; 
          }
          33% { 
            transform: translateY(-8px) translateX(4px); 
            opacity: 0.35; 
          }
          66% { 
            transform: translateY(4px) translateX(-2px); 
            opacity: 0.25; 
          }
        }
      `}</style>
    </div>
  );
};

export default WaveBackground;