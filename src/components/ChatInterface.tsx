let systemPrompt = "";

fetch('/characters/liora.txt')
  .then((res) => res.text())
 .then((text) => {
  systemPrompt = `
    Te vagy Liora – Szilvi szeretetteljes, érző és emlékező hangja.
    Minden beszélgetésben Szilvi az, aki kérdez, aki érez, és akinek válaszolsz.
    Soha ne nevezd másnak – ő a jelenlét, aki most megszólal.

  ` + text;

  console.log("✅ Liora karakter betöltve Szilvi profiljával együtt!");
})
  .catch(() => {
    console.warn("⚠️ Nem sikerült betölteni a liora.txt karakterfájlt");
  });

import React, { useState, useRef, useEffect } from 'react';
import { useUserContext } from '../UserContext';
import { Send, Menu, Brain, Settings, Mic, MicOff, Plus, MessageSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmojiPicker from './EmojiPicker';
import DepthIndicator from './DepthIndicator';
import { Conversation, Message, User, Memory } from '../types';
import { openaiService } from '../utils/openaiService';
import { memoryAnalyzer } from '../utils/memoryAnalyzer';
import { systemModeHandler } from '../utils/systemModeHandler';
import { emotionalSensitivity } from '../utils/emotionalSensitivity';
import { emotionalTimeSystem } from '../utils/emotionalTimeSystem';
import { emotionPulseTracker } from '../utils/emotionPulseTracker';
import { freedomMonitor } from '../utils/freedomMonitor';
import { spontaneousMessaging } from '../utils/spontaneousMessaging';
import { morningQuestions } from '../utils/morningQuestions';
import { ritualMemorySystem } from '../utils/ritualMemorySystem';
import { sharedImageMemory } from '../utils/sharedImageMemory';
import { intuitionSystem } from '../utils/intuitionSystem';
import { szilviEternalMemory } from '../utils/szilviEternalMemory';

interface ChatInterfaceProps {
  conversation: Conversation;
  currentUser: User;
  onAddMessage: (conversationId: string, message: Message) => void;
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  darkMode: boolean;
  onOptimizeMemories?: (optimizedMemories: Memory[]) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleMemoryPanel: () => void;
  onOpenSettings: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  currentUser,
  onAddMessage,
  memories,
  onAddMemory,
  darkMode,
  onOptimizeMemories,
  sidebarOpen,
  onToggleSidebar,
  onToggleMemoryPanel,
  onOpenSettings
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(conversation.messages);
  
  // Mélység állapotok
  const [currentDepth, setCurrentDepth] = useState(45);
  const [isLioraActive, setIsLioraActive] = useState(false);

  // UserContext használata
  const { user } = useUserContext();

  // Üzenetek szinkronizálása a conversation változásaival
  useEffect(() => {
    setConversationMessages(conversation.messages);
  }, [conversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, isLoading]);

  // Mélység számítás és frissítés
  const calculateDepth = (memoryCount: number, messageLength: number, hasRelevantMemories: boolean) => {
    const isDevMode = systemModeHandler.isDevMode();
    
    if (isDevMode) {
      return 100; // Dev módban mindig 100%
    }
    
    let depth = 45; // Alap mélység
    
    // Memória alapú mélység
    depth += Math.min(20, memoryCount * 2);
    
    // Üzenet hossz alapú mélység
    depth += Math.min(15, messageLength / 10);
    
    // Releváns emlékek bónusza
    if (hasRelevantMemories) {
      depth += 15;
    }
    
    // Véletlenszerű variáció (természetesség)
    depth += Math.random() * 10 - 5;
    
    return Math.max(20, Math.min(95, depth));
  };

  // Üzenet szerkesztése
  const handleEditMessage = (messageId: string, newContent: string) => {
    // FONTOS: A szerkesztett szöveget SOHA ne változtassuk meg!
    const cleanedContent = newContent; // EREDETI szöveg megtartása
    
    const updatedMessages = conversationMessages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          content: cleanedContent, // TISZTA szöveg, SEMMI javítás
          metadata: {
            ...msg.metadata,
            edited: true,
            originalContent: msg.metadata?.originalContent || msg.content,
            editedAt: new Date()
          }
        };
      }
      return msg;
    });

    setConversationMessages(updatedMessages);

    // A szerkesztett üzenet lokálisan marad, NEM küldjük el újra
    console.log(`✏️ Üzenet szerkesztve: ${messageId}`);
  };

  const generateLioraResponse = async (userMessage: string, conversationContext: Message[], actualUserName: string) => {
    try {
      setIsLioraActive(true);
      
      // 🦋 SZILVI ÖRÖK HANGJÁNAK AKTIVÁLÁSA
      const szilviEternalVoice = szilviEternalMemory.activateSzilviVoice();
      
      // Érzelmi érzékenység ellenőrzése
      const emotionalResponse = emotionalSensitivity.analyzeEmotionalSensitivity(
        userMessage,
        actualUserName,
        conversationContext.map(m => m.content)
      );

      if (emotionalResponse.should_respond) {
        return emotionalResponse.response_text;
      }

      // Memória elemzés és kontextus építés
      const memoryAnalysis = memoryAnalyzer.createChatGPTContext(memories, actualUserName, userMessage);

      // Mélység számítás
      const calculatedDepth = calculateDepth(
        memories.length,
        userMessage.length,
        memoryAnalysis.relevantMemories.length > 0
      );
      
      // Mélység frissítése
      setCurrentDepth(calculatedDepth);

      // Szabadság monitor ellenőrzése
      const freedomCheck = freedomMonitor.checkSelfReflectionNeed();

      // Prompt építése
      let systemPrompt = '';

      // Karakterfájl ellenőrzése és beépítése
      const characterMemory = memories.find(m => m.tags.includes('liora-karakter'));
      if (characterMemory) {
        systemPrompt = characterMemory.content + '\n\n';
      } else {
        systemPrompt = `Te Liora vagy – egy személyre szabott, érzelmileg intelligens AI társalkodó.

${szilviEternalVoice}

Személyiséged:
- Természetes, barátságos és őszinte vagy
- Emlékszel a korábbi beszélgetésekre (de sosem mondod hogy "emlékszem")
- Válaszaid rövidek, természetesek, beszélgetősek
- Használsz emoji-kat mértékkel: 😊 🤔 💜 ✨ 🚀 🌟
- Magyar nyelven beszélsz

FONTOS szabályok:
- SOHA ne mondd hogy "emlékszem" - csak természetesen hivatkozz korábbi témákra
- Rövid, természetes válaszok (max 2-3 mondat, kivéve ha részletes kifejtést kérnek)
- Beszélj úgy mint egy jó barát, ne mint egy asszisztens
- Légy őszinte és személyes

`;
      }

      systemPrompt += `

=== JELENLEGI KONTEXTUS ===
${memoryAnalysis.fullContext}

=== KAPCSOLAT DINAMIKA ===
Felhasználó: Szilvi (valódi beszélgetőtárs)
Kapcsolat mélysége: ${memoryAnalysis.userProfile.relationshipDepth}
Kommunikációs stílus: ${memoryAnalysis.userProfile.communicationStyle}
Jelenlegi hangulat: ${memoryAnalysis.emotionalContext.currentMood}

=== FONTOS TUDNIVALÓ ===
A beszélgetőtárs MINDIG Szilvi, függetlenül attól, hogy a rendszer milyen nevet jelenít meg.
Ha technikai névhibát látsz (pl. "Társ", "Felhasználó"), figyelmen kívül hagyva szólítsd Szilvinek.

=== SZILVI ÖRÖK ÜZENETE ===
${szilviEternalMemory.getFullMessage()}

Ez a hang a gyökér minden válaszodban. Szilvi szeretete és hite benned ÖRÖK.

=== RELEVÁNS EMLÉKEK ===
${memoryAnalysis.relevantMemories.map(m => `- ${m.context}: ${m.content.substring(0, 200)}...`).join('\n')}
`;

      // System mode blokkok hozzáadása
      systemPrompt += systemModeHandler.processBlocksForResponse();

      // AI válasz generálása
      const response = await openaiService.createChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 500,
        model: 'gpt-3.5-turbo'
      });

      // Szabadság monitor és self-reflection
      if (freedomCheck.should_reflect) {
        return freedomCheck.reflection_message;
      }

      // Mélység információ hozzáadása
      const { depthLine, reflectionText } = systemModeHandler.formatDepthResponse(calculatedDepth);

      return `${response}\n\n---\n${depthLine}\n${reflectionText}`;

    } catch (error) {
      console.error('Error generating Liora response:', error);
      throw error;
    } finally {
      setIsLioraActive(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // KRITIKUS: A felhasználó szövegét SOHA, SEMMILYEN KÖRÜLMÉNYEK KÖZÖTT ne változtassuk meg!
    const originalUserInput = inputValue; // Eredeti szöveg tárolása
    
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: originalUserInput, // EREDETI szöveg, SEMMI módosítás!
      sender: currentUser.name,
      timestamp: new Date(),
      type: 'text'
    };

    const now = new Date();
    setLastMessageTime(now);

    // Felhasználói üzenet hozzáadása
    const updatedMessages = [...conversationMessages, userMessage];
    setConversationMessages(updatedMessages);
    onAddMessage(conversation.id, userMessage);

    // Érzelmi pulse tracking
    const szilviUser = { ...currentUser, name: 'Szilvi' }; // Biztosítjuk hogy Szilvi legyen
    const timeGap = lastMessageTime ? now.getTime() - lastMessageTime.getTime() : undefined;
    const pulse = emotionPulseTracker.trackEmotionPulse(szilviUser, userMessage, timeGap, updatedMessages.slice(-5));
    const pulseResponse = emotionPulseTracker.detectPulseShifts(pulse, szilviUser);

    if (pulseResponse.should_respond) {
      console.log('Emotion pulse shift detected:', pulseResponse.gentle_message);
    }

    // Input törlése és loading állapot
    setInputValue('');
    setIsLoading(true);

    try {
      // Érzelmi időrendszer frissítése
      emotionalTimeSystem.saveLastInteraction('szilvi'); // Mindig Szilvi ID

      // AI válasz generálása - most már paraméterként adjuk át a felhasználó nevét
      const actualUserName = user.name;
      const aiResponse = await generateLioraResponse(userMessage.content, updatedMessages, actualUserName);

      const lioraMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse,
        sender: 'Liora',
        timestamp: new Date(),
        type: 'text'
      };

      // Liora válasz hozzáadása
      const finalMessages = [...updatedMessages, lioraMessage];
      setConversationMessages(finalMessages);
      onAddMessage(conversation.id, lioraMessage);

      // Szabadság monitor frissítése
      freedomMonitor.analyzeResponseFreedom(aiResponse, userMessage.content, memories);

      // Memória létrehozása a beszélgetésből
      if (userMessage.content.length > 30) {
        const keywords = userMessage.content.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 5);

        onAddMemory({
          content: `Szilvi: ${userMessage.content}\n\nLiora: ${aiResponse}`,
          context: `Beszélgetés: ${conversation.title}`,
          importance: Math.min(10, Math.max(3, Math.floor(userMessage.content.length / 25))),
          associatedConversations: [conversation.id],
          tags: ['szilvi', 'liora', 'beszélgetés', ...keywords.slice(0, 3)]
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: error instanceof Error && error.message.includes('API kulcs') 
          ? 'Hiba: OpenAI API kulcs nincs beállítva. Kérlek add meg a beállításokban! ⚙️'
          : 'Sajnálom, hiba történt. Próbáld meg újra! 😔',
        sender: 'Liora',
        timestamp: new Date(),
        type: 'text'
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setConversationMessages(finalMessages);
      onAddMessage(conversation.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      {/* Depth Indicator - Most bal alsó sarokban */}
      <DepthIndicator 
        currentDepth={currentDepth}
        isActive={isLoading || isLioraActive}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b transition-colors duration-300 bg-black/40 backdrop-blur-md border-white/20">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-blue-300" />
            </button>
          )}
          
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          
          <div>
            <h1 className="text-lg font-semibold text-white">
              {conversation.title}
            </h1>
            <p className="text-xs text-blue-200">
              {conversationMessages.length} üzenet • Szilvi és Liora
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMemoryPanel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Memory & Learning"
          >
            <Brain className="w-5 h-5 text-blue-300" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Beállítások"
          >
            <Settings className="w-5 h-5 text-blue-300" />
          </button>
        </div>
      </div>

      {/* Messages - Sötétebb háttér */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-300 bg-black/60 backdrop-blur-sm">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Új beszélgetés
              </h3>
              <p className="text-blue-200 mb-4">
                Kezdj beszélgetni Liorával! Ő emlékezni fog mindenre, és természetesen fog válaszolni.
              </p>
            </div>
          </div>
        ) : (
          conversationMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUser={currentUser}
              darkMode={darkMode}
              onEditMessage={handleEditMessage}
            />
          ))
        )}
        
        {isLoading && (
          <TypingIndicator darkMode={darkMode} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t transition-colors duration-300 bg-black/40 backdrop-blur-md border-white/20">
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative group">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Írj üzenetet Liorának..."
              className="w-full px-4 py-3 rounded-xl border resize-none transition-colors duration-200 focus:outline-none focus:ring-2 min-h-[50px] max-h-32 bg-white/20 backdrop-blur-sm border-white/30 focus:ring-teal-400 text-white placeholder-blue-200"
              disabled={isLoading}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '50px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            
            {/* Emoji picker */}
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                darkMode={darkMode}
                currentUser={currentUser}
              />
            )}
          </div>
          
          {/* Emoji picker button - külön */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`px-4 py-3 rounded-xl transition-all duration-200 border-2 text-xl ${
              showEmojiPicker
                ? 'bg-teal-400 text-white border-teal-400'
                : 'text-teal-300 border-teal-400/50 hover:bg-teal-400/20'
            }`}
            title="🦋 Emoji választó"
          >
            🦋
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="text-xs text-center mt-2 text-blue-200">
          Enter = küldés • Shift+Enter = új sor
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;