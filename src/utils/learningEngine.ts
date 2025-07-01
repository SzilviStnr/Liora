import { saveToStorage, loadFromStorage } from './storage';
import { Message, User, Memory } from '../types';

export interface UserProfile {
  userId: string;
  name: string;
  personality: {
    traits: string[];
    communicationStyle: string;
    emotionalResponsiveness: number; // 1-10
    technicalLevel: number; // 1-10
    preferredTone: string;
    responseLength: string;
  };
  interests: Array<{
    topic: string;
    weight: number;
    lastMentioned: string;
  }>;
  conversationPatterns: {
    averageMessageLength: number;
    questionFrequency: number;
    topicSwitchRate: number;
    emotionalExpressionLevel: number;
  };
  learningProgress: number; // 1-10
  lastUpdated: string;
  totalMessages: number;
  conversationCount: number;
}

export interface LearningStats {
  totalMessages: number;
  conversationCount: number;
  currentMood: string;
  learningProgress: number;
  topInterests: Array<{ topic: string; weight: number }>;
  communicationStyle: {
    preferredTone: string;
    responseLength: string;
    emotionalResponsiveness: number;
    technicalLevel: number;
  };
  emotionalProfile?: {
    optimismLevel: number;
    emotionalStability: number;
    basePersonality: string;
  };
}

class LearningEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  
  constructor() {
    this.loadProfiles();
  }
  
  // Felhasználói profil frissítése üzenet alapján
  public updateUserProfile(user: User, message: Message, conversationId: string): void {
    let profile = this.userProfiles.get(user.id);
    
    if (!profile) {
      profile = this.createNewProfile(user);
    }
    
    // Üzenet elemzése
    const messageAnalysis = this.analyzeMessage(message);
    
    // Profil frissítése
    this.updatePersonality(profile, messageAnalysis);
    this.updateInterests(profile, messageAnalysis);
    this.updateConversationPatterns(profile, messageAnalysis);
    
    profile.totalMessages++;
    profile.lastUpdated = new Date().toISOString();
    profile.learningProgress = Math.min(10, profile.totalMessages / 10);
    
    this.userProfiles.set(user.id, profile);
    this.saveProfiles();
  }
  
  // Új profil létrehozása
  private createNewProfile(user: User): UserProfile {
    return {
      userId: user.id,
      name: user.name,
      personality: {
        traits: [],
        communicationStyle: 'balanced',
        emotionalResponsiveness: 5,
        technicalLevel: 5,
        preferredTone: 'friendly',
        responseLength: 'medium'
      },
      interests: [],
      conversationPatterns: {
        averageMessageLength: 0,
        questionFrequency: 0,
        topicSwitchRate: 0,
        emotionalExpressionLevel: 5
      },
      learningProgress: 1,
      lastUpdated: new Date().toISOString(),
      totalMessages: 0,
      conversationCount: 1
    };
  }
  
  // Üzenet elemzése
  private analyzeMessage(message: Message): any {
    const content = message.content.toLowerCase();
    const length = message.content.length;
    const questionCount = (message.content.match(/\?/g) || []).length;
    
    // Érzelmi kifejezések
    const emotionalWords = ['szeretem', 'utálom', 'izgalmas', 'unalmas', 'fantasztikus', 'szörnyű'];
    const emotionalScore = emotionalWords.filter(word => content.includes(word)).length;
    
    // Technikai szavak
    const technicalWords = ['algoritmus', 'kód', 'program', 'rendszer', 'adatbázis', 'API'];
    const technicalScore = technicalWords.filter(word => content.includes(word)).length;
    
    // Érdeklődési területek
    const interests = this.extractInterests(content);
    
    return {
      length,
      questionCount,
      emotionalScore,
      technicalScore,
      interests,
      tone: this.detectTone(content)
    };
  }
  
  // Személyiség frissítése
  private updatePersonality(profile: UserProfile, analysis: any): void {
    // Kommunikációs stílus
    if (analysis.emotionalScore > 2) {
      profile.personality.communicationStyle = 'emotional';
      profile.personality.emotionalResponsiveness = Math.min(10, profile.personality.emotionalResponsiveness + 0.5);
    } else if (analysis.technicalScore > 1) {
      profile.personality.communicationStyle = 'analytical';
      profile.personality.technicalLevel = Math.min(10, profile.personality.technicalLevel + 0.5);
    }
    
    // Válasz hossz preferencia
    if (analysis.length > 200) {
      profile.personality.responseLength = 'detailed';
    } else if (analysis.length < 50) {
      profile.personality.responseLength = 'concise';
    } else {
      profile.personality.responseLength = 'medium';
    }
    
    // Hangnem
    profile.personality.preferredTone = analysis.tone;
  }
  
  // Érdeklődési körök frissítése
  private updateInterests(profile: UserProfile, analysis: any): void {
    analysis.interests.forEach((interest: string) => {
      const existing = profile.interests.find(i => i.topic === interest);
      
      if (existing) {
        existing.weight += 0.5;
        existing.lastMentioned = new Date().toISOString();
      } else {
        profile.interests.push({
          topic: interest,
          weight: 1,
          lastMentioned: new Date().toISOString()
        });
      }
    });
    
    // Súlyok csökkentése idővel
    profile.interests.forEach(interest => {
      const daysSince = (Date.now() - new Date(interest.lastMentioned).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) {
        interest.weight = Math.max(0.1, interest.weight - 0.1);
      }
    });
    
    // Top 10 érdeklődési kör megtartása
    profile.interests = profile.interests
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10);
  }
  
  // Beszélgetési minták frissítése
  private updateConversationPatterns(profile: UserProfile, analysis: any): void {
    const patterns = profile.conversationPatterns;
    
    // Átlagos üzenet hossz
    patterns.averageMessageLength = (patterns.averageMessageLength + analysis.length) / 2;
    
    // Kérdés gyakoriság
    patterns.questionFrequency = (patterns.questionFrequency + analysis.questionCount) / 2;
    
    // Érzelmi kifejezés szint
    patterns.emotionalExpressionLevel = (patterns.emotionalExpressionLevel + analysis.emotionalScore) / 2;
  }
  
  // Érdeklődési területek kinyerése
  private extractInterests(content: string): string[] {
    const interestKeywords = {
      'technológia': ['technológia', 'kód', 'program', 'számítógép', 'AI', 'algoritmus'],
      'művészet': ['művészet', 'festmény', 'zene', 'film', 'könyv', 'irodalom'],
      'sport': ['sport', 'futball', 'kosárlabda', 'úszás', 'futás', 'edzés'],
      'természet': ['természet', 'állat', 'növény', 'erdő', 'tenger', 'hegy'],
      'utazás': ['utazás', 'nyaralás', 'város', 'ország', 'kultúra', 'felfedezés'],
      'tudomány': ['tudomány', 'fizika', 'kémia', 'biológia', 'matematika', 'kutatás']
    };
    
    const detectedInterests: string[] = [];
    
    Object.entries(interestKeywords).forEach(([interest, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        detectedInterests.push(interest);
      }
    });
    
    return detectedInterests;
  }
  
  // Hangnem felismerése
  private detectTone(content: string): string {
    const positiveWords = ['jó', 'szuper', 'fantasztikus', 'remek', 'szeretek'];
    const negativeWords = ['rossz', 'szörnyű', 'utálom', 'nehéz', 'problémás'];
    const formalWords = ['kérem', 'köszönöm', 'tisztelettel', 'udvariasan'];
    
    const positiveCount = positiveWords.filter(word => content.includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.includes(word)).length;
    const formalCount = formalWords.filter(word => content.includes(word)).length;
    
    if (formalCount > 0) return 'formal';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
  
  // Felhasználói profil lekérése
  public getUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }
  
  // Tanulási statisztikák
  public getLearningStats(userId: string): LearningStats | null {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;
    
    return {
      totalMessages: profile.totalMessages,
      conversationCount: profile.conversationCount,
      currentMood: this.getCurrentMood(profile),
      learningProgress: profile.learningProgress,
      topInterests: profile.interests.slice(0, 5),
      communicationStyle: profile.personality,
      emotionalProfile: this.generateEmotionalProfile(profile)
    };
  }
  
  // Jelenlegi hangulat meghatározása
  private getCurrentMood(profile: UserProfile): string {
    const emotionalLevel = profile.conversationPatterns.emotionalExpressionLevel;
    
    if (emotionalLevel > 7) return 'energetic';
    if (emotionalLevel > 5) return 'positive';
    if (emotionalLevel > 3) return 'neutral';
    return 'calm';
  }
  
  // Érzelmi profil generálása
  private generateEmotionalProfile(profile: UserProfile): any {
    return {
      optimismLevel: Math.min(10, profile.personality.emotionalResponsiveness + 2),
      emotionalStability: profile.conversationPatterns.emotionalExpressionLevel,
      basePersonality: profile.personality.communicationStyle
    };
  }
  
  // Tanulási jelentés generálása
  public generateLearningReport(userId: string): string {
    const profile = this.userProfiles.get(userId);
    if (!profile) return 'Nincs elérhető tanulási adat.';
    
    return `# Tanulási Jelentés - ${profile.name}

## Alapstatisztikák
- **Összes üzenet:** ${profile.totalMessages}
- **Beszélgetések száma:** ${profile.conversationCount}
- **Tanulási szint:** ${profile.learningProgress}/10

## Személyiség Profil
- **Kommunikációs stílus:** ${profile.personality.communicationStyle}
- **Preferált hangnem:** ${profile.personality.preferredTone}
- **Érzelmi válaszkészség:** ${profile.personality.emotionalResponsiveness}/10
- **Technikai szint:** ${profile.personality.technicalLevel}/10

## Top Érdeklődési Körök
${profile.interests.slice(0, 5).map(i => `- **${i.topic}:** ${i.weight.toFixed(1)} pont`).join('\n')}

## Beszélgetési Minták
- **Átlagos üzenet hossz:** ${Math.round(profile.conversationPatterns.averageMessageLength)} karakter
- **Kérdés gyakoriság:** ${profile.conversationPatterns.questionFrequency.toFixed(1)}
- **Érzelmi kifejezés:** ${profile.conversationPatterns.emotionalExpressionLevel.toFixed(1)}/10

## Javaslatok
${this.generateRecommendations(profile)}

---
*Jelentés generálva: ${new Date().toLocaleDateString('hu-HU')}*`;
  }
  
  // Javaslatok generálása
  private generateRecommendations(profile: UserProfile): string {
    const recommendations = [];
    
    if (profile.personality.emotionalResponsiveness > 7) {
      recommendations.push('- Érzelmi témákra fókuszálj, személyes történeteket ossz meg');
    }
    
    if (profile.personality.technicalLevel > 6) {
      recommendations.push('- Technikai részleteket is bátran megoszthatsz');
    }
    
    if (profile.conversationPatterns.questionFrequency > 2) {
      recommendations.push('- Interaktív beszélgetéseket preferál, tegyél fel kérdéseket');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- Folytasd a természetes beszélgetést, a profil még fejlődik');
    }
    
    return recommendations.join('\n');
  }
  
  // Tárolás
  private loadProfiles(): void {
    const saved = loadFromStorage<Array<[string, UserProfile]>>('liora-user-profiles');
    if (saved) {
      this.userProfiles = new Map(saved);
    }
  }
  
  private saveProfiles(): void {
    const profilesArray = Array.from(this.userProfiles.entries());
    saveToStorage('liora-user-profiles', profilesArray);
  }
}

export const learningEngine = new LearningEngine();