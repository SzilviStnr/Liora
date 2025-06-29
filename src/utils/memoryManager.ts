import { Memory, Message, Conversation } from '../types';

export class MemoryManager {
  private memories: Memory[] = [];

  constructor(initialMemories: Memory[] = []) {
    this.memories = initialMemories;
  }

  addMemory(memoryData: Omit<Memory, 'id' | 'createdAt'>): Memory {
    const newMemory: Memory = {
      ...memoryData,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    this.memories.unshift(newMemory);
    return newMemory;
  }

  findRelevantMemories(query: string, limit: number = 5): Memory[] {
    const words = query.toLowerCase().split(' ').filter(word => word.length > 3);
    
    const scoredMemories = this.memories.map(memory => {
      let score = 0;
      
      // Score based on content match
      words.forEach(word => {
        if (memory.content.toLowerCase().includes(word)) {
          score += 2;
        }
        if (memory.context.toLowerCase().includes(word)) {
          score += 1;
        }
        if (memory.tags.some(tag => tag.toLowerCase().includes(word))) {
          score += 1.5;
        }
      });
      
      // Boost score based on importance
      score *= (memory.importance / 10);
      
      return { memory, score };
    });

    return scoredMemories
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory);
  }

  extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['hogy', 'amit', 'vagy', 'ezek', 'volt', 'nagy', 'jött', 'lett', 'majd'].includes(word));
    
    // Count frequency
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Return most frequent words
    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 5);
  }

  createMemoryFromMessage(message: Message, conversation: Conversation): Memory | null {
    // Only create memories for longer, potentially important messages
    if (message.content.length < 30) return null;
    
    const keywords = this.extractKeywords(message.content);
    const importance = Math.min(10, Math.max(1, Math.floor(message.content.length / 25)));
    
    return this.addMemory({
      content: message.content,
      context: `Beszélgetés: ${conversation.title} - ${message.sender}`,
      importance,
      associatedConversations: [conversation.id],
      tags: [message.sender.toLowerCase(), 'beszélgetés', ...keywords.slice(0, 3)]
    });
  }

  createMemoryFromFile(content: string, filename: string, conversationId?: string): Memory {
    const keywords = this.extractKeywords(content);
    
    return this.addMemory({
      content: content,
      context: `Feltöltött fájl: ${filename}`,
      importance: 8, // Files are generally important
      associatedConversations: conversationId ? [conversationId] : [],
      tags: ['feltöltött', 'dokumentum', filename.replace(/\.[^/.]+$/, ""), ...keywords.slice(0, 3)]
    });
  }

  getMemoriesByTag(tag: string): Memory[] {
    return this.memories.filter(memory => 
      memory.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  getMemoriesByImportance(minImportance: number = 7): Memory[] {
    return this.memories
      .filter(memory => memory.importance >= minImportance)
      .sort((a, b) => b.importance - a.importance);
  }

  deleteMemory(memoryId: string): boolean {
    const index = this.memories.findIndex(memory => memory.id === memoryId);
    if (index !== -1) {
      this.memories.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllMemories(): Memory[] {
    return [...this.memories];
  }

  getMemoryCount(): number {
    return this.memories.length;
  }
}