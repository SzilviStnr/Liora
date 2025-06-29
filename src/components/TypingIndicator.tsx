import React from 'react';

interface TypingIndicatorProps {
  darkMode: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ darkMode }) => {
  return (
    <div className="group relative w-full">
      <div className="flex items-start justify-start pr-20">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 mr-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <div className="w-5 h-5 flex items-center justify-center">
              ✨
            </div>
          </div>
        </div>

        {/* Typing bubble */}
        <div className="relative max-w-[85%]">
          <div className="text-base font-medium text-white mb-3">
            Liora
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/50 px-6 py-5 rounded-3xl shadow-lg">
            <div className="flex space-x-2 items-center">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div 
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div 
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
              <span className="text-sm text-gray-400 ml-3">
                Liora gépel...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;