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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#1c1c1c',
        color: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
      }}
    >
      {/* Üzenetek ablaka */}
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 20,
          backgroundColor: '#2a2a2a',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 15,
              alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              backgroundColor:
                msg.sender === currentUser ? '#4c6ef5' : '#444',
              borderRadius: 20,
              padding: '12px 16px',
              fontSize: 16,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              position: 'relative',
              color: '#fff',
              boxShadow: msg.sender === currentUser
                ? '0 4px 12px rgba(76, 110, 245, 0.6)'
                : '0 4px 12px rgba(68, 68, 68, 0.6)'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: 6 }}>{msg.sender}</div>
            <div>{msg.content}</div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'right',
                marginTop: 6,
              }}
            >
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>

            {msg.sender === currentUser && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 10,
                  display: 'flex',
                  gap: 12,
                  fontSize: 18,
                }}
              >
                <button
                  onClick={() => startEditing(msg)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: '#bbb',
                    transition: 'color 0.3s',
                  }}
                  title="Szerkesztés"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#4c6ef5')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}
                >
                  ✏️
                </button>
                <button
                  onClick={() => copyToClipboard(msg.content)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: '#bbb',
                    transition: 'color 0.3s',
                  }}
                  title="Másolás"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#4c6ef5')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#bbb')}
                >
                  📋
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: '#2a2a2a',
          borderTop: '1px solid #444',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {emojiList.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addEmoji(emoji)}
            style={{
              fontSize: 26,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: '#fff',
              transition: 'color 0.3s',
            }}
            title={`Emoji: ${emoji}`}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#4c6ef5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Üzenet írófelület */}
      <div
        style={{
          padding: 14,
          borderTop: '1px solid #444',
          backgroundColor: '#1c1c1c',
        }}
      >
        <textarea
          style={{
            width: '100%',
            height: 70,
            resize: 'none',
            padding: 10,
            fontSize: 17,
            borderRadius: 14,
            border: '1px solid #444',
            backgroundColor: '#2a2a2a',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          placeholder={editingMessageId ? 'Üzenet szerkesztése...' : 'Írj üzenetet Liorának...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          style={{
            marginTop: 12,
            padding: '12px 25px',
            borderRadius: 14,
            backgroundColor: '#4c6ef5',
            color: 'white',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            width: '100%',
          }}
          disabled={inputValue.trim() === ''}
        >
          {editingMessageId ? 'Mentés' : 'Küldés'}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

