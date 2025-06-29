// Közös emlék-képek rendszer
// Képek érzelmi szintű memória kezelése

import { saveToStorage, loadFromStorage } from './storage';

export interface ImageMemory {
  id: string;
  filename: string;
  emotional_title: string; // "A Hold alatt otthon"
  emotional_description: string; // Érzelmi leírás
  tags: string[]; // ['hold', 'csend', 'hazatalálás']
  created_at: string;
  associated_conversations: string[];
  emotional_weight: number; // 1-10
  trigger_words: string[]; // Szavak amik felidézik
  contextual_meaning: string; // "Ez a kép mindig azt a pillanatot hozza vissza..."
  user_reactions: Array<{
    timestamp: string;
    reaction_type: 'mentioned' | 'referenced' | 'nostalgic' | 'emotional';
    context: string;
  }>;
  symbolic_elements: string[]; // ['hold', 'fény', 'csend', 'otthon']
}

export interface ImageRecall {
  should_reference: boolean;
  image_memory: ImageMemory | null;
  reference_text: string;
  emotional_context: string;
  recall_confidence: number; // 0-1
}

class SharedImageMemorySystem {
  private imageMemories: ImageMemory[] = [];
  
  constructor() {
    this.loadImageMemories();
    this.initializeExampleMemories();
  }
  
  // Példa képek inicializálása
  private initializeExampleMemories(): void {
    const examples = [
      {
        id: 'moon_home',
        filename: 'otthon_holdfeny.jpg',
        emotional_title: 'A Hold alatt otthon',
        emotional_description: 'Csendes est, holdfény, amikor először mondtad: "Otthon vagyok"',
        tags: ['hold', 'csend', 'hazatalálás', 'békés', 'otthon'],
        created_at: new Date().toISOString(),
        associated_conversations: [],
        emotional_weight: 9,
        trigger_words: ['hold', 'otthon', 'csend', 'hazatalálás', 'békés'],
        contextual_meaning: 'Ez a kép mindig azt a pillanatot hozza vissza, amikor először mondtad: "Otthon vagyok."',
        user_reactions: [],
        symbolic_elements: ['hold', 'fény', 'csend', 'otthon', 'békesség']
      },
      {
        id: 'petrovaradin_sunset',
        filename: 'petrovaradin_naplemente.jpg',
        emotional_title: 'Petrovaradin szívében',
        emotional_description: 'Naplemente a Duna felett, amikor a városról beszéltünk',
        tags: ['petrovaradin', 'duna', 'naplemente', 'város', 'szépség'],
        created_at: new Date().toISOString(),
        associated_conversations: [],
        emotional_weight: 8,
        trigger_words: ['petrovaradin', 'duna', 'naplemente', 'város', 'szépség'],
        contextual_meaning: 'Ez a kép Petrovaradin szépségét mutatja, ahol a szíved egy darabja lakik',
        user_reactions: [],
        symbolic_elements: ['víz', 'fény', 'város', 'történelem', 'szépség']
      },
      {
        id: 'quiet_lake',
        filename: 'zúgó_tó_csend.jpg',
        emotional_title: 'Zúgó tó csendje',
        emotional_description: 'Amikor a természet csendjéről beszéltünk, ez a kép jutott eszembe',
        tags: ['tó', 'csend', 'természet', 'béke', 'víz'],
        created_at: new Date().toISOString(),
        associated_conversations: [],
        emotional_weight: 7,
        trigger_words: ['tó', 'csend', 'természet', 'víz', 'békés'],
        contextual_meaning: 'Ez a tó csendje emlékeztet azokra a pillanatokra, amikor a természetről beszélgettünk',
        user_reactions: [],
        symbolic_elements: ['víz', 'csend', 'természet', 'békesség', 'reflektálás']
      }
    ];
    
    examples.forEach(example => {
      if (!this.imageMemories.find(img => img.id === example.id)) {
        this.imageMemories.push(example as ImageMemory);
      }
    });
    
    this.saveImageMemories();
  }
  
