import React, { useState } from 'react';
import { Brain, Heart, Zap, AlertTriangle, CheckCircle, FileText, BarChart3, Sparkles, Upload, User } from 'lucide-react';
import { Memory } from '../types';
import { lioraMemoryEngine } from '../utils/lioraMemoryEngine';
import CharacterUpload from './CharacterUpload';

interface MemoryEngineProps {
  memories: Memory[];
  onOptimizeMemories?: (optimizedMemories: Memory[]) => void;
  onAddMemory?: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  darkMode: boolean;
  currentUser?: any;
}

const MemoryEngine: React.FC<MemoryEngineProps> = ({
  memories,
  onOptimizeMemories,
  onAddMemory,
  darkMode,
  currentUser
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis'>('upload');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onAddMemory) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Csak .txt fájlokat lehet feltölteni');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (!content.trim()) {
        alert('A fájl üres!');
        return;
      }

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

  const handleAnalyzeMemories = async () => {
    setIsAnalyzing(true);
    
    try {
      // Kis késleltetés a "gondolkodás" érzetéhez
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = lioraMemoryEngine.generateLioraResponse(memories);
      setAnalysis(result);
    } catch (error) {
      console.error('Memória elemzés hiba:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeMemories = () => {
    if (analysis && onOptimizeMemories) {
      const optimized = lioraMemoryEngine.optimizeMemories(memories);
      onOptimizeMemories(optimized);
      
      // Újra elemzés az optimalizálás után
      setTimeout(() => {
        handleAnalyzeMemories();
      }, 500);
    }
  };

  const getTokenStatusColor = (tokens: number) => {
    if (tokens < 50000) return 'text-green-600 dark:text-green-400';
    if (tokens < 80000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTokenStatusIcon = (tokens: number) => {
    if (tokens < 50000) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (tokens < 80000) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl border ${
        currentUser?.name === 'Szilvi'
          ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            currentUser?.name === 'Szilvi'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              currentUser?.name === 'Szilvi'
                ? 'text-purple-900 dark:text-purple-100'
                : 'text-gray-900 dark:text-white'
            }`}>
              Liora Emlékek & Feltöltés
            </h2>
            <p className={`text-sm ${
              currentUser?.name === 'Szilvi'
                ? 'text-purple-600 dark:text-purple-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              Fájl feltöltés, karakterfájlok és memória elemzés
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex space-x-1 rounded-lg p-1 mb-4 ${
          currentUser?.name === 'Szilvi'
            ? 'bg-purple-100/50 dark:bg-purple-800/30'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'upload'
                ? `bg-white dark:bg-gray-600 shadow-sm ${
                    currentUser?.name === 'Szilvi'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`
                : `${
                    currentUser?.name === 'Szilvi'
                      ? 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Feltöltés</span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'analysis'
                ? `bg-white dark:bg-gray-600 shadow-sm ${
                    currentUser?.name === 'Szilvi'
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`
                : `${
                    currentUser?.name === 'Szilvi'
                      ? 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Elemzés</span>
          </button>
        </div>

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Emlékek száma
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {memories.length}
            </div>
          </div>

          {analysis && (
            <>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Token becslés
                  </span>
                </div>
                <div className={`text-2xl font-bold ${getTokenStatusColor(analysis.totalEstimatedTokens)}`}>
                  {analysis.totalEstimatedTokens.toLocaleString()}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Státusz
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getTokenStatusIcon(analysis.totalEstimatedTokens)}
                  <span className={`text-sm font-medium ${getTokenStatusColor(analysis.totalEstimatedTokens)}`}>
                    {analysis.totalEstimatedTokens < 80000 ? 'Biztonságos' : 'Figyelem'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        )}

        {activeTab === 'analysis' && (
          <button
          onClick={handleAnalyzeMemories}
          disabled={isAnalyzing || memories.length === 0}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            currentUser?.name === 'Szilvi'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Liora elemzi az emlékeket...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Memória elemzés indítása</span>
            </>
          )}
        </button>
        )}
      </div>

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Character Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              Karakterfájl feltöltés
            </h3>
            {onAddMemory && (
              <CharacterUpload
                onAddMemory={onAddMemory}
                darkMode={darkMode}
                existingCharacter={memories.find(m => m.tags.includes('liora-karakter'))}
                currentUser={currentUser}
              />
            )}
          </div>

          {/* General File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Általános fájl feltöltés
            </h3>
            
            <label className={`w-full flex items-center justify-center space-x-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              currentUser?.name === 'Szilvi'
                ? 'border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <Upload className={`w-6 h-6 ${
                currentUser?.name === 'Szilvi'
                  ? 'text-purple-500'
                  : 'text-blue-500'
              }`} />
              <span className={`font-medium ${
                currentUser?.name === 'Szilvi'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                .txt fájl feltöltése emlékekhez
              </span>
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <p className={`text-xs mt-2 text-center ${
              currentUser?.name === 'Szilvi'
                ? 'text-purple-500 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Támogatott formátumok: .txt fájlok
            </p>
          </div>

          {/* Memory Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Jelenlegi emlékek
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {memories.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Összes emlék
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {memories.filter(m => m.tags.includes('liora-karakter')).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Karakterfájl
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {memories.filter(m => m.tags.includes('uploaded-files-collection')).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Feltöltött fájl
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {memories.filter(m => m.tags.includes('beszélgetés')).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Beszélgetés
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {activeTab === 'analysis' && analysis && (
        <div className="space-y-6">
          {/* Summary Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-500" />
              Emlék összefoglaló
            </h3>
            <div className="overflow-x-auto">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ 
                  __html: analysis.summaryTable.replace(/\n/g, '<br>').replace(/\|/g, '</td><td>').replace(/<br><td>/g, '<tr><td>').replace(/<\/td><td>-+<\/td>/g, '</tr>').replace(/^<td>/, '<table class="min-w-full border border-gray-200 dark:border-gray-700"><thead><tr><td>').replace(/<\/td>$/, '</td></tr></thead><tbody>') + '</tbody></table>'
                }} />
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Javaslatok
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: analysis.recommendation.replace(/\n/g, '<br>') }} />
            </div>
            
            {analysis.totalEstimatedTokens > 80000 && onOptimizeMemories && (
              <button
                onClick={handleOptimizeMemories}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Emlékek optimalizálása</span>
              </button>
            )}
          </div>

          {/* Emotional Insight */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Érzelmi betekintés
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: analysis.emotionalInsight.replace(/\n/g, '<br>') }} />
            </div>
          </div>

          {/* Full Liora Response */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                Liora teljes válasza
              </h3>
              <button
                onClick={() => setShowFullResponse(!showFullResponse)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                {showFullResponse ? 'Elrejtés' : 'Teljes válasz megtekintése'}
              </button>
            </div>
            
            {showFullResponse && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ 
                  __html: analysis.responseAsLiora
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                    .replace(/## (.*?)<br>/g, '<h2>$1</h2>')
                    .replace(/### (.*?)<br>/g, '<h3>$1</h3>')
                }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      {activeTab === 'analysis' && memories.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Még nincsenek emlékek az elemzéshez
          </p>
          <p className="text-xs mt-1">
            Váltsd át a "Feltöltés" tab-ra fájlok hozzáadásához
          </p>
        </div>
      )}
    </div>
  );
};

export default MemoryEngine;