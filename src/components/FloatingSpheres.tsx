import React from 'react';

interface FloatingSpheresProps {
  className?: string;
}

const FloatingSpheres: React.FC<FloatingSpheresProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large translucent spheres */}
      <div className="absolute inset-0">
        {/* Sphere 1 - Large Teal */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(45, 212, 191, 0.6), rgba(45, 212, 191, 0.1))',
            filter: 'blur(1px)',
            left: '10%',
            top: '20%',
            animation: 'breathe 8s ease-in-out infinite, drift 20s ease-in-out infinite'
          }}
        />

        {/* Sphere 2 - Medium Lavender */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(167, 139, 250, 0.7), rgba(167, 139, 250, 0.1))',
            filter: 'blur(0.5px)',
            right: '15%',
            top: '15%',
            animation: 'breathe 6s ease-in-out infinite reverse, drift 25s ease-in-out infinite reverse'
          }}
        />

        {/* Sphere 3 - Large Pink */}
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(244, 114, 182, 0.5), rgba(244, 114, 182, 0.05))',
            filter: 'blur(1.5px)',
            left: '60%',
            bottom: '25%',
            animation: 'breathe 10s ease-in-out infinite, drift 30s ease-in-out infinite'
          }}
        />

        {/* Sphere 4 - Medium Blue */}
        <div 
          className="absolute w-56 h-56 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle at 45% 45%, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.1))',
            filter: 'blur(0.8px)',
            left: '5%',
            bottom: '30%',
            animation: 'breathe 7s ease-in-out infinite reverse, drift 18s ease-in-out infinite'
          }}
        />

        {/* Sphere 5 - Small Gold */}
        <div 
          className="absolute w-40 h-40 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.8), rgba(251, 191, 36, 0.1))',
            filter: 'blur(0.3px)',
            right: '25%',
            bottom: '40%',
            animation: 'breathe 5s ease-in-out infinite, drift 15s ease-in-out infinite reverse'
          }}
        />

        {/* Sphere 6 - Medium Purple */}
        <div 
          className="absolute w-72 h-72 rounded-full opacity-18"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.5), rgba(139, 92, 246, 0.08))',
            filter: 'blur(1px)',
            right: '5%',
            top: '50%',
            animation: 'breathe 9s ease-in-out infinite reverse, drift 22s ease-in-out infinite'
          }}
        />
      </div>

      {/* Smaller accent spheres */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`small-sphere-${i}`}
            className="absolute rounded-full opacity-25"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background: `radial-gradient(circle at 40% 40%, ${
                ['rgba(45, 212, 191, 0.6)', 'rgba(167, 139, 250, 0.6)', 'rgba(244, 114, 182, 0.6)', 'rgba(251, 191, 36, 0.6)'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)',
              animation: `breathe ${3 + Math.random() * 4}s ease-in-out infinite, drift ${10 + Math.random() * 15}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Light reflections and sparkles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
              animation: `sparkleGlow ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Subtle particle effects */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              background: ['#2dd4bf', '#a78bfa', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 4)],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
              animation: `particleFloat ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1) translateY(0px);
            opacity: 0.15;
          }
          50% { 
            transform: scale(1.05) translateY(-5px);
            opacity: 0.25;
          }
        }

        @keyframes drift {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateX(10px) translateY(-8px) rotate(1deg);
          }
          50% { 
            transform: translateX(-5px) translateY(-15px) rotate(-0.5deg);
          }
          75% { 
            transform: translateX(-8px) translateY(-5px) rotate(0.8deg);
          }
        }

        @keyframes sparkleGlow {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(0.8);
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.5);
            filter: blur(0px);
          }
        }

        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.2;
          }
          33% { 
            transform: translateY(-15px) translateX(8px) scale(1.2);
            opacity: 0.5;
          }
          66% { 
            transform: translateY(-8px) translateX(-5px) scale(0.9);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingSpheres;