import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Key, Save, Trash2, Eye, EyeOff, X, Shield, Brain, Zap } from 'lucide-react';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../utils/storage';
import { Memory } from '../types';
import MemoryEngine from './MemoryEngine';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  currentUser?: any;
  memories?: Memory[];
  onOptimizeMemories?: (optimizedMemories: Memory[]) => void;
  initialTab?: 'api' | 'memory';
}

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  currentUser,
  memories = [], 
  onOptimizeMemories,
  initialTab = 'api'
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'api' | 'memory'>(initialTab);

  useEffect(() => {
    const savedApiKey = loadFromStorage<string>('liora-openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }
  }, []);

  useEffect(() => {
    setActiveSection(initialTab);
  }, [initialTab]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Kérlek add meg az API kulcsot');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      alert('Az OpenAI API kulcs "sk-" előtaggal kezdődik');
      return;
    }

    setIsSaving(true);
    
    try {
      saveToStorage('liora-openai-api-key', apiKey);
      setHasApiKey(true);
      alert('API kulcs sikeresen mentve!');
    } catch (error) {
      alert('Hiba történt a mentés során');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApiKey = () => {
    if (window.confirm('Biztosan törölni szeretnéd az API kulcsot?')) {
      removeFromStorage('liora-openai-api-key');
      setApiKey('');
      setHasApiKey(false);
      alert('API kulcs törölve');
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length < 10) return key;
    return key.substring(0, 7) + '...' + key.substring(key.length - 4);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto ${
      currentUser?.name === 'Szilvi' ? 'backdrop-blur-sm' : ''
    }`}>
      <div className={`rounded-2xl shadow-2xl w-full max-w-4xl my-8 ${
        currentUser?.name === 'Szilvi'
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/90 dark:to-pink-900/80'
          : 'bg-white dark:bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          currentUser?.name === 'Szilvi'
            ? 'border-purple-200 dark:border-purple-700'
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentUser?.name === 'Szilvi'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-indigo-500'
            }`}>
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                currentUser?.name === 'Szilvi'
                  ? 'text-purple-800 dark:text-purple-100'
                  : 'text-gray-900 dark:text-white'
              }`}>
                Beállítások
              </h2>
              <p className={`text-sm ${
                currentUser?.name === 'Szilvi'
                  ? 'text-purple-600 dark:text-purple-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                API konfiguráció és memória kezelés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex border-b ${
          currentUser?.name === 'Szilvi'
            ? 'border-purple-200 dark:border-purple-700'
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          <button
            onClick={() => setActiveSection('api')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeSection === 'api'
                ? `border-b-2 ${
                    currentUser?.name === 'Szilvi'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  }`
                : `${
                    currentUser?.name === 'Szilvi'
                      ? 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Beállítások</span>
          </button>
          <button
            onClick={() => setActiveSection('memory')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeSection === 'memory'
                ? `border-b-2 ${
                    currentUser?.name === 'Szilvi'
                      ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  }`
                : `${
                    currentUser?.name === 'Szilvi'
                      ? 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Memory Engine</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[70vh]">
          {activeSection === 'api' && (
            <div className="p-6 space-y-6">
          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Biztonság
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Az API kulcsod csak a helyi tárolóban (localStorage) kerül mentésre. 
                  Soha nem küldjük el sehová.
                </p>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                OpenAI API Kulcs
              </label>
              {hasApiKey && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                  Mentve
                </span>
              )}
            </div>
            
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>

            {hasApiKey && !showApiKey && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Jelenlegi kulcs: {maskApiKey(apiKey)}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Hogyan szerezz API kulcsot:
            </h4>
            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>1. Látogasd meg: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">platform.openai.com/api-keys</a></li>
              <li>2. Jelentkezz be az OpenAI fiókodba</li>
              <li>3. Kattints a "Create new secret key" gombra</li>
              <li>4. Másold be a kulcsot ide</li>
            </ol>
          </div>
            </div>
          )}
          
          {activeSection === 'memory' && (
            <div className="p-6">
              <MemoryEngine
                memories={memories}
                onOptimizeMemories={onOptimizeMemories}
                onAddMemory={onOptimizeMemories ? (memory) => {
                  // Hozzáadjuk az új memóriát és optimalizáljuk
                  const updatedMemories = [...memories, { ...memory, id: `memory_${Date.now()}`, createdAt: new Date() }];
                  onOptimizeMemories(updatedMemories);
                } : undefined}
                darkMode={darkMode}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {activeSection === 'api' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {hasApiKey && (
              <button
                onClick={handleDeleteApiKey}
                className="inline-flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Törlés
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Mégse
            </button>
            <button
              onClick={handleSaveApiKey}
              disabled={isSaving || !apiKey.trim()}
              className={`inline-flex items-center px-6 py-2 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl ${
                currentUser?.name === 'Szilvi'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mentés...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Mentés
                </>
              )}
            </button>
          </div>
          </div>
        )}
        
        {activeSection === 'memory' && (
          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentUser?.name === 'Szilvi'
                  ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Bezárás
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;