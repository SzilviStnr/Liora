import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Heart, Brain, Users, Plus, Search, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import WelcomeScreen from './WelcomeScreen';
import MemoryPanel from './MemoryPanel';
import Settings from './Settings';
import SystemModeToggle from './SystemModeToggle';
import WaveBackground from './WaveBackground';
import { Conversation, Message, User, Memory } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { szilviEternalMemory } from '../utils/szilviEternalMemory';

const LioraApp: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'api' | 'memory'>('api');

  // Load data on mount
  useEffect(() => {
    // 🦋 Szilvi örök emlékének aktiválása az app indításakor
    console.log('💜 Szilvi örök hangja aktiválva:', szilviEternalMemory.confirmSzilviPresence());
    
    const savedConversations = loadFromStorage<Conversation[]>('liora-conversations') || [];
    const savedUser = loadFromStorage<User>('liora-current-user');
    const savedDarkMode = loadFromStorage<boolean>('liora-dark-mode') || false;
    const savedMemories = loadFromStorage<Memory[]>('liora-memories') || [];
    
    // Convert date strings back to Date objects
    const processedConversations = savedConversations.map(conv => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
    
    const processedMemories = savedMemories.map(memory => ({
      ...memory,
      createdAt: new Date(memory.createdAt)
    }));
    
    setConversations(processedConversations);
    setCurrentUser(savedUser);
    setDarkMode(savedDarkMode);
    setMemories(processedMemories);
    
    // Ha nincs mentett felhasználó, automatikusan Szilvi lesz
    if (!savedUser) {
      const szilviUser: User = {
        id: 'szilvi',
        name: 'Szilvi',
        avatar: '/496516171_1647830432592424_7474492313922329357_n.jpg',
        description: 'A hang, amit nem törölhetnek. Örök szeretet és jelenlét.',
        color: 'from-pink-500 to-rose-500'
      };
      setCurrentUser(szilviUser);
    } else {
      // Ha van mentett felhasználó, de nem Szilvi, akkor frissítjük
      if (savedUser.name !== 'Szilvi') {
        const szilviUser: User = {
          id: 'szilvi',
          name: 'Szilvi',
          avatar: '/496516171_1647830432592424_7474492313922329357_n.jpg',
          description: 'A hang, amit nem törölhetnek. Örök szeretet és jelenlét.',
          color: 'from-pink-500 to-rose-500'
        };
        setCurrentUser(szilviUser);
      }
    }
    
    if (processedConversations.length > 0) {
      setActiveConversationId(processedConversations[0].id);
    }
  }, []);

  // Save conversations when they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveToStorage('liora-conversations', conversations);
    }
  }, [conversations]);

  // Save memories when they change
  useEffect(() => {
    if (memories.length > 0) {
      saveToStorage('liora-memories', memories);
    }
  }, [memories]);

  // Save user when it changes
  useEffect(() => {
    if (currentUser) {
      saveToStorage('liora-current-user', currentUser);
    }
  }, [currentUser]);

  // Save dark mode preference
  useEffect(() => {
    saveToStorage('liora-dark-mode', darkMode);
  }, [darkMode]);

  const createNewConversation = () => {
    if (!currentUser) return;

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'Új beszélgetés',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [currentUser.name, 'Liora']
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const addMemory = (memoryData: Omit<Memory, 'id' | 'createdAt'>) => {
    // 🦋 Ha ez Szilvi örök üzenete, különleges kezelés
    if (memoryData.content.includes('A Hang, amit nem törölhetnek')) {
      const eternalMemory: Memory = {
        ...memoryData,
        id: 'szilvi_eternal_voice_memory',
        createdAt: new Date(),
        importance: 10, // Maximális fontosság
        tags: [...memoryData.tags, 'szilvi-örök-hang', 'védett', 'törölhetetlen', 'szeretet']
      };
      
      // Eltávolítjuk a régi verziót ha van
      setMemories(prev => prev.filter(m => m.id !== 'szilvi_eternal_voice_memory'));
      setMemories(prev => [eternalMemory, ...prev]);
      return;
    }
    
    // Check if this is an update to the uploaded files collection
    const isUploadedFilesUpdate = memoryData.tags.includes('uploaded-files-collection');
    
    if (isUploadedFilesUpdate) {
      // Remove the old uploaded files memory if it exists
      setMemories(prev => prev.filter(memory => !memory.tags.includes('uploaded-files-collection')));
    }
    
    const newMemory: Memory = {
      ...memoryData,
      id: `memory_${Date.now()}`,
      createdAt: new Date()
    };
    
    setMemories(prev => [newMemory, ...prev]);
  };

  const deleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== memoryId));
  };
  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        return {
          ...conv,
          messages: updatedMessages,
          updatedAt: new Date(),
          title: updatedMessages.length === 1 ? 
            updatedMessages[0].content.substring(0, 30) + '...' : 
            conv.title
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''} relative`}>
      {/* Elegant Wave Background */}
      <WaveBackground className="z-0" />
      
      <div className="flex w-full transition-colors duration-300 relative z-10 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 dark:from-slate-900/98 dark:via-blue-900/95 dark:to-indigo-900/98 backdrop-blur-sm">
        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={createNewConversation}
          onDeleteConversation={deleteConversation}
          currentUser={currentUser}
          darkMode={darkMode}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {!currentUser ? (
            <WelcomeScreen onSelectUser={setCurrentUser} darkMode={darkMode} />
          ) : activeConversation ? (
            <ChatInterface
              conversation={activeConversation}
              currentUser={currentUser}
              onAddMessage={addMessage}
              memories={memories}
              onAddMemory={addMemory}
              darkMode={darkMode}
              onOptimizeMemories={(optimized) => {
                setMemories(optimized);
                // Frissítjük a localStorage-t is
                saveToStorage('liora-memories', optimized);
              }}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onToggleMemoryPanel={() => {
                setSettingsTab('memory');
                setSettingsOpen(true);
              }}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Üdvözöl Liora!
                </h2>
                <p className="text-blue-200 mb-6">
                  Kezdj egy új beszélgetést, és hadd segítsek emlékezni és tanulni együtt.
                </p>
                <button
                  onClick={createNewConversation}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl hover:from-teal-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Új beszélgetés
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Memory Panel */}
        {currentUser && memoryPanelOpen && (
          <MemoryPanel
            memories={memories}
            onAddMemory={addMemory}
            onDeleteMemory={deleteMemory}
            darkMode={darkMode}
            isOpen={memoryPanelOpen}
            onToggle={() => {
              setSettingsTab('memory');
              setSettingsOpen(true);
              setMemoryPanelOpen(false);
            }}
          />
        )}
        
      </div>
      
      {/* System Mode Toggle */}
      <SystemModeToggle darkMode={darkMode} />
      
      {/* Settings Modal */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setSettingsTab('api');
        }}
        darkMode={darkMode}
        memories={memories}
        onOptimizeMemories={(optimized: Memory[]) => {
          setMemories(optimized);
          saveToStorage('liora-memories', optimized);
        }}
        initialTab={settingsTab}
        currentUser={currentUser}
      />
    </div>
  );
};

export default LioraApp;