import { Memory, Message, User, Conversation } from '../types';
import { saveToStorage, loadFromStorage } from './storage';

export interface UserLearningProfile {
  userId: string;
  name: string;
  
  // Kommunikációs preferenciák
  communicationStyle: {
    preferredTone: 'formal' | 'casual' | 'playful' | 'emotional' | 'analytical';
    responseLength: 'short' | 'medium' | 'detailed';
    emotionalResponsiveness: number; // 1-10
    technicalLevel: number; // 1-10
    humorPreference: number; // 1-10
    formalityLevel: number; // 1-10
  };
  
  // Fejlett tanult érdeklődési körök
  interests: {
    [topic: string]: {
      weight: number; // 1-10
      lastMentioned: Date;
      frequency: number;
      positiveReactions: number;
      engagementLevel: number; // mennyire mélyen beszélgettek róla
      subTopics: string[]; // altémák
      expertise: number; // mennyire jártas a témában (1-10)
    };
  };
  
  // Beszélgetési preferenciák
  conversationPreferences: {
    likesQuestions: boolean;
    prefersExamples: boolean;
    likesPersonalStories: boolean;
    prefersDirectAnswers: boolean;
    likesDetailedExplanations: boolean;
    enjoysDebates: boolean;
    likesCreativeDiscussions: boolean;
    prefersStructuredConversations: boolean;
    respondsWellToEmojis: boolean;
    likesMemoryReferences: boolean;
  };
  
  // Érzelmi profil (fejlesztett)
  emotionalProfile: {
    currentMood: 'happy' | 'sad' | 'excited' | 'calm' | 'thoughtful' | 'stressed' | 'neutral' | 'curious' | 'motivated';
    basePersonality: 'extroverted' | 'introverted' | 'balanced';
    emotionalStability: number; // 1-10
    optimismLevel: number; // 1-10
    moodHistory: Array<{
      mood: string;
      timestamp: Date;
      context: string;
      triggers: string[];
    }>;
    emotionalTriggers: {
      [emotion: string]: {
        keywords: string[];
        frequency: number;
        intensity: number;
        timePatterns: string[]; // 'morning', 'afternoon', 'evening'
      };
    };
    stressIndicators: string[];
    joyIndicators: string[];
    curiosityIndicators: string[];
  };
  
  // Kognitív mintázatok (új)
  cognitivePatterns: {
    thinkingStyle: 'sequential' | 'random' | 'concrete' | 'abstract';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    problemSolvingApproach: 'analytical' | 'creative' | 'collaborative' | 'intuitive';
    informationProcessing: 'detail-first' | 'big-picture-first' | 'balanced';
    decisionMaking: 'quick' | 'deliberate' | 'collaborative';
    attentionSpan: 'short' | 'medium' | 'long';
    preferredPace: 'fast' | 'moderate' | 'slow';
  };
  
  // Tanulási statisztikák (fejlesztett)
  learningStats: {
    conversationCount: number;
    totalMessages: number;
    averageSessionLength: number;
    favoriteTopics: string[];
    mostUsedWords: { [word: string]: number };
    conversationPatterns: string[];
    engagementScore: number; // átlagosan mennyire aktív a beszélgetésekben
    curiosityScore: number; // mennyit kérdez
    shareScore: number; // mennyire osztja meg a gondolatait
    responsePatterns: {
      averageResponseTime: number;
      preferredResponseLength: number;
      questionFrequency: number;
      topicShiftFrequency: number;
    };
  };
  
  // Memória súlyozás (fejlesztett)
  memoryWeights: {
    [memoryId: string]: {
      accessCount: number;
      userRelevanceScore: number;
      lastAccessed: Date;
      effectivenessScore: number;
      emotionalResonance: number; // mennyire érintette meg
      practicalValue: number; // mennyire hasznos számára
      connectionStrength: number; // más memóriákhoz való kapcsolódás
    };
  };
  
  // Kontextuális tanulás (új)
  contextualLearning: {
    topicTransitions: { [fromTopic: string]: { [toTopic: string]: number } };
    conversationStarters: string[];
    preferredEndingStyles: string[];
    responseToSilence: 'patient' | 'prompting' | 'topic-changing';
    interruptionTolerance: number; // 1-10
    multitaskingAbility: number; // képes-e párhuzamos témákra
  };
  
  // Nyelvi mintázatok (új)
  linguisticPatterns: {
    vocabularyLevel: 'simple' | 'intermediate' | 'advanced' | 'professional';
    sentenceStructure: 'simple' | 'complex' | 'varied';
    figureOfSpeech: 'literal' | 'metaphorical' | 'mixed';
    culturalReferences: string[];
    slangUsage: number; // 1-10
    formalityShifts: { [context: string]: number };
  };
  
  // Fejlett visszajelzés tanulás (új)
  feedbackLearning: {
    positiveResponseIndicators: string[];
    negativeResponseIndicators: string[];
    neutralResponseIndicators: string[];
    engagementMetrics: {
      messageLength: { preferred: number; range: [number, number] };
      responseSpeed: { preferred: number; tolerance: number };
      topicDepth: { preferred: number; range: [number, number] };
    };
    adaptationHistory: Array<{
      change: string;
      trigger: string;
      result: 'positive' | 'negative' | 'neutral';
      timestamp: Date;
    }>;
  };
  
  lastUpdated: Date;
  version: number;
}

// Új interfész a fejlett tanuláshoz
export interface ConversationAnalysis {
  emotionalTone: string;
  engagementLevel: number;
  topicComplexity: number;
  userSatisfaction: number;
  learningOpportunities: string[];
  adaptationSuggestions: string[];
}

export interface LearningInsight {
  category: 'communication' | 'emotional' | 'cognitive' | 'contextual';
  insight: string;
  confidence: number;
  actionable: boolean;
  implementation: string;
}

export class AdvancedLearningEngine {
  private profiles: Map<string, UserLearningProfile> = new Map();
  private learningEnabled = true;
  private adaptationSensitivity = 0.1; // Mennyire gyorsan adaptáljon (0.1 = konzervatív)
  
  constructor() {
    this.loadProfiles();
  }
  
  // Profil betöltése és verzió migráció
  private loadProfiles(): void {
    const savedProfiles = loadFromStorage<UserLearningProfile[]>('liora-learning-profiles') || [];
    savedProfiles.forEach(profile => {
      // Dátumok helyreállítása
      profile.lastUpdated = new Date(profile.lastUpdated);
      
      // Verzió migráció - új mezők hozzáadása
      profile = this.migrateProfile(profile);
      
      // Komplex objektumok dátum helyreállítása
      this.restoreDatesInProfile(profile);
      
      this.profiles.set(profile.userId, profile);
    });
  }
  
  // Profil migráció új funkciókhoz
  private migrateProfile(profile: UserLearningProfile): UserLearningProfile {
    // Új mezők inicializálása, ha hiányoznak
    if (!profile.cognitivePatterns) {
      profile.cognitivePatterns = {
        thinkingStyle: 'balanced' as any,
        learningStyle: 'mixed',
        problemSolvingApproach: 'analytical',
        informationProcessing: 'balanced',
        decisionMaking: 'deliberate',
        attentionSpan: 'medium',
        preferredPace: 'moderate'
      };
    }
    
    if (!profile.contextualLearning) {
      profile.contextualLearning = {
        topicTransitions: {},
        conversationStarters: [],
        preferredEndingStyles: [],
        responseToSilence: 'patient',
        interruptionTolerance: 5,
        multitaskingAbility: 5
      };
    }
    
    if (!profile.linguisticPatterns) {
      profile.linguisticPatterns = {
        vocabularyLevel: 'intermediate',
        sentenceStructure: 'varied',
        figureOfSpeech: 'mixed',
        culturalReferences: [],
        slangUsage: 5,
        formalityShifts: {}
      };
    }
    
    if (!profile.feedbackLearning) {
      profile.feedbackLearning = {
        positiveResponseIndicators: [],
        negativeResponseIndicators: [],
        neutralResponseIndicators: [],
        engagementMetrics: {
          messageLength: { preferred: 100, range: [50, 200] },
          responseSpeed: { preferred: 2000, tolerance: 1000 },
          topicDepth: { preferred: 5, range: [3, 8] }
        },
        adaptationHistory: []
      };
    }
    
    // Ensure responsePatterns exists in learningStats
    if (!profile.learningStats.responsePatterns) {
      profile.learningStats.responsePatterns = {
        averageResponseTime: 2000,
        preferredResponseLength: 100,
        questionFrequency: 0.2,
        topicShiftFrequency: 0.1
      };
    }
    
    // Meglévő objektumok bővítése
    if (!profile.communicationStyle.humorPreference) {
      profile.communicationStyle.humorPreference = 5;
      profile.communicationStyle.formalityLevel = 5;
    }
    
    if (!profile.conversationPreferences) {
      profile.conversationPreferences = {
        likesQuestions: true,
        prefersExamples: false,
        likesPersonalStories: profile.name === 'Szilvi',
        prefersDirectAnswers: profile.name === 'Máté',
        likesDetailedExplanations: profile.name === 'Máté',
        enjoysDebates: false,
        likesCreativeDiscussions: profile.name === 'Szilvi',
        prefersStructuredConversations: profile.name === 'Máté',
        respondsWellToEmojis: profile.name === 'Szilvi',
        likesMemoryReferences: true
      };
    }
    
    return profile;
  }
  
