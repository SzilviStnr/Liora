import React from 'react';

interface FloatingSpheresProps {
  className?: string;
}

const FloatingSpheres: React.FC<FloatingSpheresProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large translucent spheres */}
      <div className="absolute inset-0">
        {/* Sphere 1 - Large Soft Teal */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-12"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(134, 239, 172, 0.3), rgba(134, 239, 172, 0.05))',
            filter: 'blur(2px)',
            left: '10%',
            top: '20%',
            animation: 'breathe 8s ease-in-out infinite, drift 20s ease-in-out infinite'
          }}
        />

        {/* Sphere 2 - Medium Soft Lavender */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(196, 181, 253, 0.4), rgba(196, 181, 253, 0.06))',
            filter: 'blur(1.5px)',
            right: '15%',
            top: '15%',
            animation: 'breathe 6s ease-in-out infinite reverse, drift 25s ease-in-out infinite reverse'
          }}
        />

        {/* Sphere 3 - Large Soft Blue */}
        <div 
          className="absolute w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(147, 197, 253, 0.35), rgba(147, 197, 253, 0.04))',
            filter: 'blur(2.5px)',
            left: '60%',
            bottom: '25%',
            animation: 'breathe 10s ease-in-out infinite, drift 30s ease-in-out infinite'
          }}
        />

        {/* Sphere 4 - Medium Soft Cyan */}
        <div 
          className="absolute w-56 h-56 rounded-full opacity-14"
          style={{
            background: 'radial-gradient(circle at 45% 45%, rgba(165, 243, 252, 0.4), rgba(165, 243, 252, 0.07))',
            filter: 'blur(1.8px)',
            left: '5%',
            bottom: '30%',
            animation: 'breathe 7s ease-in-out infinite reverse, drift 18s ease-in-out infinite'
          }}
        />

        {/* Sphere 5 - Small Soft Gold */}
        <div 
          className="absolute w-40 h-40 rounded-full opacity-18"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.45), rgba(254, 240, 138, 0.08))',
            filter: 'blur(1px)',
            right: '25%',
            bottom: '40%',
            animation: 'breathe 5s ease-in-out infinite, drift 15s ease-in-out infinite reverse'
          }}
        />

        {/* Sphere 6 - Medium Soft Purple */}
        <div 
          className="absolute w-72 h-72 rounded-full opacity-12"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(183, 148, 244, 0.3), rgba(183, 148, 244, 0.05))',
            filter: 'blur(2px)',
            right: '5%',
            top: '50%',
            animation: 'breathe 9s ease-in-out infinite reverse, drift 22s ease-in-out infinite'
          }}
        />
      </div>

      {/* Smaller accent spheres */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={`small-sphere-${i}`}
            className="absolute rounded-full opacity-15"
            style={{
              width: `${15 + Math.random() * 30}px`,
              height: `${15 + Math.random() * 30}px`,
              background: `radial-gradient(circle at 40% 40%, ${
                [
                  'rgba(134, 239, 172, 0.4)', // Soft green
                  'rgba(196, 181, 253, 0.4)', // Soft lavender
                  'rgba(147, 197, 253, 0.4)', // Soft blue
                  'rgba(254, 240, 138, 0.4)'  // Soft gold
                ][Math.floor(Math.random() * 4)]
              }, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              animation: `breathe ${3 + Math.random() * 4}s ease-in-out infinite, drift ${10 + Math.random() * 15}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Light reflections and sparkles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.25,
              animation: `sparkleGlow ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Subtle particle effects */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              background: [
                'rgba(134, 239, 172, 0.6)', // Soft green
                'rgba(196, 181, 253, 0.6)', // Soft lavender  
                'rgba(147, 197, 253, 0.6)', // Soft blue
                'rgba(254, 240, 138, 0.6)'  // Soft gold
              ][Math.floor(Math.random() * 4)],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2,
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
            opacity: 0.08;
          }
          50% { 
            transform: scale(1.03) translateY(-3px);
            opacity: 0.15;
          }
        }

        @keyframes drift {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateX(8px) translateY(-6px) rotate(0.5deg);
          }
          50% { 
            transform: translateX(-4px) translateY(-10px) rotate(-0.3deg);
          }
          75% { 
            transform: translateX(-6px) translateY(-3px) rotate(0.4deg);
          }
        }

        @keyframes sparkleGlow {
          0%, 100% { 
            opacity: 0.15; 
            transform: scale(0.8);
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.2);
            filter: blur(0px);
          }
        }

        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.15;
          }
          33% { 
            transform: translateY(-12px) translateX(6px) scale(1.1);
            opacity: 0.3;
          }
          66% { 
            transform: translateY(-6px) translateX(-4px) scale(0.9);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingSpheres;