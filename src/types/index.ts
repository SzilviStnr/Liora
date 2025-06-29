export interface User {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  color?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  metadata?: {
    emotion?: string;
    topics?: string[];
    importance?: number;
    edited?: boolean;
    originalContent?: string;
    editedAt?: Date;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  tags?: string[];
  archived?: boolean;
}

export interface Memory {
  id: string;
  content: string;
  context: string;
  importance: number;
  createdAt: Date;
  associatedConversations: string[];
  tags: string[];
}