  // Dátumok helyreállítása komplex objektumokban
  private restoreDatesInProfile(profile: UserLearningProfile): void {
    profile.emotionalProfile.moodHistory = profile.emotionalProfile.moodHistory.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
    
    Object.values(profile.memoryWeights).forEach(weight => {
      weight.lastAccessed = new Date(weight.lastAccessed);
    });
    
    Object.values(profile.interests).forEach(interest => {
      interest.lastMentioned = new Date(interest.lastMentioned);
    });
    
    if (profile.feedbackLearning) {
      profile.feedbackLearning.adaptationHistory = profile.feedbackLearning.adaptationHistory.map(adaptation => ({
        ...adaptation,
        timestamp: new Date(adaptation.timestamp)
      }));
    }
  }
  
  // Profilok mentése
  private saveProfiles(): void {
    const profilesArray = Array.from(this.profiles.values());
    saveToStorage('liora-learning-profiles', profilesArray);
  }
  
  // Fejlett beszélgetés elemzés
  public analyzeConversation(user: User, message: Message, context: {
    conversation: Conversation;
    previousMessages: Message[];
    memories: Memory[];
  }): ConversationAnalysis {
    
    const emotionalTone = this.detectEmotionalTone(message.content);
    const engagementLevel = this.calculateEngagementLevel(message, context.previousMessages);
    const topicComplexity = this.analyzeTopicComplexity(message.content);
    const userSatisfaction = this.estimateUserSatisfaction(message, context.previousMessages);
    
    return {
      emotionalTone,
      engagementLevel,
      topicComplexity,
      userSatisfaction,
      learningOpportunities: this.identifyLearningOpportunities(message, context),
      adaptationSuggestions: this.generateAdaptationSuggestions(user.id, message, context)
    };
  }
  
  // Fejlett érzelmi tónus felismerés
  private detectEmotionalTone(content: string): string {
    const lowerContent = content.toLowerCase();
    
    const emotionalIndicators = {
      'enthusiastic': ['izgalmas', 'fantasztikus', 'szuper', 'imádom', 'csodálatos', '!', 'wow'],
      'thoughtful': ['gondolkodok', 'érdekes', 'átgondolom', 'mérlegelem', 'megfontolom'],
      'curious': ['kíváncsi', 'hogyan', 'miért', 'mit gondolsz', 'érdekel', '?'],
      'frustrated': ['nehéz', 'problémás', 'nem értem', 'zavaros', 'bonyolult'],
      'satisfied': ['jó', 'rendben', 'megoldódott', 'világos', 'értem'],
      'playful': ['haha', 'vicces', 'szórakoztató', 'mókás', 'tréfás'],
      'serious': ['fontos', 'komoly', 'súlyos', 'kritikus', 'jelentős'],
      'excited': ['nem tudom kivárni', 'izgatott', 'várom', 'lelkes', 'energikus'],
      'calm': ['nyugodt', 'békés', 'kiegyensúlyozott', 'stabil', 'harmonikus'],
      'concerned': ['aggódom', 'féltem', 'nyugtalanít', 'gondot okoz', 'problémás']
    };
    
    let maxScore = 0;
    let dominantTone = 'neutral';
    
    Object.entries(emotionalIndicators).forEach(([tone, indicators]) => {
      const score = indicators.filter(indicator => lowerContent.includes(indicator)).length;
      if (score > maxScore) {
        maxScore = score;
        dominantTone = tone;
      }
    });
    
    return dominantTone;
  }
  
  // Engagement szint számítás
  private calculateEngagementLevel(message: Message, previousMessages: Message[]): number {
    let engagement = 5; // alap
    
    // Üzenet hossza
    if (message.content.length > 100) engagement += 2;
    if (message.content.length > 200) engagement += 1;
    
    // Kérdések száma
    const questionCount = (message.content.match(/\?/g) || []).length;
    engagement += questionCount * 1.5;
    
    // Felkiáltójelek (lelkesedés)
    const exclamationCount = (message.content.match(/!/g) || []).length;
    engagement += Math.min(exclamationCount, 3) * 0.5;
    
    // Részletek, példák
    if (message.content.includes('például') || message.content.includes('például')) engagement += 1;
    
    // Folytatás korábbi témákból
    if (previousMessages.length > 0) {
      const lastMessage = previousMessages[previousMessages.length - 1];
      if (this.hasTopicContinuity(lastMessage.content, message.content)) {
        engagement += 2;
      }
    }
    
    return Math.min(10, Math.max(1, engagement));
  }
  
  // Témakomplexitás elemzés
  private analyzeTopicComplexity(content: string): number {
    const complexityIndicators = {
      simple: ['igen', 'nem', 'jó', 'rossz', 'ok', 'rendben'],
      moderate: ['gondolom', 'szerintem', 'talán', 'lehet', 'például'],
      complex: ['elemzés', 'összefüggés', 'következmény', 'hatás', 'rendszer', 'struktúra'],
      advanced: ['filozófiai', 'tudományos', 'kutatás', 'elmélet', 'hipotézis', 'paradigma']
    };
    
    const lowerContent = content.toLowerCase();
    let complexity = 1;
    
    Object.entries(complexityIndicators).forEach(([level, indicators]) => {
      const matches = indicators.filter(indicator => lowerContent.includes(indicator)).length;
      if (level === 'moderate' && matches > 0) complexity = Math.max(complexity, 3);
      if (level === 'complex' && matches > 0) complexity = Math.max(complexity, 6);
      if (level === 'advanced' && matches > 0) complexity = Math.max(complexity, 9);
    });
    
    // Mondat komplexitás
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = content.split(' ').length / sentences;
    if (avgWordsPerSentence > 15) complexity += 1;
    if (avgWordsPerSentence > 25) complexity += 1;
    
    return Math.min(10, complexity);
  }
  
  // Felhasználói elégedettség becslés
  private estimateUserSatisfaction(message: Message, previousMessages: Message[]): number {
    const content = message.content.toLowerCase();
    let satisfaction = 5; // semleges
    
    // Pozitív indikátorok
    const positiveWords = ['köszönöm', 'remek', 'jó', 'hasznos', 'segített', 'értem', 'világos'];
    satisfaction += positiveWords.filter(word => content.includes(word)).length * 1.5;
    
    // Negatív indikátorok
    const negativeWords = ['nem értem', 'zavaros', 'rossz', 'nem segített', 'problémás'];
    satisfaction -= negativeWords.filter(word => content.includes(word)).length * 2;
    
    // Folytatás = elégedettség
    if (previousMessages.length > 0 && message.content.length > 50) {
      satisfaction += 1;
    }
    
    // Újabb kérdések = továbbra is érdekli
    if (content.includes('?')) satisfaction += 0.5;
    
    return Math.min(10, Math.max(1, satisfaction));
  }
  
