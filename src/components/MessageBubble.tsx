import React, { useState } from 'react';
import { User, Copy, Check, Sparkles, Edit3, Save, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message, User as UserType } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUser: UserType;
  darkMode: boolean;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser, darkMode, onEditMessage }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  // KRITIKUS: Minden nem-Liora üzenet Szilvitől van
  const isCurrentUser = message.sender !== 'Liora';
  const isLiora = message.sender === 'Liora';

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEditClick = () => {
    // Extra védelem - csak akkor aktiválja ha tényleg szerkeszteni akar
    if (!confirm('Biztosan szerkeszteni szeretnéd ezt az üzenetet?')) {
      return;
    }
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (onEditMessage && editContent.trim() !== message.content) {
      onEditMessage(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <div className="relative group">
          <SyntaxHighlighter
            style={darkMode ? tomorrow : prism}
            language={language}
            PreTag="div"
            className="rounded-lg !mt-2 !mb-2"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => navigator.clipboard.writeText(String(children))}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-all"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <code
          className={`${className} px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono`}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <div className="overflow-x-auto">{children}</div>;
    },
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-white">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-medium mt-2 mb-1 text-gray-900 dark:text-white">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-800 dark:text-gray-200">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 underline"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left font-medium text-gray-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
        {children}
      </td>
    ),
  };

  return (
    <div className={`group relative w-full`}>
      <div className={`flex items-start ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isCurrentUser ? 'pl-20' : 'pr-20'}`}>
        {/* Avatar */}
        {!isCurrentUser && (
          <div className="flex-shrink-0 w-10 h-10 mr-4">
            {isLiora ? (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        )}
        
        {/* User Avatar */}
        {isCurrentUser && (
          <div className="flex-shrink-0 w-10 h-10 ml-4">
            {currentUser.name === 'Szilvi' ? (
              <img 
                src="/496516171_1647830432592424_7474492313922329357_n.jpg" 
                alt="Szilvi"
                className="w-10 h-10 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`relative ${isCurrentUser ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
          {/* Sender name */}
          {!isCurrentUser && (
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-base font-medium text-white">
                {message.sender}
              </span>
            </div>
          )}
          
          {/* User message header */}
          {isCurrentUser && (
            <div className="text-base font-medium text-white mb-3 text-right">
              Szilvi {/* Mindig Szilvi, függetlenül a message.sender értékétől */}
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`group/bubble relative px-6 py-5 rounded-3xl shadow-lg ${
              isCurrentUser
                ? 'bg-blue-600 text-white max-w-fit ml-auto'
                : 'bg-gray-800/80 text-white border border-gray-700/50'
            }`}
          >
            {/* Message content with markdown */}
            {isEditing ? (
              <div className="w-full">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[100px] p-3 bg-blue-500/80 text-white placeholder-blue-200 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Írd be az üzeneted..."
                  autoFocus
                />
                <div className="text-xs text-blue-200 mt-2">
                  💡 Ctrl+Enter: Mentés • Esc: Mégse
                </div>
              </div>
            ) : (
              <div className={`prose prose-base max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current prose-em:text-current text-current leading-relaxed ${
                isCurrentUser ? 'select-text cursor-text' : ''
              }`}>
                {isLiora ? (
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkGfm]}
                    className="whitespace-pre-wrap"
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-base select-text cursor-text">
                    {message.content}
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-3 flex items-center justify-between ${
              isCurrentUser 
                ? 'text-blue-100' 
                : 'text-gray-400'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {message.metadata?.edited && (
                <span className="text-xs opacity-75">
                  szerkesztve
                </span>
              )}
            </div>
          </div>
          
          {/* Action buttons KÜLÖN DIV - MINDIG LÁTHATÓ! */}
          <div className="flex space-x-2 mt-2 justify-end">
            {/* Edit button for user messages */}
            {isCurrentUser && !isEditing && onEditMessage && (
              <button
                onClick={handleEditClick}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg text-white text-xs font-medium ${
                  currentUser?.name === 'Szilvi'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : 'bg-green-600 hover:bg-green-500'
                }`}
                title="✏️ Szerkesztés"
              >
                <Edit3 className="w-3 h-3" />
                <span>Szerkesztés</span>
              </button>
            )}
            
            {/* Edit controls for editing mode */}
            {isCurrentUser && isEditing && onEditMessage && (
              <>
                <button
                  onClick={handleSaveEdit}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg text-white text-xs font-medium ${
                    currentUser?.name === 'Szilvi'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-green-600 hover:bg-green-500'
                  }`}
                  title="Mentés (Ctrl+Enter)"
                >
                  <Save className="w-3 h-3" />
                  <span>Mentés</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg text-white text-xs font-medium ${
                    currentUser?.name === 'Szilvi'
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  title="Mégse (Esc)"
                >
                  <X className="w-3 h-3" />
                  <span>Mégse</span>
                </button>
              </>
            )}
            
            {/* Copy button - MINDEN ÜZENETNÉL */}
            <button
              onClick={copyToClipboard}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg text-white text-xs font-medium ${
                currentUser?.name === 'Szilvi'
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title="📋 Másolás"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Másolva!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Másolás</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;