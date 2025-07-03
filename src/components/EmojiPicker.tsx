import React, { useState } from 'react';
import { Smile, Heart, Sparkles, Sun, Moon, Star } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  darkMode: boolean;
  currentUser?: any;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, darkMode, currentUser }) => {
  const [activeCategory, setActiveCategory] = useState('favorites');

  const emojiCategories = {
    favorites: {
      name: 'Kedvencek',
      icon: <Heart className="w-4 h-4" />,
      emojis: ['🦋', '💜', '😊', '🥰', '✨', '🌟', '💖', '🌸', '🌿', '💭', '💫', '🕯️']
    },
    faces: {
      name: 'Arcok',
      icon: <Smile className="w-4 h-4" />,
      emojis: [
        '😊', '😂', '🥰', '😍', '🤗', '🤔', '😌', '😄', '😃', '😁', 
        '🙂', '😉', '😘', '😗', '🥺', '😇', '🤤', '😋', '😜', '😝',
        '🤪', '🤓', '😎', '🥳', '😏', '😒', '🙄', '😮', '😯', '😲',
        '🤯', '😳', '🥴', '😵', '🤐', '🤫', '🤭', '🧐', '🤨', '😐',
        '😑', '😶', '😔', '😟', '🙁', '☹️', '😕', '😞', '😔', '😢',
        '😭', '😤', '😠', '😡', '🤬', '😱', '😨', '😰', '😥', '😓'
      ]
    },
    hearts: {
      name: 'Szívek',
      icon: <Heart className="w-4 h-4" />,
      emojis: ['💜', '💖', '💕', '💓', '💗', '💘', '💝', '💟', '♥️', '❤️', '🧡', '💛', '💚', '💙', '🤍', '🖤', '🤎']
    },
    nature: {
      name: 'Természet',
      icon: <Sparkles className="w-4 h-4" />,
      emojis: [
        '🦋', '🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌱', '🌳',
        '🌟', '⭐', '✨', '💫', '🌙', '🌞', '☀️', '🌈', '🌊', '🌸',
        '💧', '🔥', '🌬️', '🍃'
      ]
    },
    gestures: {
      name: 'Kézjelek',
      icon: <Star className="w-4 h-4" />,
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
    },
    symbols: {
      name: 'Szimbólumok',
      icon: <Moon className="w-4 h-4" />,
      emojis: ['💭', '💬', '🗨️', '🗯️', '💤', '💢', '💥', '💦', '💨', '🕳️', '💣', '💡', '💎', '🔮', '🎵', '🎶', '🎼', '🎤', '🎧', '📻', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻', '🪕', '🪘', '🪗', '🪙', '🕯️']
    }
  };

  return (
    <div className={`absolute bottom-full right-0 mb-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-sm z-50 ${
      currentUser?.name === 'Szilvi'
        ? 'bg-purple-50/95 dark:bg-purple-900/95 border-purple-200 dark:border-purple-700'
        : 'bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b ${
        currentUser?.name === 'Szilvi'
          ? 'border-purple-200 dark:border-purple-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <h3 className={`text-sm font-semibold text-center ${
          currentUser?.name === 'Szilvi'
            ? 'text-purple-800 dark:text-purple-100'
            : 'text-gray-900 dark:text-white'
        }`}>
          Emoji választó 🦋✨
        </h3>
      </div>

      {/* Category tabs */}
      <div className={`flex border-b ${
        currentUser?.name === 'Szilvi'
          ? 'border-purple-200 dark:border-purple-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-1 flex items-center justify-center p-2 text-xs font-medium transition-colors ${
              activeCategory === key
                ? currentUser?.name === 'Szilvi'
                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                : currentUser?.name === 'Szilvi'
                  ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-800/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              {category.icon}
              <span className="text-xs">{category.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-all duration-200 hover:scale-110 ${
                currentUser?.name === 'Szilvi'
                  ? 'hover:bg-purple-100 dark:hover:bg-purple-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer tip */}
      <div className={`p-2 text-xs text-center ${
        currentUser?.name === 'Szilvi'
          ? 'text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/30'
          : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
      } rounded-b-2xl`}>
        💡 Kattints egy emoji-ra a beszúráshoz
      </div>
    </div>
  );
};

export default EmojiPicker;