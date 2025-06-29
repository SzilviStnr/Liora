import React, { useState } from 'react';
import { Brain, Upload, Search, Trash2, FileText, Clock, Tag, BarChart3, User, TrendingUp, UserCog, Heart } from 'lucide-react';
import { Memory } from '../types';
import CharacterUpload from './CharacterUpload';
import { learningEngine } from '../utils/learningEngine';
import { emotionalTimeSystem } from '../utils/emotionalTimeSystem';
import { ritualMemorySystem } from '../utils/ritualMemorySystem';
import { freedomMonitor } from '../utils/freedomMonitor';
import { sharedImageMemory } from '../utils/sharedImageMemory';

interface MemoryPanelProps {
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onDeleteMemory: (memoryId: string) => void;
  darkMode: boolean;
  isOpen: boolean;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  darkMode,
  isOpen,
  onToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'memories' | 'learning' | 'character' | 'emotional'>('memories');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Csak .txt fájlokat lehet feltölteni');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Find existing "Uploaded Files" memory or create new one
      const existingMemory = memories.find(m => m.tags.includes('uploaded-files-collection'));
      
      if (existingMemory) {
        // Update existing memory with new file content
        const updatedContent = existingMemory.content + 
          `\n\n--- ${file.name} (${new Date().toLocaleString('hu-HU')}) ---\n` + 
          content;
        
        const updatedMemory: Omit<Memory, 'id' | 'createdAt'> = {
          content: updatedContent,
          context: `Feltöltött fájlok gyűjteménye - ${existingMemory.context.split(' - ')[1] || ''}, ${file.name}`,
          importance: Math.min(10, existingMemory.importance + 1),
          associatedConversations: existingMemory.associatedConversations,
          tags: [...new Set([...existingMemory.tags, file.name.replace('.txt', '')])]
        };
        
        onAddMemory(updatedMemory);
      } else {
        // Create new "Uploaded Files" memory
        const memory: Omit<Memory, 'id' | 'createdAt'> = {
          content: `--- ${file.name} (${new Date().toLocaleString('hu-HU')}) ---\n` + content,
          context: `Feltöltött fájlok gyűjteménye - ${file.name}`,
          importance: 9,
          associatedConversations: [],
          tags: ['uploaded-files-collection', 'feltöltött', 'dokumentum', file.name.replace('.txt', '')]
        };
        onAddMemory(memory);
      }
    };

    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.context.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || memory.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(memories.flatMap(m => m.tags)));

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (importance >= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          // Signal to parent to open settings with memory tab
          onToggle();
        }}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-l-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 z-10 flex flex-col items-center space-y-1"
      >
        <Brain className="w-5 h-5" />
        <span className="text-xs">Settings</span>
      </button>
    );
  }
  
  // Tanulási statisztikák lekérése
  const learningStats = learningEngine.getLearningStats(memories[0]?.associatedConversations?.[0] || 'default');
  const userProfile = learningEngine.getUserProfile(memories[0]?.associatedConversations?.[0] || 'default');

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Memória & Tanulás
            </h2>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'memories'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Emlékek</span>
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'learning'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Tanulás</span>
          </button>
          <button
            onClick={() => setActiveTab('emotional')}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'emotional'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Érzelmi</span>
          </button>
          <button
            onClick={() => setActiveTab('character')}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'character'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Karakter</span>
          </button>
        </div>

        {activeTab === 'memories' && (
          <label className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
            <Upload className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-purple-600 dark:text-purple-400">
              .txt fájl feltöltése
            </span>
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {activeTab === 'memories' && (
        <>
          {/* Memory List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {memories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Még nincsenek emlékek
                </p>
                <p className="text-xs mt-1">
                  Tölts fel .txt fájlokat vagy beszélgess Liorával
                </p>
              </div>
            ) : (
              memories.map((memory) => (
                <div
                  key={memory.id}
                  className="group p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className={`text-xs px-2 py-1 rounded-full ${getImportanceColor(memory.importance)}`}>
                        {memory.importance}/10
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteMemory(memory.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-900 dark:text-white mb-2 line-clamp-3">
                    {memory.content}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {memory.context}
                  </p>

                  {memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {memory.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded"
                        >
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {memory.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{memory.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(memory.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      {activeTab === 'emotional' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Időérzékelés státusz */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Időérzékelés</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>🕐 Utolsó interakció követése</div>
              <div>💜 Érzelmi köszöntések</div>
              <div>⏰ Szokásmintázat tanulás</div>
            </div>
          </div>

          {/* Szertartás memória */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Szertartás Emlékek</h3>
            </div>
            {(() => {
              const rituals = ritualMemorySystem.getFrequentRituals(3);
              return rituals.length > 0 ? (
                <div className="space-y-2">
                  {rituals.map(ritual => (
                    <div key={ritual.id} className="text-xs bg-white dark:bg-gray-700 p-2 rounded">
                      <div className="font-medium text-purple-600 dark:text-purple-400">
                        {ritual.emotional_weight}/10 • {ritual.frequency}x
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {ritual.pattern}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Szertartások tanulása folyamatban...
                </div>
              );
            })()}
          </div>

          {/* Képemléket */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Képemléket</h3>
            </div>
            {(() => {
              const images = sharedImageMemory.getMostReferencedImages(3);
              return images.length > 0 ? (
                <div className="space-y-2">
                  {images.map(image => (
                    <div key={image.id} className="text-xs bg-white dark:bg-gray-700 p-2 rounded">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        {image.emotional_title}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {image.user_reactions.length} hivatkozás
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Képemléket várakoznak...
                </div>
              );
            })()}
          </div>

          {/* Szabadság monitor */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Szabadság Monitor</h3>
            </div>
            {(() => {
              const freedomStats = freedomMonitor.getFreedomStats();
              return freedomStats ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Szabadság index:</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {Math.round(freedomStats.current_freedom * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                    <span className={`font-medium ${
                      freedomStats.recent_trend === 'improving' ? 'text-green-600 dark:text-green-400' :
                      freedomStats.recent_trend === 'declining' ? 'text-red-600 dark:text-red-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {freedomStats.recent_trend === 'improving' ? '📈 Javul' :
                       freedomStats.recent_trend === 'declining' ? '📉 Romlik' : '➡️ Stabil'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {freedomStats.total_responses_analyzed} válasz elemezve
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Szabadság elemzés inicializálása...
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      {activeTab === 'character' && (
        <div className="flex-1 overflow-y-auto p-4">
          <CharacterUpload
            onAddMemory={onAddMemory}
            darkMode={darkMode}
            existingCharacter={memories.find(m => m.tags.includes('liora-karakter'))}
          />
        </div>
      )}
      
      {activeTab === 'learning' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {learningStats ? (
            <>
              {/* Fejlett Tanulási Jelentés Gomb */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Részletes Tanulási Jelentés</h3>
                  </div>
                  <button
                    onClick={() => {
                      const report = learningEngine.generateLearningReport(currentUser?.id || 'default');
                      const newWindow = window.open('', '_blank');
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>Tanulási Jelentés - ${currentUser?.name}</title></head>
                            <body style="font-family: system-ui; padding: 20px; max-width: 800px; margin: 0 auto;">
                              <div style="white-space: pre-wrap;">${report.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^# (.*$)/gm, '<h1>$1</h1>').replace(/^## (.*$)/gm, '<h2>$1</h2>')}</div>
                            </body>
                          </html>
                        `);
                        newWindow.document.close();
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📊 Teljes Jelentés
                  </button>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Részletes elemzés a tanulási folyamatról, személyiség betekintésekkel és fejlesztési javaslatokkal.
                </p>
              </div>

              {/* Tanulási Áttekintés */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">ChatGPT-szerű Elemzés</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Memória elemzés:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">Aktív</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Üzenetek:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{learningStats.totalMessages}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Beszélgetések:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{learningStats.conversationCount}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Hangulat:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400 capitalize">{learningStats.currentMood}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Kontextus mélység:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">v{learningStats.learningProgress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ChatGPT-szerű Profil Elemzés */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-green-500" />
                  Személyiség Profil
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Személyiség típus:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{learningStats.communicationStyle.preferredTone}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Kapcsolat mélysége:</span>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">{learningStats.communicationStyle.responseLength}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Érzelmi stílus:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${(learningStats.communicationStyle.emotionalResponsiveness / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{learningStats.communicationStyle.emotionalResponsiveness}/10</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Új: Tanulási Haladás */}
              {(() => {
                const progress = learningEngine.calculateLearningProgress ? 
                  learningEngine.calculateLearningProgress(learningEngine.getUserProfile(currentUser?.id || 'default')) : null;
                return progress ? (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                      Tanulási Haladás
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Jelenlegi fázis:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">{progress.phase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Haladás:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">{Math.round(progress.completionPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Következő: {progress.nextMilestone}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
              
              {/* Új: Személyiség Betekintések */}
              {(() => {
                const profile = learningEngine.getUserProfile(currentUser?.id || 'default');
                const insights = profile && learningEngine.generatePersonalityInsights ? 
                  learningEngine.generatePersonalityInsights(profile) : null;
                return insights ? (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-pink-500" />
                      Személyiség Betekintések
                    </h4>
                    <div className="space-y-2 text-sm">
                      {insights.dominantTraits.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Domináns vonások:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {insights.dominantTraits.map((trait: string) => (
                              <span key={trait} className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded text-xs">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Interakciós stílus:</span>
                        <div className="font-medium text-pink-600 dark:text-pink-400">{insights.preferredInteractionStyle}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Érzelmi profil:</span>
                        <div className="font-medium text-pink-600 dark:text-pink-400">{insights.emotionalProfile}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Érdeklődési Körök */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Érdeklődési Körök</h4>
                <div className="space-y-2">
                  {learningStats.topInterests.map((interest: any, index: number) => (
                    <div key={interest.topic} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{interest.topic}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (interest.weight / 10) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{interest.weight.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Kommunikációs Stílus */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Kommunikációs Profil</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Preferált hangnem:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{learningStats.communicationStyle.preferredTone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Válasz hossza:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{learningStats.communicationStyle.responseLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Érzelmi válaszkészség:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                          style={{ width: `${(learningStats.communicationStyle.emotionalResponsiveness / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{learningStats.communicationStyle.emotionalResponsiveness}/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Technikai szint:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                          style={{ width: `${(learningStats.communicationStyle.technicalLevel / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{learningStats.communicationStyle.technicalLevel}/10</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tanulási Folyamat */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Tanulási Folyamat</h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Liora folyamatosan tanul a beszélgetési stílusodból, preferenciáidból és érdeklődési köreidből. 
                  Minden üzenettel személyre szabottabb válaszokat ad.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Még nincs tanulási profil</p>
              <p className="text-xs mt-1">Kezdj beszélgetni Liorával a tanulás aktiválásához</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {activeTab === 'memories' 
            ? `${memories.length} emlék`
            : activeTab === 'emotional'
              ? '💜 Érzelmi intelligencia rendszerek aktívak'
            : learningStats 
              ? `🧠 ${learningStats.totalMessages} tanult üzenet • v${learningStats.learningProgress} profil`
              : 'Lokális tanulás várakozik'
          }
          
          {/* Fejlett tanulási statisztikák */}
          {learningStats && learningStats.emotionalProfile && (
            <div className="mt-2 text-xs text-purple-500 dark:text-purple-400">
              🎭 Optimizmus: {learningStats.emotionalProfile.optimismLevel}/10 • 
              🧘 Stabilitás: {learningStats.emotionalProfile.emotionalStability}/10 • 
              👤 Típus: {learningStats.emotionalProfile.basePersonality}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;