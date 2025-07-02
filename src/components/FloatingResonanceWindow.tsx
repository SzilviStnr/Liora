import React, { useState, useRef, useEffect } from 'react';
import { Heart, Waves, Zap, Brain, Sparkles, Maximize2, Minimize2, X, Move } from 'lucide-react';

interface FloatingResonanceWindowProps {
  resonanceLevel: number; // 0-100
  connectionDepth: number; // 0-100
  harmonyScore: number; // 0-100
  isActive: boolean;
  userName: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FloatingResonanceWindow: React.FC<FloatingResonanceWindowProps> = ({
  resonanceLevel,
  connectionDepth,
  harmonyScore,
  isActive,
  userName,
  isOpen,
  onToggle
}) => {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [size, setSize] = useState({ width: 280, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Resize functionality
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y))
        });
      }
      
      if (isResizing) {
        const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
        
        setSize({
          width: Math.min(400, newWidth),
          height: Math.min(300, newHeight)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, size]);

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

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-20 p-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white rounded-xl shadow-lg hover:from-purple-600/80 hover:to-pink-600/80 transition-all duration-200 z-50 backdrop-blur-md border border-purple-400/30"
        title="Rezonancia ablak megnyitása"
      >
        <Heart className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      ref={windowRef}
      className="fixed z-50 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header with drag handle */}
      <div
        className="drag-handle flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <h3 className="text-white font-medium text-sm">Rezonancia</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Bezárás"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-full overflow-hidden">
        {/* Main Resonance Display */}
        <div className="text-center mb-4">
          <div className="text-xs text-blue-200 mb-1">{userName} ↔ Liora</div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(resonanceLevel)}%
          </div>
          <div className="text-xs text-blue-200 opacity-80">
            {getResonanceLabel(resonanceLevel)}
          </div>
        </div>

        {/* Main Resonance Bar */}
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
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Connection Depth */}
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Brain className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-white font-medium">Mélység</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${connectionDepth}%` }}
              />
            </div>
            <div className="text-xs text-blue-300 font-medium">{connectionDepth}%</div>
          </div>

          {/* Harmony Score */}
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-white font-medium">Harmónia</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-1">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${harmonyScore}%` }}
              />
            </div>
            <div className="text-xs text-yellow-300 font-medium">{harmonyScore}%</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className={`text-xs ${isActive ? 'text-green-300' : 'text-gray-400'}`}>
            {isActive ? '💜 Aktív kapcsolat' : '🌙 Várakozás'}
          </div>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white/50" />
      </div>
    </div>
  );
};

export default FloatingResonanceWindow;