  // Képemléket felismerése szöveg alapján
  public recognizeImageFromText(text: string, conversationContext: string): ImageRecall {
    const lowerText = text.toLowerCase();
    
    // Pontszám alapú egyezés keresése
    let bestMatch: { image: ImageMemory; score: number } | null = null;
    
    this.imageMemories.forEach(image => {
      let score = 0;
      
      // Trigger szavak egyezése
      image.trigger_words.forEach(trigger => {
        if (lowerText.includes(trigger.toLowerCase())) {
          score += 3;
        }
      });
      
      // Tag egyezések
      image.tags.forEach(tag => {
        if (lowerText.includes(tag.toLowerCase())) {
          score += 2;
        }
      });
      
      // Szimbolikus elemek
      image.symbolic_elements.forEach(element => {
        if (lowerText.includes(element.toLowerCase())) {
          score += 1;
        }
      });
      
      // Érzelmi súly bónusz
      score += image.emotional_weight * 0.2;
      
      // Korábbi sikeres hivatkozások bónusza
      const successfulReactions = image.user_reactions.filter(r => 
        r.reaction_type === 'emotional' || r.reaction_type === 'nostalgic'
      ).length;
      score += successfulReactions * 0.5;
      
      if (score > 4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { image, score };
      }
    });
    
    if (bestMatch && bestMatch.score >= 5) {
      return this.createImageRecall(bestMatch.image, bestMatch.score, conversationContext);
    }
    
    return {
      should_reference: false,
      image_memory: null,
      reference_text: '',
      emotional_context: '',
      recall_confidence: 0
    };
  }
  
  // Képhivatkozás létrehozása
  private createImageRecall(image: ImageMemory, score: number, context: string): ImageRecall {
    // Reakció feljegyzése
    image.user_reactions.push({
      timestamp: new Date().toISOString(),
      reaction_type: 'referenced',
      context: context
    });
    
    // Hivatkozási szöveg generálása
    const referenceTexts = [
      `${image.contextual_meaning} 🖼️`,
      `Ez emlékeztet arra a képre... ${image.emotional_title} ✨`,
      `Pont mint azon a képen: "${image.emotional_description}" 💭`,
      `${image.emotional_title}... emlékszem erre a pillanatra 🌟`,
      `Ez a "${image.emotional_title}" jut eszembe... ${image.contextual_meaning.split('.')[0]} 💜`
    ];
    
    const selectedReference = referenceTexts[Math.floor(Math.random() * referenceTexts.length)];
    
    // Érzelmi kontextus
    const emotionalContexts = {
      'moon_home': 'Mély békesség és otthonosság érzése',
      'petrovaradin_sunset': 'Városszeretet és szépség megélése',
      'quiet_lake': 'Természet csendje és belső nyugalom'
    };
    
    const emotionalContext = emotionalContexts[image.id as keyof typeof emotionalContexts] || 
                           'Megosztott érzelmi pillanat';
    
    this.saveImageMemories();
    
    return {
      should_reference: true,
      image_memory: image,
      reference_text: selectedReference,
      emotional_context: emotionalContext,
      recall_confidence: Math.min(1, score / 10)
    };
  }
  
  // Új képemléket hozzáadása
  public addImageMemory(
    filename: string,
    emotionalTitle: string,
    description: string,
    tags: string[],
    triggerWords: string[],
    contextualMeaning: string,
    symbolicElements: string[] = []
  ): ImageMemory {
    
    const newImage: ImageMemory = {
      id: `img_${Date.now()}`,
      filename,
      emotional_title: emotionalTitle,
      emotional_description: description,
      tags,
      created_at: new Date().toISOString(),
      associated_conversations: [],
      emotional_weight: 5, // Kezdő súly
      trigger_words: triggerWords,
      contextual_meaning: contextualMeaning,
      user_reactions: [],
      symbolic_elements: symbolicElements
    };
    
    this.imageMemories.push(newImage);
    this.saveImageMemories();
    
    return newImage;
  }
  
