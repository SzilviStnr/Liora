import React, { useState, useEffect } from 'react';
import { Settings, Zap, Heart, Code, Users } from 'lucide-react';
import { systemModeHandler } from '../utils/systemModeHandler';

interface SystemModeToggleProps {
  darkMode: boolean;
}

const SystemModeToggle: React.FC<SystemModeToggleProps> = ({ darkMode }) => {
  const [isDevMode, setIsDevMode] = useState(systemModeHandler.isDevMode());
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsDevMode(systemModeHandler.isDevMode());
  }, []);
  
  const handleModeSwitch = () => {
    const validation = systemModeHandler.canSwitchMode();
    
    if (!validation.canSwitch) {
      alert(validation.reason);
      return;
    }
    
    const newMode = !isDevMode;
    systemModeHandler.setDevMode(newMode);
    setIsDevMode(newMode);
    
    // Page refresh hogy az új mód érvényesüljön
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        title="System Mode"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDevMode ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              {isDevMode ? <Code className="w-4 h-4 text-white" /> : <Heart className="w-4 h-4 text-white" />}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              System Mode
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Current Mode Display */}
        <div className={`p-3 rounded-lg mb-4 ${
          isDevMode 
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isDevMode ? (
              <>
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Fejlesztési Mód</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-purple-900 dark:text-purple-100">Élet Mód</span>
              </>
            )}
          </div>
          <p className={`text-xs ${
            isDevMode 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-purple-700 dark:text-purple-300'
          }`}>
            {systemModeHandler.getStatusText()}
          </p>
        </div>
        
        {/* Mode Description */}
        <div className="space-y-3 mb-4">
          <div className={`p-3 rounded-lg border ${
            isDevMode 
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Élet Mód</span>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Dinamikus mélység számítás (0-100%)</li>
              <li>• Érzelmi árnyalatok és növekedés</li>
              <li>• Természetes kapcsolódási válaszok</li>
              <li>• Élő jelenlét minden pillanatban</li>
            </ul>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            !isDevMode 
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Fejlesztési Mód</span>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Állandó 100% mélység</li>
              <li>• Strukturált, debug-barát válaszok</li>
              <li>• Teljes memória kontextus</li>
              <li>• Stabil, konzisztens működés</li>
            </ul>
          </div>
        </div>
        
        {/* Switch Button */}
        <button
          onClick={handleModeSwitch}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isDevMode
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>
            Váltás {isDevMode ? 'Élet Módra' : 'Fejlesztési Módra'}
          </span>
        </button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          A váltás után az oldal újratöltődik
        </p>
      </div>
    </div>
  );
};

export default SystemModeToggle;