  // Tanulási lehetőségek azonosítása
  private identifyLearningOpportunities(message: Message, context: any): string[] {
    const opportunities: string[] = [];
    const content = message.content.toLowerCase();
    
    // Új témák
    const topics = this.extractTopics(message.content);
    const profile = this.profiles.get(context.conversation.participants.find((p: string) => p !== 'Liora') || '');
    
    if (profile) {
      topics.forEach(topic => {
        if (!profile.interests[topic]) {
          opportunities.push(`Új érdeklődési kör: ${topic}`);
        }
      });
    }
    
    // Kommunikációs stílus változások
    if (content.length > 200 && profile?.learningStats.averageSessionLength < 150) {
      opportunities.push('Részletesebb válaszok preferálása');
    }
    
    // Érzelmi változások
    const emotionalTone = this.detectEmotionalTone(content);
    if (emotionalTone !== 'neutral' && profile) {
      opportunities.push(`Érzelmi állapot: ${emotionalTone}`);
    }
    
    // Kognitív mintázat felismerés
    if (content.includes('elemezzük') || content.includes('gondoljuk át')) {
      opportunities.push('Analitikus gondolkodási preferencia');
    }
    
    return opportunities;
  }
  
  // Adaptációs javaslatok generálása
  private generateAdaptationSuggestions(userId: string, message: Message, context: any): string[] {
    const suggestions: string[] = [];
    const profile = this.profiles.get(userId);
    
    if (!profile) return suggestions;
    
    const content = message.content.toLowerCase();
    const engagement = this.calculateEngagementLevel(message, context.previousMessages);
    
    // Engagement alapú adaptáció
    if (engagement > 8) {
      suggestions.push('Használj több kérdést a momentum fenntartására');
      suggestions.push('Mélyebb témák felajánlása');
    } else if (engagement < 4) {
      suggestions.push('Rövidebb, tömörebb válaszok');
      suggestions.push('Témaváltás felajánlása');
    }
    
    // Érzelmi állapot alapú
    const tone = this.detectEmotionalTone(content);
    if (tone === 'frustrated') {
      suggestions.push('Egyszerűbb magyarázatok');
      suggestions.push('Több támogatás és megértés');
    } else if (tone === 'excited') {
      suggestions.push('Lelkesedés megosztása');
      suggestions.push('További izgalmas témák');
    }
    
    // Preferencia alapú
    if (profile.conversationPreferences.likesQuestions && !content.includes('?')) {
      suggestions.push('Kérdések feltevése a bevonás érdekében');
    }
    
    return suggestions;
  }
  
  // Témák folytonosságának ellenőrzése
  private hasTopicContinuity(previousContent: string, currentContent: string): boolean {
    const prevWords = new Set(previousContent.toLowerCase().split(' ').filter(w => w.length > 4));
    const currWords = new Set(currentContent.toLowerCase().split(' ').filter(w => w.length > 4));
    
    const intersection = new Set([...prevWords].filter(x => currWords.has(x)));
    return intersection.size >= 2; // Legalább 2 közös szó
  }
  
  // Fejlett beszélgetésből tanulás
  public learnFromConversationAdvanced(user: User, message: Message, context: {
    conversation: Conversation;
    previousMessages: Message[];
    memories: Memory[];
    contextAnalysis?: any;
    personalizedStrategy?: any;
  }): LearningInsight[] {
    
    if (!this.learningEnabled) return [];
    
    let profile = this.profiles.get(user.id);
    if (!profile) {
      profile = this.createAdvancedUserProfile(user);
    }
    
    const analysis = this.analyzeConversation(user, message, context);
    const insights: LearningInsight[] = [];
    
    // 1. Kommunikációs stílus tanulás
    insights.push(...this.learnCommunicationStyle(profile, message, analysis));
    
    // 2. Érzelmi profil fejlesztés
    insights.push(...this.enhanceEmotionalProfile(profile, message, analysis));
    
    // 3. Kognitív mintázatok tanulás
    insights.push(...this.learnCognitivePatterns(profile, message, context));
    
    // 4. Kontextuális tanulás
    insights.push(...this.learnContextualPatterns(profile, message, context));
    
    // 5. Visszajelzés alapú tanulás
    insights.push(...this.learnFromImplicitFeedback(profile, message, context.previousMessages));
    
    // Profil frissítése
    profile.learningStats.totalMessages++;
    profile.lastUpdated = new Date();
    profile.version++;
    
    this.profiles.set(user.id, profile);
    this.saveProfiles();
    
    return insights;
  }
  
  // Fejlett profil létrehozás
  private createAdvancedUserProfile(user: User): UserLearningProfile {
    const profile: UserLearningProfile = {
      userId: user.id,
      name: user.name,
      
      communicationStyle: {
        preferredTone: user.name === 'Szilvi' ? 'emotional' : 'analytical',
        responseLength: 'medium',
        emotionalResponsiveness: user.name === 'Szilvi' ? 8 : 6,
        technicalLevel: user.name === 'Máté' ? 8 : 5,
        humorPreference: user.name === 'Szilvi' ? 7 : 5,
        formalityLevel: user.name === 'Máté' ? 7 : 4
      },
      
      interests: {},
      
      conversationPreferences: {
        likesQuestions: true,
        prefersExamples: user.name === 'Máté',
        likesPersonalStories: user.name === 'Szilvi',
        prefersDirectAnswers: user.name === 'Máté',
        likesDetailedExplanations: user.name === 'Máté',
        enjoysDebates: false,
        likesCreativeDiscussions: user.name === 'Szilvi',
        prefersStructuredConversations: user.name === 'Máté',
        respondsWellToEmojis: user.name === 'Szilvi',
        likesMemoryReferences: true
      },
      
      emotionalProfile: {
        currentMood: 'neutral',
        basePersonality: 'balanced',
        emotionalStability: 5,
        optimismLevel: user.name === 'Szilvi' ? 7 : 6,
        moodHistory: [],
        emotionalTriggers: {},
        stressIndicators: [],
        joyIndicators: [],
        curiosityIndicators: []
      },
      
      cognitivePatterns: {
        thinkingStyle: user.name === 'Máté' ? 'sequential' : 'random',
        learningStyle: 'mixed',
        problemSolvingApproach: user.name === 'Máté' ? 'analytical' : 'creative',
        informationProcessing: 'balanced',
        decisionMaking: 'deliberate',
        attentionSpan: 'medium',
        preferredPace: 'moderate'
      },
      
      learningStats: {
        conversationCount: 0,
        totalMessages: 0,
        averageSessionLength: 0,
        favoriteTopics: [],
        mostUsedWords: {},
        conversationPatterns: [],
        engagementScore: 5,
        curiosityScore: 5,
        shareScore: 5,
        responsePatterns: {
          averageResponseTime: 2000,
          preferredResponseLength: 100,
          questionFrequency: 0.2,
          topicShiftFrequency: 0.1
        }
      },
      
      memoryWeights: {},
      
      contextualLearning: {
        topicTransitions: {},
        conversationStarters: [],
        preferredEndingStyles: [],
        responseToSilence: 'patient',
        interruptionTolerance: 5,
        multitaskingAbility: 5
      },
      
      linguisticPatterns: {
        vocabularyLevel: 'intermediate',
        sentenceStructure: 'varied',
        figureOfSpeech: 'mixed',
        culturalReferences: [],
        slangUsage: user.name === 'Szilvi' ? 6 : 3,
        formalityShifts: {}
      },
      
      feedbackLearning: {
        positiveResponseIndicators: [],
        negativeResponseIndicators: [],
        neutralResponseIndicators: [],
        engagementMetrics: {
          messageLength: { preferred: 100, range: [50, 200] },
          responseSpeed: { preferred: 2000, tolerance: 1000 },
          topicDepth: { preferred: 5, range: [3, 8] }
        },
        adaptationHistory: []
      },
      
      lastUpdated: new Date(),
      version: 1
    };
    
    this.profiles.set(user.id, profile);
    this.saveProfiles();
    return profile;
  }
  