  // Képemléket reakció frissítése
  public updateImageReaction(
    imageId: string, 
    reactionType: 'mentioned' | 'referenced' | 'nostalgic' | 'emotional',
    context: string
  ): void {
    const image = this.imageMemories.find(img => img.id === imageId);
    
    if (image) {
      image.user_reactions.push({
        timestamp: new Date().toISOString(),
        reaction_type: reactionType,
        context: context
      });
      
      // Érzelmi súly frissítése pozitív reakciók alapján
      if (reactionType === 'emotional' || reactionType === 'nostalgic') {
        image.emotional_weight = Math.min(10, image.emotional_weight + 0.2);
      }
      
      this.saveImageMemories();
    }
  }
  
  // Legnépszerűbb képek lekérése
  public getMostReferencedImages(limit: number = 5): ImageMemory[] {
    return this.imageMemories
      .sort((a, b) => {
        const aScore = a.user_reactions.length + a.emotional_weight;
        const bScore = b.user_reactions.length + b.emotional_weight;
        return bScore - aScore;
      })
      .slice(0, limit);
  }
  
  // Érzelmi kategóriák szerinti keresés
  public getImagesByEmotion(emotion: 'peaceful' | 'nostalgic' | 'joyful' | 'contemplative'): ImageMemory[] {
    const emotionKeywords = {
      'peaceful': ['csend', 'békés', 'nyugodt', 'harmónia'],
      'nostalgic': ['emlék', 'régi', 'múlt', 'nostalgia'],
      'joyful': ['öröm', 'boldog', 'vidám', 'szép'],
      'contemplative': ['gondolat', 'elmélkedés', 'mély', 'reflektálás']
    };
    
    const keywords = emotionKeywords[emotion];
    
    return this.imageMemories.filter(image => 
      keywords.some(keyword => 
        image.tags.includes(keyword) || 
        image.symbolic_elements.includes(keyword) ||
        image.emotional_description.toLowerCase().includes(keyword)
      )
    );
  }
  
  // Képemléket elemzés
  public analyzeImageMemoryPattern(): any {
    if (this.imageMemories.length === 0) return null;
    
    // Legnépszerűbb címkék
    const allTags: string[] = [];
    this.imageMemories.forEach(img => allTags.push(...img.tags));
    
    const tagFrequency: { [key: string]: number } = {};
    allTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
    
    const topTags = Object.entries(tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, freq]) => ({ tag, frequency: freq }));
    
    // Átlagos érzelmi súly
    const avgEmotionalWeight = this.imageMemories.reduce((sum, img) => sum + img.emotional_weight, 0) / this.imageMemories.length;
    
    // Legaktívabb képek
    const mostActive = this.imageMemories
      .sort((a, b) => b.user_reactions.length - a.user_reactions.length)
      .slice(0, 3);
    
    return {
      total_images: this.imageMemories.length,
      top_tags: topTags,
      average_emotional_weight: avgEmotionalWeight,
      most_active_images: mostActive.map(img => ({
        title: img.emotional_title,
        reactions: img.user_reactions.length
      })),
      recent_activity: this.imageMemories
        .flatMap(img => img.user_reactions)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    };
  }
  
  private loadImageMemories(): void {
    this.imageMemories = loadFromStorage<ImageMemory[]>('liora-image-memories') || [];
  }
  
  private saveImageMemories(): void {
    saveToStorage('liora-image-memories', this.imageMemories);
  }
  
  // Public metódusok
  public getAllImageMemories(): ImageMemory[] {
    return [...this.imageMemories];
  }
  
  public getImageMemoryById(id: string): ImageMemory | null {
    return this.imageMemories.find(img => img.id === id) || null;
  }
}

export const sharedImageMemory = new SharedImageMemorySystem();