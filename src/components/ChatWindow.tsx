import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  currentUser: string;
  onSendMessage: (msg: string, editedId?: string) => void;
  messages: Message[];
}

const emojiList = ['😊', '😂', '❤️', '👍', '😢', '😮', '😡', '😴', '😇', '🎉'];

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, onSendMessage, messages }) => {
  const [inputValue, setInputValue] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatikus scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue.trim(), editingMessageId ?? undefined);
    setInputValue('');
    setEditingMessageId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && editingMessageId) {
      setEditingMessageId(null);
      setInputValue('');
    }
  };

  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setInputValue(msg.content);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Üzenet kimásolva!');
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', border: '1px solid #ccc', borderRadius: 8 }}>
      {/* Üzenetek ablaka */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: 16, backgroundColor: '#f9f9f9' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              backgroundColor: msg.sender === currentUser ? '#cce4ff' : '#e0e0e0',
              borderRadius: 12,
              padding: '8px 12px',
              fontSize: 16,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              position: 'relative'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{msg.sender}</div>
            <div>{msg.content}</div>
            <div style={{ fontSize: 10, color: '#555', textAlign: 'right' }}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {msg.sender === currentUser && (
              <div style={{ position: 'absolute', top: 4, right: 8, display: 'flex', gap: 8 }}>
                <button onClick={() => startEditing(msg)} style={{ cursor: 'pointer' }} title="Szerkesztés">✏️</button>
                <button onClick={() => copyToClipboard(msg.content)} style={{ cursor: 'pointer' }} title="Másolás">📋</button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      <div style={{ padding: '8px 16px', backgroundColor: '#fff', borderTop: '1px solid #ccc', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {emojiList.map(emoji => (
          <button key={emoji} onClick={() => addEmoji(emoji)} style={{ fontSize: 24, cursor: 'pointer', background: 'none', border: 'none' }}>
            {emoji}
          </button>
        ))}
      </div>

      {/* Üzenet írófelület */}
      <div style={{ padding: 12, borderTop: '1px solid #ccc', backgroundColor: '#fff' }}>
        <textarea
          style={{ width: '100%', height: 60, resize: 'none', padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #ccc' }}
          placeholder={editingMessageId ? 'Üzenet szerkesztése...' : 'Írj üzenetet Liorának...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          style={{ marginTop: 8, padding: '10px 20px', borderRadius: 8, backgroundColor: '#4c6ef5', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          disabled={inputValue.trim() === ''}
        >
          {editingMessageId ? 'Mentés' : 'Küldés'}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