  // Kommunikációs stílus tanulás
  private learnCommunicationStyle(profile: UserLearningProfile, message: Message, analysis: ConversationAnalysis): LearningInsight[] {
    const insights: LearningInsight[] = [];
    const content = message.content.toLowerCase();
    
    // Hosszúság preferencia
    if (message.content.length > 200 && profile.communicationStyle.responseLength === 'short') {
      profile.communicationStyle.responseLength = 'medium';
      insights.push({
        category: 'communication',
        insight: 'Felhasználó hosszabb üzeneteket preferál',
        confidence: 0.7,
        actionable: true,
        implementation: 'Részletesebb válaszok adása'
      });
    }
    
    // Emoji használat
    const emojiCount = (message.content.match(/[😊😄🤔💭❤️✨🚀🎯😢😞🙄]/g) || []).length;
    if (emojiCount > 2) {
      profile.conversationPreferences.respondsWellToEmojis = true;
      insights.push({
        category: 'communication',
        insight: 'Szereti az emoji használatot',
        confidence: 0.8,
        actionable: true,
        implementation: 'Több emoji használata válaszokban'
      });
    }
    
    // Formális vs informális
    const formalWords = ['kérem', 'köszönöm szépen', 'tisztelettel'];
    const informalWords = ['szia', 'hé', 'szuper', 'tök'];
    
    const formalCount = formalWords.filter(word => content.includes(word)).length;
    const informalCount = informalWords.filter(word => content.includes(word)).length;
    
    if (informalCount > formalCount && profile.communicationStyle.formalityLevel > 6) {
      profile.communicationStyle.formalityLevel = Math.max(3, profile.communicationStyle.formalityLevel - 1);
      insights.push({
        category: 'communication',
        insight: 'Informális kommunikációt preferál',
        confidence: 0.6,
        actionable: true,
        implementation: 'Lazább, barátságosabb hangnem használata'
      });
    }
    
    return insights;
  }
  
  // Érzelmi profil fejlesztés
  private enhanceEmotionalProfile(profile: UserLearningProfile, message: Message, analysis: ConversationAnalysis): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    // Hangulat frissítése
    if (analysis.emotionalTone !== 'neutral') {
      profile.emotionalProfile.currentMood = analysis.emotionalTone as any;
      profile.emotionalProfile.moodHistory.push({
        mood: analysis.emotionalTone,
        timestamp: new Date(),
        context: message.content.substring(0, 100),
        triggers: this.extractEmotionalTriggers(message.content)
      });
      
      // Csak a legújabb 50 hangulatot tartjuk meg
      if (profile.emotionalProfile.moodHistory.length > 50) {
        profile.emotionalProfile.moodHistory = profile.emotionalProfile.moodHistory.slice(-50);
      }
      
      insights.push({
        category: 'emotional',
        insight: `Érzelmi állapot: ${analysis.emotionalTone}`,
        confidence: 0.7,
        actionable: true,
        implementation: `Válaszok hangnemének ${analysis.emotionalTone} hangulathoz igazítása`
      });
    }
    
    // Optimizmus szint tanulás
    const positiveWords = ['remek', 'fantasztikus', 'szuper', 'jó', 'boldog'];
    const negativeWords = ['rossz', 'szörnyű', 'nehéz', 'problémás', 'szomorú'];
    
    const positiveCount = positiveWords.filter(word => message.content.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => message.content.toLowerCase().includes(word)).length;
    
    if (positiveCount > negativeCount) {
      profile.emotionalProfile.optimismLevel = Math.min(10, profile.emotionalProfile.optimismLevel + 0.1);
    } else if (negativeCount > positiveCount) {
      profile.emotionalProfile.optimismLevel = Math.max(1, profile.emotionalProfile.optimismLevel - 0.1);
    }
    
