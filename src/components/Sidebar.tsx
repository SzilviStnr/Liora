import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Moon, 
  Sun, 
  Menu,
  User,
  Clock,
  Settings,
  Edit3
} from 'lucide-react';
import { Conversation, User as UserType } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  currentUser: UserType | null;
  darkMode: boolean;
  onOpenSettings: () => void;
  onToggleDarkMode: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  currentUser,
  darkMode,
  onOpenSettings,
  onToggleDarkMode,
  sidebarOpen,
  onToggleSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Most';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} órája`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} napja`;
    } else {
      return date.toLocaleDateString('hu-HU', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const generateTitle = (conv: Conversation): string => {
  if (conv.title && conv.title !== 'Új beszélgetés') {
    return conv.title;
  }
  
  if (conv.messages.length === 0) return 'Új beszélgetés';
  
  const firstUserMessage = conv.messages.find(m => m.sender !== 'Liora');
  if (!firstUserMessage) return 'Új beszélgetés';
  
  const content = firstUserMessage.content;
  
  // Intelligens címgenerálás
  if (content.toLowerCase().includes('szia') || content.toLowerCase().includes('hello')) {
    return 'Köszönés';
  }
  
  if (content.includes('?')) {
    const words = content.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  }
  
  if (content.toLowerCase().includes('segít') || content.toLowerCase().includes('help')) {
    return 'Segítségkérés';
  }
  
  const words = content.split(' ').slice(0, 5).join(' ');
  let title = words.length > 35 ? words.substring(0, 35) + '...' : words;

  // SZŰRŐ: ha a cím tartalmazza a "Társ" szót, cseréljük "Szilvire"
  if (title.includes('Társ')) {
    title = title.replace(/Társ/g, 'Szilvi');
  }

  return title;
};


  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-black/30 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggleSidebar}
          className="p-3 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-blue-300" />
        </button>
        <button
          onClick={onNewConversation}
          className="p-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:from-teal-500 hover:to-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r flex flex-col transition-colors duration-300 bg-black/30 backdrop-blur-md border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">
            Legutóbbiak
          </h2>
          <div className="flex items-center space-x-1">
            <button
              onClick={onNewConversation}
              className="flex-1 flex items-center justify-center space-x-2 p-3 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              title="Új beszélgetés"
            >
              <Plus className="w-4 h-4 text-blue-300" />
            </button>
            <button
              onClick={onToggleSidebar}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
            >
              <Menu className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-teal-400/20 to-blue-500/20 text-white rounded-xl hover:from-teal-400/30 hover:to-blue-500/30 transition-colors border border-teal-400/30 backdrop-blur-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Új beszélgetés</span>
        </button>
      </div>


      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-blue-300">
            {searchQuery ? 'Nincs találat' : 'Még nincsenek beszélgetések'}
          </div>
        ) : (
          <div className="p-3">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 mb-2 backdrop-blur-sm ${
                  activeConversationId === conversation.id
                    ? 'bg-white/20 border-l-4 border-teal-400 shadow-lg'
                    : 'border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate mb-1">
                      {generateTitle(conversation)}
                    </h3>
                    {conversation.messages.length > 0 && (
                      <p className="text-xs text-blue-200 truncate">
                        {conversation.messages[conversation.messages.length - 1].content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-blue-300">
                        {formatDate(conversation.updatedAt)}
                      </span>
                      <span className="text-xs text-blue-300">
                        {conversation.messages.length} üzenet
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Edit conversation title
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Címszerkesztés"
                    >
                      <Edit3 className="w-3 h-3 text-blue-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Biztosan törölni szeretnéd ezt a beszélgetést?')) {
                          onDeleteConversation(conversation.id);
                        }
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      title="Törlés"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 space-y-4">
        {/* Szilvi profil megjelenítése */}
        {currentUser && (
          <div className="bg-gradient-to-r from-teal-400/20 to-purple-500/20 p-4 rounded-xl border border-teal-400/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <img 
                src="/496516171_1647830432592424_7474492313922329357_n.jpg" 
                alt="Szilvi"
                className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-teal-400/50"
              />
              <div>
                <div className="text-white font-medium">Szilvi</div>
                <div className="text-teal-300 text-sm">Kreatív lélek 🎨💜</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={onOpenSettings}
            className="flex-1 flex items-center justify-center space-x-2 p-3 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm"
          >
            <Settings className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-blue-300">Beállítások</span>
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm"
            title={darkMode ? 'Világos mód' : 'Sötét mód'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-blue-300" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;