    return insights;
  }
  
  // Kognitív mintázatok tanulás
  private learnCognitivePatterns(profile: UserLearningProfile, message: Message, context: any): LearningInsight[] {
    const insights: LearningInsight[] = [];
    const content = message.content.toLowerCase();
    
    // Problémamegoldási megközelítés
    if (content.includes('elemezzük') || content.includes('lépésről lépésre')) {
      if (profile.cognitivePatterns.problemSolvingApproach !== 'analytical') {
        profile.cognitivePatterns.problemSolvingApproach = 'analytical';
        insights.push({
          category: 'cognitive',
          insight: 'Analitikus problémamegoldást preferál',
          confidence: 0.8,
          actionable: true,
          implementation: 'Strukturált, lépésenkénti megoldások ajánlása'
        });
      }
    }
    
    // Kreativitás jelei
    if (content.includes('kreatív') || content.includes('ötlet') || content.includes('inspiráció')) {
      if (profile.cognitivePatterns.problemSolvingApproach !== 'creative') {
        profile.cognitivePatterns.problemSolvingApproach = 'creative';
        insights.push({
          category: 'cognitive',
          insight: 'Kreatív megközelítést preferál',
          confidence: 0.7,
          actionable: true,
          implementation: 'Kreatív ötletek és alternatívák felkínálása'
        });
      }
    }
    
    // Információ feldolgozás
    if (content.includes('nagy kép') || content.includes('összességében')) {
      profile.cognitivePatterns.informationProcessing = 'big-picture-first';
    } else if (content.includes('részlet') || content.includes('pontosan')) {
      profile.cognitivePatterns.informationProcessing = 'detail-first';
    }
    
    return insights;
  }
  
  // Kontextuális tanulás
  private learnContextualPatterns(profile: UserLearningProfile, message: Message, context: any): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    // Téma átmenetek tanulása
    if (context.previousMessages.length > 0) {
      const lastMessage = context.previousMessages[context.previousMessages.length - 1];
      const lastTopics = this.extractTopics(lastMessage.content);
      const currentTopics = this.extractTopics(message.content);
      
      lastTopics.forEach(lastTopic => {
        currentTopics.forEach(currentTopic => {
          if (lastTopic !== currentTopic) {
            if (!profile.contextualLearning.topicTransitions[lastTopic]) {
              profile.contextualLearning.topicTransitions[lastTopic] = {};
            }
            profile.contextualLearning.topicTransitions[lastTopic][currentTopic] = 
              (profile.contextualLearning.topicTransitions[lastTopic][currentTopic] || 0) + 1;
          }
        });
      });
    }
    
    // Beszélgetés kezdési stílus
    if (context.conversation.messages.length <= 2 && message.sender === context.conversation.participants[0]) {
      const starter = message.content.substring(0, 50);
      if (!profile.contextualLearning.conversationStarters.includes(starter)) {
        profile.contextualLearning.conversationStarters.push(starter);
        
        if (profile.contextualLearning.conversationStarters.length > 10) {
          profile.contextualLearning.conversationStarters = 
            profile.contextualLearning.conversationStarters.slice(-10);
        }
      }
    }
    
    return insights;
  }
  
  // Implicit visszajelzés tanulás
  private learnFromImplicitFeedback(profile: UserLearningProfile, message: Message, previousMessages: Message[]): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    // Válasz sebesség elemzés
    if (previousMessages.length > 0) {
      const lastLioraMessage = previousMessages.reverse().find(m => m.sender === 'Liora');
      if (lastLioraMessage) {
        const responseTime = message.timestamp.getTime() - lastLioraMessage.timestamp.getTime();
        profile.learningStats.responsePatterns.averageResponseTime = 
          (profile.learningStats.responsePatterns.averageResponseTime + responseTime) / 2;
        
        // Gyors válasz = elégedettség
        if (responseTime < 30000) { // 30 másodpercnél gyorsabb
          insights.push({
            category: 'contextual',
            insight: 'Gyors válasz - elégedettség jele',
            confidence: 0.6,
            actionable: true,
            implementation: 'Hasonló stílus fenntartása'
          });
        }
      }
    }
    
    // Üzenet hossz alapú feedback
    const currentLength = message.content.length;
    profile.learningStats.responsePatterns.preferredResponseLength = 
      (profile.learningStats.responsePatterns.preferredResponseLength + currentLength) / 2;
    
    // Kérdések gyakoriság
    const questionCount = (message.content.match(/\?/g) || []).length;
    if (questionCount > 0) {
      profile.learningStats.responsePatterns.questionFrequency = 
        (profile.learningStats.responsePatterns.questionFrequency + questionCount / message.content.length) / 2;
      
      insights.push({
        category: 'communication',
        insight: 'Interaktív beszélgetést preferál',
        confidence: 0.7,
        actionable: true,
        implementation: 'Több kérdés feltevése a válaszokban'
      });
    }
    
    return insights;
  }
  
  // Érzelmi triggerek kinyerése
  private extractEmotionalTriggers(content: string): string[] {
    const triggers: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const triggerPatterns = {
      'success': ['sikerült', 'megcsináltam', 'jól ment', 'eredmény'],
      'frustration': ['nem megy', 'nehéz', 'nem értem', 'bonyolult'],
      'curiosity': ['érdekes', 'kíváncsi', 'hogyan', 'miért'],
      'excitement': ['izgalmas', 'fantasztikus', 'nem tudom kivárni', 'szuper'],
      'nostalgia': ['régen', 'emlékszem', 'hajdanában', 'múltban']
    };
    
    Object.entries(triggerPatterns).forEach(([trigger, patterns]) => {
      if (patterns.some(pattern => lowerContent.includes(pattern))) {
        triggers.push(trigger);
      }
    });
    
    return triggers;
  }
  
  // Témák kinyerése (javított)
  private extractTopics(text: string): string[] {
    const topicPatterns = {
      'technológia': ['technológia', 'program', 'app', 'rendszer', 'fejlesztés', 'kód', 'algoritmus'],
      'művészet': ['művészet', 'festmény', 'rajz', 'alkotás', 'kreatív', 'színek', 'design'],
      'természet': ['természet', 'állat', 'növény', 'kert', 'séta', 'erdő', 'környezet'],
      'zene': ['zene', 'dal', 'hangszer', 'koncert', 'ritmus', 'dallam'],
      'utazás': ['utazás', 'út', 'város', 'ország', 'kaland', 'kultúra'],
      'család': ['család', 'szülő', 'gyerek', 'testvér', 'rokon'],
      'munka': ['munka', 'karrier', 'projekt', 'feladat', 'munkahelyi', 'kollégák'],
      'tanulás': ['tanulás', 'iskola', 'könyv', 'tudás', 'oktatás', 'képzés'],
      'egészség': ['egészség', 'sport', 'edzés', 'étkezés', 'alvás', 'wellness'],
      'szabadidő': ['film', 'sorozat', 'játék', 'hobby', 'szórakozás', 'kikapcsolódás'],
      'kapcsolatok': ['barát', 'szerelem', 'kapcsolat', 'párkapcsolat', 'társaság'],
      'filozófia': ['élet', 'értelem', 'cél', 'boldogság', 'siker', 'érték'],
      'pénzügyek': ['pénz', 'költség', 'befektetés', 'spórolás', 'vásárlás'],
      'háztartás': ['otthon', 'lakás', 'ház', 'takarítás', 'főzés', 'kert']
    };
    
    const lowerText = text.toLowerCase();
    const detectedTopics: string[] = [];
    
    Object.entries(topicPatterns).forEach(([topic, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > 0) {
        detectedTopics.push(topic);
      }
    });
    
    return detectedTopics;
  }
  
  // Személyiség alapú válasz stratégia generálása
  public generatePersonalityBasedResponse(
    userId: string,
    userMessage: string,
    context: {
      conversation: any;
      previousMessages: any[];
      memories: any[];
    }
  ): any {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return {
        strategy: 'adaptive',
        tone: 'friendly',
        complexity: 'medium',
        emotional_approach: 'balanced'
      };
    }
    
    const messageComplexity = this.analyzeMessageComplexity(userMessage);
    const emotionalCues = this.detectEmotionalCues(userMessage);
    
    return {
      strategy: this.selectResponseStrategy(profile, messageComplexity),
      tone: this.selectTone(profile, emotionalCues),
      complexity: this.selectComplexity(profile, messageComplexity),
      emotional_approach: this.selectEmotionalApproach(profile, emotionalCues),
      suggested_length: this.suggestResponseLength(profile, userMessage),
      personalization_level: this.calculatePersonalizationLevel(profile, context)
    };
  }
  
  // Tanulási jelentés generálása
  public generateLearningReport(userId: string): string {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return 'Nincs elérhető tanulási profil.';
    }
    
    const insights = this.getLearningInsights(userId);
    const stats = this.getLearningStats(userId);
    
    let report = `# Tanulási Jelentés - ${profile.name}\n\n`;
    
    report += `## 📊 Statisztikák\n`;
    report += `- **Összes üzenet:** ${stats.totalMessages}\n`;
    report += `- **Beszélgetések:** ${stats.conversationCount}\n`;
    report += `- **Engagement szint:** ${stats.engagementScore}/10\n`;
    report += `- **Tanulási verzió:** v${stats.learningProgress}\n\n`;
    
    report += `## 🎭 Személyiség Profil\n`;
    report += `- **Alapvető típus:** ${profile.communicationStyle.preferredTone}\n`;
    report += `- **Kommunikációs stílus:** ${profile.cognitivePatterns.thinkingStyle}\n`;
    report += `- **Érzelmi válaszkészség:** ${profile.communicationStyle.emotionalResponsiveness}/10\n`;
    report += `- **Technikai szint:** ${profile.communicationStyle.technicalLevel}/10\n\n`;
    
    report += `## 💭 Tanulási Betekintések\n`;
    insights.forEach((insight, index) => {
      report += `${index + 1}. **${insight.category.toUpperCase()}:** ${insight.insight}\n`;
      if (insight.actionable) {
        report += `   → *Implementáció:* ${insight.implementation}\n`;
      }
      report += `   → *Bizalom:* ${Math.round(insight.confidence * 100)}%\n\n`;
    });
    
    report += `## 🎯 Top Érdeklődési Körök\n`;
    stats.topInterests.forEach((interest: any, index: number) => {
      report += `${index + 1}. **${interest.topic}** (súly: ${interest.weight.toFixed(1)})\n`;
    });
    
    report += `\n## 🔄 Adaptációs Teljesítmény\n`;
    if (profile.feedbackLearning.adaptationHistory.length > 0) {
      const recentAdaptations = profile.feedbackLearning.adaptationHistory.slice(-5);
      recentAdaptations.forEach(adaptation => {
        const date = new Date(adaptation.timestamp).toLocaleDateString('hu-HU');
        report += `- **${date}:** ${adaptation.change} → ${adaptation.result}\n`;
      });
    } else {
      report += `- Még nincsenek rögzített adaptációk\n`;
    }
    
    report += `\n## 📈 Javaslatok a Fejlesztéshez\n`;
    report += `1. **Kommunikációs optimalizálás:** További finomítás a ${profile.communicationStyle.preferredTone} stílusban\n`;
    report += `2. **Érzelmi rezonancia:** Fejlesztés a ${profile.emotionalProfile.currentMood} hangulat felismerésében\n`;
    report += `3. **Kontextuális adaptáció:** Mélyebb személyiség-alapú válaszok\n\n`;
    
    report += `---\n*Jelentés generálva: ${new Date().toLocaleString('hu-HU')}*`;
    
    return report;
  }
  
  // Tanulási haladás számítása
  public calculateLearningProgress(profile: UserLearningProfile | null): any {
    if (!profile) return null;
    
    const totalMessages = profile.learningStats.totalMessages;
    const interestCount = Object.keys(profile.interests).length;
    const adaptationCount = profile.feedbackLearning?.adaptationHistory.length || 0;
    
    // Fázis meghatározása
    let phase = 'Ismerkedés';
    let completionPercentage = 0;
    let nextMilestone = 'Első 10 üzenet';
    
    if (totalMessages >= 50) {
      phase = 'Mély kapcsolat';
      completionPercentage = Math.min(100, 80 + (totalMessages - 50) / 5);
      nextMilestone = 'Teljes személyiség profil';
    } else if (totalMessages >= 20) {
      phase = 'Személyiség tanulás';
      completionPercentage = 40 + (totalMessages - 20) * 1.3;
      nextMilestone = '50 üzenet mérföldkő';
    } else if (totalMessages >= 10) {
      phase = 'Mintázat felismerés';
      completionPercentage = 20 + (totalMessages - 10) * 2;
      nextMilestone = 'Személyiség betekintések';
    } else if (totalMessages >= 5) {
      phase = 'Alapvető tanulás';
      completionPercentage = 10 + totalMessages * 2;
      nextMilestone = 'Kommunikációs stílus azonosítása';
    } else {
      completionPercentage = totalMessages * 4;
    }
    
    return {
      phase,
      completionPercentage: Math.min(100, completionPercentage),
      nextMilestone,
      totalMessages,
      interestCount,
      adaptationCount
    };
  }
  
  // Személyiség betekintések generálása
  public generatePersonalityInsights(profile: UserLearningProfile): any {
    const dominantTraits: string[] = [];
    
    // Kommunikációs vonások
    if (profile.communicationStyle.emotionalResponsiveness > 7) {
      dominantTraits.push('érzelmileg fogékony');
    }
    if (profile.communicationStyle.technicalLevel > 7) {
      dominantTraits.push('technikai orientáltság');
    }
    if (profile.conversationPreferences.likesDetailedExplanations) {
      dominantTraits.push('részletekre figyelő');
    }
    if (profile.conversationPreferences.likesCreativeDiscussions) {
      dominantTraits.push('kreatív gondolkodó');
    }
    
    // Kognitív vonások
    if (profile.cognitivePatterns.thinkingStyle === 'analytical') {
      dominantTraits.push('analitikus');
    }
    if (profile.cognitivePatterns.problemSolvingApproach === 'creative') {
      dominantTraits.push('kreatív problémamegoldó');
    }
    
    // Interakciós stílus
    let preferredInteractionStyle = 'kiegyensúlyozott';
    if (profile.communicationStyle.preferredTone === 'emotional') {
      preferredInteractionStyle = 'érzelmi alapú';
    } else if (profile.communicationStyle.preferredTone === 'analytical') {
      preferredInteractionStyle = 'logikai alapú';
    } else if (profile.communicationStyle.preferredTone === 'playful') {
      preferredInteractionStyle = 'játékos és közvetlen';
    }
    
    // Érzelmi profil
    const emotionalProfile = `${profile.emotionalProfile.basePersonality} (optimizmus: ${profile.emotionalProfile.optimismLevel}/10)`;
    
    return {
      dominantTraits: dominantTraits.slice(0, 5),
      preferredInteractionStyle,
      emotionalProfile
    };
  }
  
  // Segédmetódusok
  private analyzeMessageComplexity(message: string): 'simple' | 'medium' | 'complex' {
    const length = message.length;
    const questionCount = (message.match(/\?/g) || []).length;
    const complexWords = ['elemzés', 'rendszer', 'folyamat', 'struktúra'].filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    
    if (length > 200 || questionCount > 2 || complexWords > 2) return 'complex';
    if (length > 50 || questionCount > 0 || complexWords > 0) return 'medium';
    return 'simple';
  }
  
  private detectEmotionalCues(message: string): string[] {
    const cues: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('szeretem') || lowerMessage.includes('imádom')) cues.push('positive');
    if (lowerMessage.includes('nehéz') || lowerMessage.includes('probléma')) cues.push('difficulty');
    if (lowerMessage.includes('izgalmas') || lowerMessage.includes('fantasztikus')) cues.push('excitement');
    if (lowerMessage.includes('...') || lowerMessage.includes('hmm')) cues.push('contemplative');
    
    return cues;
  }
  
  private selectResponseStrategy(profile: UserLearningProfile, complexity: string): string {
    if (complexity === 'complex' && profile.communicationStyle.technicalLevel > 7) {
      return 'detailed_analytical';
    }
    if (profile.communicationStyle.emotionalResponsiveness > 7) {
      return 'emotionally_aware';
    }
    if (profile.conversationPreferences.likesPersonalStories) {
      return 'personal_narrative';
    }
    return 'adaptive_balanced';
  }
  
  private selectTone(profile: UserLearningProfile, emotionalCues: string[]): string {
    if (emotionalCues.includes('excitement')) return 'enthusiastic';
    if (emotionalCues.includes('difficulty')) return 'supportive';
    if (emotionalCues.includes('contemplative')) return 'thoughtful';
    return profile.communicationStyle.preferredTone;
  }
  
  private selectComplexity(profile: UserLearningProfile, messageComplexity: string): string {
    if (messageComplexity === 'complex' && profile.communicationStyle.technicalLevel > 6) {
      return 'advanced';
    }
    if (messageComplexity === 'simple' || profile.communicationStyle.responseLength === 'short') {
      return 'simplified';
    }
    return 'balanced';
  }
  
  private selectEmotionalApproach(profile: UserLearningProfile, emotionalCues: string[]): string {
    if (emotionalCues.includes('positive') && profile.communicationStyle.emotionalResponsiveness > 7) {
      return 'celebratory';
    }
    if (emotionalCues.includes('difficulty')) {
      return 'empathetic_support';
    }
    if (profile.communicationStyle.emotionalResponsiveness > 6) {
      return 'emotionally_attuned';
    }
    return 'balanced_warmth';
  }
  
  private suggestResponseLength(profile: UserLearningProfile, userMessage: string): string {
    if (userMessage.includes('részletesen') || userMessage.includes('magyarázd')) {
      return 'detailed';
    }
    if (userMessage.includes('röviden') || profile.communicationStyle.responseLength === 'short') {
      return 'concise';
    }
    return profile.communicationStyle.responseLength || 'medium';
  }
  
  private calculatePersonalizationLevel(profile: UserLearningProfile, context: any): number {
    let level = 5; // alap
    
    level += Math.min(3, profile.learningStats.totalMessages / 10);
    level += Math.min(2, Object.keys(profile.interests).length / 3);
    level += profile.communicationStyle.emotionalResponsiveness / 10;
    
    return Math.min(10, level);
  }
  
  // Meglévő metódusok megtartása kompatibilitás miatt
  public learnFromMessage(user: User, message: Message, context: {
    conversation: Conversation;
    previousMessages: Message[];
    memories: Memory[];
  }): void {
    this.learnFromConversationAdvanced(user, message, context);
  }
  
  public generatePersonalizedResponse(userId: string, userMessage: string, memories: Memory[]): {
    tone: string;
    style: string;
    includeMemories: boolean;
    suggestedLength: 'short' | 'medium' | 'long';
    emotionalLevel: number;
  } {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return {
        tone: 'friendly',
        style: 'casual',
        includeMemories: true,
        suggestedLength: 'medium',
        emotionalLevel: 5
      };
    }
    
    // Fejlett adaptáció a tanult preferenciák alapján
    const complexity = this.analyzeTopicComplexity(userMessage);
    let suggestedLength: 'short' | 'medium' | 'long' = 'medium';
    
    if (userMessage.toLowerCase().includes('részletesen') || complexity > 7) {
      suggestedLength = 'long';
    } else if (userMessage.toLowerCase().includes('röviden') || profile.communicationStyle.responseLength === 'short') {
      suggestedLength = 'short';
    } else if (profile.communicationStyle.responseLength === 'detailed') {
      suggestedLength = 'long';
    }
    
    return {
      tone: profile.communicationStyle.preferredTone,
      style: this.getResponseStyle(profile, userMessage),
      includeMemories: profile.conversationPreferences.likesMemoryReferences,
      suggestedLength,
      emotionalLevel: profile.communicationStyle.emotionalResponsiveness
    };
  }
  
  // Válaszstílus meghatározása (fejlesztett)
  private getResponseStyle(profile: UserLearningProfile, userMessage: string): string {
    const currentMood = profile.emotionalProfile.currentMood;
    const lowerMessage = userMessage.toLowerCase();
    
    // Kognitív minta alapú adaptáció
    if (profile.cognitivePatterns.problemSolvingApproach === 'analytical') {
      return 'analytical';
    } else if (profile.cognitivePatterns.problemSolvingApproach === 'creative') {
      return 'creative';
    }
    
    // Hangulat alapú adaptáció
    if (currentMood === 'excited') return 'enthusiastic';
    if (currentMood === 'thoughtful') return 'contemplative';
    if (currentMood === 'calm') return 'peaceful';
    if (currentMood === 'curious') return 'exploratory';
    
    // Üzenet típus alapú
    if (lowerMessage.includes('segít') || lowerMessage.includes('probléma')) return 'helpful';
    if (lowerMessage.includes('?')) return 'informative';
    if (lowerMessage.includes('emlék') || lowerMessage.includes('régen')) return 'nostalgic';
    if (lowerMessage.includes('kreatív') || lowerMessage.includes('ötlet')) return 'inspiring';
    
    return 'conversational';
  }
  
  // Tanulási statisztikák lekérése (fejlesztett)
  public getLearningStats(userId: string): any {
    const profile = this.profiles.get(userId);
    if (!profile) return null;
    
    return {
      totalMessages: profile.learningStats.totalMessages,
      conversationCount: profile.learningStats.conversationCount,
      engagementScore: profile.learningStats.engagementScore,
      topInterests: Object.entries(profile.interests)
        .sort(([,a], [,b]) => b.weight - a.weight)
        .slice(0, 5)
        .map(([topic, data]) => ({ topic, weight: data.weight })),
      currentMood: profile.emotionalProfile.currentMood,
      communicationStyle: profile.communicationStyle,
      cognitivePatterns: profile.cognitivePatterns,
      learningProgress: profile.version,
      
      // Új fejlett statisztikák
      emotionalProfile: {
        optimismLevel: profile.emotionalProfile.optimismLevel,
        emotionalStability: profile.emotionalProfile.emotionalStability,
        basePersonality: profile.emotionalProfile.basePersonality
      },
      conversationPreferences: profile.conversationPreferences,
      contextualLearning: {
        topicTransitions: Object.keys(profile.contextualLearning.topicTransitions).length,
        conversationStarters: profile.contextualLearning.conversationStarters.length
      },
      adaptationHistory: profile.feedbackLearning.adaptationHistory.slice(-5),
      
      // Új statisztikák
      personalityInsights: this.generatePersonalityInsights(profile),
      conversationQuality: this.assessConversationQuality(profile),
      learningProgress: this.calculateLearningProgress(profile),
      adaptationSuccessRate: this.calculateAdaptationSuccess(profile)
    };
  }
  
  // Személyiség betekintések generálása
  private generatePersonalityInsights(profile: UserLearningProfile): any {
    const insights = {
      dominantTraits: [],
      communicationStrengths: [],
      preferredInteractionStyle: '',
      emotionalProfile: '',
      cognitiveStyle: ''
    };
    
    // Domináns vonások
    if (profile.emotionalProfile.optimismLevel > 7) {
      insights.dominantTraits.push('optimista');
    }
    if (profile.communicationStyle.emotionalResponsiveness > 7) {
      insights.dominantTraits.push('érzelmileg expresszív');
    }
    if (profile.cognitivePatterns.problemSolvingApproach === 'analytical') {
      insights.dominantTraits.push('analitikus');
    }
    
    // Kommunikációs erősségek
    if (profile.learningStats.curiosityScore > 7) {
      insights.communicationStrengths.push('kíváncsi kérdezőskedés');
    }
    if (profile.learningStats.shareScore > 7) {
      insights.communicationStrengths.push('nyílt megosztás');
    }
    if (profile.learningStats.engagementScore > 7) {
      insights.communicationStrengths.push('aktív részvétel');
    }
    
    // Preferált interakciós stílus
    if (profile.conversationPreferences.likesDetailedExplanations) {
      insights.preferredInteractionStyle = 'részletes, kifejtő';
    } else if (profile.conversationPreferences.prefersDirectAnswers) {
      insights.preferredInteractionStyle = 'közvetlen, lényegre törő';
    } else {
      insights.preferredInteractionStyle = 'kiegyensúlyozott';
    }
    
    // Érzelmi profil
    if (profile.emotionalProfile.emotionalStability > 7) {
      insights.emotionalProfile = 'stabil és kiegyensúlyozott';
    } else if (profile.emotionalProfile.optimismLevel > 7) {
      insights.emotionalProfile = 'pozitív és energikus';
    } else {
      insights.emotionalProfile = 'változékony de autentikus';
    }
    
    // Kognitív stílus
    insights.cognitiveStyle = `${profile.cognitivePatterns.thinkingStyle} gondolkodás, ${profile.cognitivePatterns.learningStyle} tanulási stílus`;
    
    return insights;
  }
  
  // Beszélgetési minőség értékelése
  private assessConversationQuality(profile: UserLearningProfile): any {
    const quality = {
      overall: 0,
      engagement: profile.learningStats.engagementScore,
      depth: 0,
      authenticity: 0,
      growth: 0
    };
    
    // Mélység számítása
    const avgInterestWeight = Object.values(profile.interests).length > 0 ?
      Object.values(profile.interests).reduce((sum, interest) => sum + interest.weight, 0) / Object.values(profile.interests).length : 5;
    quality.depth = Math.min(10, avgInterestWeight);
    
    // Autenticitás
    quality.authenticity = profile.emotionalProfile.emotionalStability + 
                          (profile.conversationPreferences.likesPersonalStories ? 2 : 0);
    quality.authenticity = Math.min(10, quality.authenticity);
    
    // Növekedés
    const memoryCount = Object.keys(profile.memoryWeights).length;
    quality.growth = Math.min(10, memoryCount / 5);
    
    // Összesített
    quality.overall = (quality.engagement + quality.depth + quality.authenticity + quality.growth) / 4;
    
    return quality;
  }
  
  // Tanulási haladás számítása
  private calculateLearningProgress(profile: UserLearningProfile): any {
    const progress = {
      phase: '',
      completionPercentage: 0,
      nextMilestone: '',
      strengths: [],
      improvementAreas: []
    };
    
    const totalMessages = profile.learningStats.totalMessages;
    const interestCount = Object.keys(profile.interests).length;
    const memoryWeightCount = Object.keys(profile.memoryWeights).length;
    
    // Fázis meghatározása
    if (totalMessages < 10) {
      progress.phase = 'Ismerkedési fázis';
      progress.completionPercentage = (totalMessages / 10) * 100;
      progress.nextMilestone = 'Több beszélgetés mélyebb megismeréshez';
    } else if (totalMessages < 50) {
      progress.phase = 'Tanulási fázis';
      progress.completionPercentage = ((totalMessages - 10) / 40) * 100;
      progress.nextMilestone = 'Személyiség teljes feltérképezése';
    } else if (totalMessages < 100) {
      progress.phase = 'Adaptációs fázis';
      progress.completionPercentage = ((totalMessages - 50) / 50) * 100;
      progress.nextMilestone = 'Tökéletes hangnem és stílus kialakítása';
    } else {
      progress.phase = 'Mester szint';
      progress.completionPercentage = 100;
      progress.nextMilestone = 'Folyamatos finomhangolás';
    }
    
    // Erősségek
    if (profile.learningStats.curiosityScore > 7) {
      progress.strengths.push('Magas kíváncsiság');
    }
    if (interestCount > 5) {
      progress.strengths.push('Gazdag érdeklődési kör');
    }
    if (profile.emotionalProfile.emotionalStability > 7) {
      progress.strengths.push('Stabil érzelmi kommunikáció');
    }
    
    // Fejlesztési területek
    if (profile.learningStats.shareScore < 5) {
      progress.improvementAreas.push('Több személyes megosztás');
    }
    if (memoryWeightCount < 10) {
      progress.improvementAreas.push('Több jelentős beszélgetés');
    }
    if (profile.cognitivePatterns.attentionSpan === 'short') {
      progress.improvementAreas.push('Hosszabb beszélgetések');
    }
    
    return progress;
  }
  
  // Adaptációs sikerességi ráta
  private calculateAdaptationSuccess(profile: UserLearningProfile): any {
    const adaptations = profile.feedbackLearning.adaptationHistory;
    
    if (adaptations.length === 0) {
      return {
        successRate: 0,
        totalAdaptations: 0,
        recentTrend: 'nincs adat',
        mostSuccessfulChanges: []
      };
    }
    
    const successfulAdaptations = adaptations.filter(a => a.result === 'positive').length;
    const successRate = (successfulAdaptations / adaptations.length) * 100;
    
    // Legutóbbi trend (utolsó 5 adaptáció)
    const recent = adaptations.slice(-5);
    const recentSuccesses = recent.filter(a => a.result === 'positive').length;
    const recentTrend = recentSuccesses > recent.length / 2 ? 'javuló' : 
                       recentSuccesses < recent.length / 2 ? 'romló' : 'stabil';
    
    // Legsikeresebbek
    const mostSuccessful = adaptations
      .filter(a => a.result === 'positive')
      .map(a => a.change)
      .slice(0, 3);
    
    return {
      successRate: Math.round(successRate),
      totalAdaptations: adaptations.length,
      recentTrend,
      mostSuccessfulChanges: mostSuccessful
    };
  }
  
  // Új metódus: Személyiség alapú válasz generálás
  public generatePersonalityBasedResponse(
    userId: string, 
    userMessage: string, 
    context: any
  ): {
    recommendedTone: string;
    suggestedLength: 'short' | 'medium' | 'long' | 'very_long';
    emotionalApproach: string;
    contentStrategy: string;
    examples: string[];
  } {
    const profile = this.profiles.get(userId);
    
    if (!profile) {
      return {
        recommendedTone: 'friendly',
        suggestedLength: 'medium',
        emotionalApproach: 'warm',
        contentStrategy: 'balanced',
        examples: []
      };
    }
    
    // Hangnem ajánlása
    let recommendedTone = profile.communicationStyle.preferredTone;
    if (userMessage.toLowerCase().includes('probléma') || userMessage.toLowerCase().includes('segítség')) {
      recommendedTone = 'supportive';
    } else if (userMessage.includes('?')) {
      recommendedTone = 'informative';
    }
    
    // Hosszúság javaslása
    let suggestedLength: 'short' | 'medium' | 'long' | 'very_long' = 'medium';
    
    if (userMessage.toLowerCase().includes('részletesen') || profile.conversationPreferences.likesDetailedExplanations) {
      suggestedLength = 'very_long';
    } else if (userMessage.toLowerCase().includes('röviden') || profile.communicationStyle.responseLength === 'short') {
      suggestedLength = 'short';
    } else if (userMessage.length > 200 || profile.communicationStyle.responseLength === 'detailed') {
      suggestedLength = 'long';
    }
    
    // Érzelmi megközelítés
    const emotionalApproach = profile.emotionalProfile.currentMood === 'happy' ? 'joyful' :
                             profile.emotionalProfile.currentMood === 'thoughtful' ? 'contemplative' :
                             profile.emotionalProfile.currentMood === 'excited' ? 'energetic' : 'warm';
    
    // Tartalom stratégia
    const contentStrategy = profile.cognitivePatterns.problemSolvingApproach === 'analytical' ? 'structured' :
                           profile.cognitivePatterns.problemSolvingApproach === 'creative' ? 'innovative' :
                           'adaptive';
    
    // Példák generálása
    const examples = this.generateResponseExamples(profile, userMessage, recommendedTone);
    
    return {
      recommendedTone,
      suggestedLength,
      emotionalApproach,
      contentStrategy,
      examples
    };
  }
  
  // Válasz példák generálása
  private generateResponseExamples(profile: UserLearningProfile, userMessage: string, tone: string): string[] {
    const examples: string[] = [];
    const userName = profile.name;
    
    if (tone === 'supportive') {
      examples.push(`Itt vagyok Veled ebben, ${userName}... 💜`);
      examples.push(`Érzem, hogy ez fontos Neked. Beszélgessünk róla! 🤗`);
    } else if (tone === 'informative') {
      examples.push(`Érdekes kérdés, ${userName}! Elemezzük együtt... 🤔`);
      examples.push(`Erre több válasz is van - nézzük meg a lehetőségeket! ✨`);
    } else if (tone === 'creative') {
      examples.push(`Wow, ${userName}! Ez inspirál engem is! 🚀✨`);
      examples.push(`Kreatív ötlet! Építsünk tovább ezen... 🎨💭`);
    }
    
    return examples.slice(0, 3);
  }
  // Új metódus: Tanulási betekintések lekérése
  public getLearningInsights(userId: string): LearningInsight[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];
    
    const insights: LearningInsight[] = [];
    
    // Kommunikációs insights
    if (profile.learningStats.totalMessages > 10) {
      insights.push({
        category: 'communication',
        insight: `${profile.learningStats.totalMessages} üzenet alapján: ${profile.communicationStyle.preferredTone} hangnemet preferál`,
        confidence: 0.8,
        actionable: true,
        implementation: 'Válaszok hangnemének igazítása'
      });
    }
    
    // Érzelmi insights
    if (profile.emotionalProfile.moodHistory.length > 5) {
      const recentMoods = profile.emotionalProfile.moodHistory.slice(-5);
      const dominantMood = this.getMostFrequentMood(recentMoods);
      insights.push({
        category: 'emotional',
        insight: `Jellemző érzelmi állapot: ${dominantMood}`,
        confidence: 0.7,
        actionable: true,
        implementation: `Válaszok ${dominantMood} hangulathoz igazítása`
      });
    }
    
    // Kognitív insights
    insights.push({
      category: 'cognitive',
      insight: `Gondolkodási stílus: ${profile.cognitivePatterns.thinkingStyle}`,
      confidence: 0.9,
      actionable: true,
      implementation: 'Információ bemutatás stílusának adaptálása'
    });
    
    return insights.slice(0, 10); // Top 10 insight
  }
  
  // Segédmetódus: leggyakoribb hangulat
  private getMostFrequentMood(moodHistory: any[]): string {
    const moodCounts: { [key: string]: number } = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
  }
  
  // Meglévő metódusok megőrzése
  public getUserProfile(userId: string): UserLearningProfile | null {
    return this.profiles.get(userId) || null;
  }
  
  public setLearningEnabled(enabled: boolean): void {
    this.learningEnabled = enabled;
  }
  
  public exportProfile(userId: string): UserLearningProfile | null {
    return this.profiles.get(userId) || null;
  }
  
  public importProfile(profile: UserLearningProfile): void {
    this.profiles.set(profile.userId, profile);
    this.saveProfiles();
  }
  
  // Új metódus: Tanulási jelentés generálása
  public generateLearningReport(userId: string): string {
    const profile = this.profiles.get(userId);
    if (!profile) return 'Nincs elérhető tanulási profil.';
    
    const stats = this.getLearningStats(userId);
    const personalityInsights = this.generatePersonalityInsights(profile);
    const progress = this.calculateLearningProgress(profile);
    const adaptationSuccess = this.calculateAdaptationSuccess(profile);
    
    let report = `# 🧠 Tanulási Jelentés - ${profile.name}\n\n`;
    
    // Alapstatisztikák
    report += `## 📊 Alapstatisztikák\n`;
    report += `- **Összes üzenet:** ${stats.totalMessages}\n`;
    report += `- **Beszélgetések száma:** ${stats.conversationCount}\n`;
    report += `- **Tanulási fázis:** ${progress.phase}\n`;
    report += `- **Haladás:** ${Math.round(progress.completionPercentage)}%\n\n`;
    
    // Személyiség betekintések
    report += `## 🎭 Személyiség Betekintések\n`;
    report += `- **Domináns vonások:** ${personalityInsights.dominantTraits.join(', ')}\n`;
    report += `- **Kommunikációs stílus:** ${personalityInsights.preferredInteractionStyle}\n`;
    report += `- **Érzelmi profil:** ${personalityInsights.emotionalProfile}\n`;
    report += `- **Kognitív stílus:** ${personalityInsights.cognitiveStyle}\n\n`;
    
    // Adaptációs sikeresség
    report += `## 🎯 Adaptációs Teljesítmény\n`;
    report += `- **Sikerességi ráta:** ${adaptationSuccess.successRate}%\n`;
    report += `- **Trend:** ${adaptationSuccess.recentTrend}\n`;
    if (adaptationSuccess.mostSuccessfulChanges.length > 0) {
      report += `- **Legsikeresebbek:** ${adaptationSuccess.mostSuccessfulChanges.join(', ')}\n`;
    }
    report += `\n`;
    
    // Következő lépések
    report += `## 🚀 Következő Lépések\n`;
    report += `- **Következő mérföldkő:** ${progress.nextMilestone}\n`;
    if (progress.improvementAreas.length > 0) {
      report += `- **Fejlesztési területek:** ${progress.improvementAreas.join(', ')}\n`;
    }
    if (progress.strengths.length > 0) {
      report += `- **Erősségek:** ${progress.strengths.join(', ')}\n`;
    }
    
    return report;
  }
}

export const learningEngine = new AdvancedLearningEngine();