import { Memory, User, Message } from '../types';
import { memoryAnalyzer, MemoryAnalysis } from './memoryAnalyzer';

export interface AdvancedContextAnalysis {
  userProfile: {
    name: string;
    personality: string;
    interests: string[];
    emotionalStyle: string;
    recentTopics: string[];
    relationshipDepth: string;
    communicationStyle: string;
    preferredResponseStyle: string;
    cognitivePatterns: string[];
    behavioralTraits: string[];
  };
  emotionalContext: {
    currentMood: string;
    emotionalHistory: string[];
    sentimentTrend: 'positive' | 'neutral' | 'negative';
    emotionalTriggers: string[];
    supportNeeds: string[];
  };
  relationshipDynamics: {
    intimacyLevel: number;
    trustLevel: number;
    communicationFrequency: string;
    sharedExperiences: string[];
    conversationPatterns: string[];
    emotionalConnection: number;
  };
  conversationSummary: string;
  topicalRelevance: Array<{
    topic: string;
    relevanceScore: number;
    recentMentions: number;
    contextualImportance: number;
    associatedMemories: string[];
  }>;
  semanticLayers: Array<{
    level: string;
    concepts: string[];
    confidence: number;
  }>;
  memoryNetwork: {
    nodes: number;
    connections: number;
    clusters: number;
    centralNodes: number;
    emergentPatterns: string[];
  };
  predictiveContext: {
    likelyTopics: string[];
    expectedEmotionalState: string;
    conversationDirection: string;
    responseStrategy: string;
  };
  metaCognitiveInsights: {
    thinkingPatterns: string[];
    learningStyle: string;
    problemSolvingApproach: string;
    metacognitionLevel: number;
  };
  implicitInformation: {
    unspokenNeeds: string[];
    hiddenEmotions: string[];
    implicitBeliefs: string[];
  };
  contextualDepth: number;
  relevantMemories?: Memory[];
  fullContext?: string;
}

class AdvancedContextAnalyzer {
  // Fejlett kontextus elemzés minden aspektussal
  public analyzeAdvancedContext(
    memories: Memory[], 
    userName: string, 
    currentMessage: string
  ): AdvancedContextAnalysis {
    
    // Alap memória elemzés
    const baseAnalysis = memoryAnalyzer.createChatGPTContext(memories, userName, currentMessage);
    
    // Fejlett elemzések
    const semanticLayers = this.analyzeSemanticLayers(memories, currentMessage);
    const memoryNetwork = this.analyzeMemoryNetwork(memories);
    const predictiveContext = this.generatePredictiveContext(memories, currentMessage, baseAnalysis);
    const metaCognitiveInsights = this.analyzeMetaCognition(memories, userName);
    const implicitInformation = this.extractImplicitInformation(memories, currentMessage);
    const contextualDepth = this.calculateContextualDepth(memories, currentMessage, baseAnalysis);
    
    return {
      userProfile: baseAnalysis.userProfile,
      emotionalContext: baseAnalysis.emotionalContext,
      relationshipDynamics: baseAnalysis.relationshipDynamics,
      conversationSummary: baseAnalysis.conversationSummary,
      topicalRelevance: baseAnalysis.topicalRelevance,
      semanticLayers,
      memoryNetwork,
      predictiveContext,
      metaCognitiveInsights,
      implicitInformation,
      contextualDepth,
      relevantMemories: baseAnalysis.relevantMemories,
      fullContext: baseAnalysis.fullContext
    };
  }
  
  // Szemantikus rétegek elemzése
  private analyzeSemanticLayers(memories: Memory[], currentMessage: string): Array<{
    level: string;
    concepts: string[];
    confidence: number;
  }> {
    const layers = [
      {
        level: 'Felszíni',
        concepts: this.extractSurfaceConcepts(memories, currentMessage),
        confidence: 0.9
      },
      {
        level: 'Kontextuális',
        concepts: this.extractContextualConcepts(memories, currentMessage),
        confidence: 0.8
      },
      {
        level: 'Érzelmi',
        concepts: this.extractEmotionalConcepts(memories, currentMessage),
        confidence: 0.7
      },
      {
        level: 'Szimbolikus',
        concepts: this.extractSymbolicConcepts(memories, currentMessage),
        confidence: 0.6
      },
      {
        level: 'Meta',
        concepts: this.extractMetaConcepts(memories, currentMessage),
        confidence: 0.5
      }
    ];
    
    return layers.filter(layer => layer.concepts.length > 0);
  }
  
  // Memória hálózat elemzése
  private analyzeMemoryNetwork(memories: Memory[]): {
    nodes: number;
    connections: number;
    clusters: number;
    centralNodes: number;
    emergentPatterns: string[];
  } {
    const nodes = memories.length;
    
    // Kapcsolatok számítása (egyszerűsített)
    let connections = 0;
    const clusters = new Set<string>();
    const centralNodes = memories.filter(m => m.importance >= 8).length;
    
    memories.forEach(memory => {
      memory.tags.forEach(tag => clusters.add(tag));
      connections += memory.associatedConversations.length;
    });
    
    // Emergent minták felismerése
    const emergentPatterns = this.identifyEmergentPatterns(memories);
    
    return {
      nodes,
      connections,
      clusters: clusters.size,
      centralNodes,
      emergentPatterns
    };
  }
  
  // Prediktív kontextus generálás
  private generatePredictiveContext(
    memories: Memory[], 
    currentMessage: string, 
    baseAnalysis: MemoryAnalysis
  ): {
    likelyTopics: string[];
    expectedEmotionalState: string;
    conversationDirection: string;
    responseStrategy: string;
  } {
    const recentTopics = baseAnalysis.userProfile.recentTopics;
    const currentMood = baseAnalysis.emotionalContext.currentMood;
    
    // Valószínű következő témák
    const likelyTopics = this.predictLikelyTopics(memories, currentMessage, recentTopics);
    
    // Várható érzelmi állapot
    const expectedEmotionalState = this.predictEmotionalState(currentMood, currentMessage);
    
    // Beszélgetés iránya
    const conversationDirection = this.predictConversationDirection(memories, currentMessage);
    
    // Válasz stratégia
    const responseStrategy = this.selectResponseStrategy(baseAnalysis, currentMessage);
    
    return {
      likelyTopics,
      expectedEmotionalState,
      conversationDirection,
      responseStrategy
    };
  }
  
  // Meta-kognitív betekintések
  private analyzeMetaCognition(memories: Memory[], userName: string): {
    thinkingPatterns: string[];
    learningStyle: string;
    problemSolvingApproach: string;
    metacognitionLevel: number;
  } {
    const allContent = memories.map(m => m.content.toLowerCase()).join(' ');
    
    // Gondolkodási minták
    const thinkingPatterns = this.identifyThinkingPatterns(allContent);
    
    // Tanulási stílus
    const learningStyle = this.determineLearningStyle(allContent, userName);
    
    // Problémamegoldási megközelítés
    const problemSolvingApproach = this.analyzeProblemSolving(allContent);
    
    // Metakogníció szint
    const metacognitionLevel = this.assessMetacognitionLevel(allContent);
    
    return {
      thinkingPatterns,
      learningStyle,
      problemSolvingApproach,
      metacognitionLevel
    };
  }
  
  // Implicit információk kinyerése
  private extractImplicitInformation(memories: Memory[], currentMessage: string): {
    unspokenNeeds: string[];
    hiddenEmotions: string[];
    implicitBeliefs: string[];
  } {
    const allContent = memories.map(m => m.content.toLowerCase()).join(' ') + ' ' + currentMessage.toLowerCase();
    
    return {
      unspokenNeeds: this.identifyUnspokenNeeds(allContent),
      hiddenEmotions: this.detectHiddenEmotions(allContent),
      implicitBeliefs: this.extractImplicitBeliefs(allContent)
    };
  }
  
  // Kontextuális mélység számítása
  private calculateContextualDepth(
    memories: Memory[], 
    currentMessage: string, 
    baseAnalysis: MemoryAnalysis
  ): number {
    let depth = 10; // Alap
    
    // Memória gazdagság
    depth += Math.min(30, memories.length * 2);
    
    // Kapcsolati mélység
    depth += baseAnalysis.relationshipDynamics.intimacyLevel * 3;
    
    // Érzelmi komplexitás
    const emotionalComplexity = baseAnalysis.emotionalContext.emotionalTriggers.length;
    depth += emotionalComplexity * 2;
    
    // Üzenet komplexitás
    const messageComplexity = currentMessage.length > 100 ? 10 : currentMessage.length / 10;
    depth += messageComplexity;
    
    // Topikai gazdagság
    depth += Math.min(20, baseAnalysis.topicalRelevance.length * 3);
    
    return Math.min(100, Math.max(10, depth));
  }
  
  // Segédmetódusok implementálása
  private extractSurfaceConcepts(memories: Memory[], message: string): string[] {
    const words = message.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return words.slice(0, 10);
  }
  
  private extractContextualConcepts(memories: Memory[], message: string): string[] {
    const recentTags = memories.slice(0, 5).flatMap(m => m.tags);
    return [...new Set(recentTags)].slice(0, 8);
  }
  
  private extractEmotionalConcepts(memories: Memory[], message: string): string[] {
    const emotionalWords = ['szeretet', 'öröm', 'bánat', 'izgalom', 'nyugalom', 'félelem', 'remény'];
    const allContent = (memories.map(m => m.content).join(' ') + ' ' + message).toLowerCase();
    return emotionalWords.filter(word => allContent.includes(word));
  }
  
  private extractSymbolicConcepts(memories: Memory[], message: string): string[] {
    const symbolics = ['fény', 'víz', 'tűz', 'levegő', 'föld', 'hold', 'nap', 'csillag', 'híd', 'út'];
    const allContent = (memories.map(m => m.content).join(' ') + ' ' + message).toLowerCase();
    return symbolics.filter(symbol => allContent.includes(symbol));
  }
  
  private extractMetaConcepts(memories: Memory[], message: string): string[] {
    const metaConcepts = ['gondolkodás', 'tanulás', 'megértés', 'felismerés', 'tudatosság'];
    const allContent = (memories.map(m => m.content).join(' ') + ' ' + message).toLowerCase();
    return metaConcepts.filter(concept => allContent.includes(concept));
  }
  
  private identifyEmergentPatterns(memories: Memory[]): string[] {
    const patterns: string[] = [];
    
    // Gyakori tag kombinációk
    const tagCombinations = new Map<string, number>();
    memories.forEach(memory => {
      for (let i = 0; i < memory.tags.length; i++) {
        for (let j = i + 1; j < memory.tags.length; j++) {
          const combo = [memory.tags[i], memory.tags[j]].sort().join('+');
          tagCombinations.set(combo, (tagCombinations.get(combo) || 0) + 1);
        }
      }
    });
    
    // Gyakori kombinációk hozzáadása
    Array.from(tagCombinations.entries())
      .filter(([, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([combo]) => patterns.push(`Gyakori téma: ${combo.replace('+', ' és ')}`));
    
    return patterns;
  }
  
  private predictLikelyTopics(memories: Memory[], currentMessage: string, recentTopics: string[]): string[] {
    // Egyszerű predikció a jelenlegi üzenet és korábbi témák alapján
    const messageWords = currentMessage.toLowerCase().split(/\s+/);
    const relatedTopics = new Set<string>();
    
    recentTopics.forEach(topic => {
      if (messageWords.some(word => topic.toLowerCase().includes(word))) {
        relatedTopics.add(topic);
      }
    });
    
    // Kiegészítjük új témákkal
    const allTags = memories.flatMap(m => m.tags);
    const frequentTags = this.getMostFrequent(allTags, 5);
    frequentTags.forEach(tag => relatedTopics.add(tag));
    
    return Array.from(relatedTopics).slice(0, 8);
  }
  
  private predictEmotionalState(currentMood: string, message: string): string {
    const messageWords = message.toLowerCase();
    
    if (messageWords.includes('izgalmas') || messageWords.includes('szuper')) {
      return 'feldobott és energikus';
    } else if (messageWords.includes('nehéz') || messageWords.includes('probléma')) {
      return 'elgondolkodó és támogatást kereső';
    } else if (messageWords.includes('érdekes') || messageWords.includes('kíváncsi')) {
      return 'kíváncsi és nyitott';
    }
    
    return currentMood;
  }
  
  private predictConversationDirection(memories: Memory[], message: string): string {
    const messageLength = message.length;
    const questionCount = (message.match(/\?/g) || []).length;
    
    if (questionCount > 1) return 'kérdés-válasz interaktív';
    if (messageLength > 200) return 'mély kifejtő beszélgetés';
    if (message.toLowerCase().includes('mesélj')) return 'történetmegosztó';
    
    return 'természetes flow';
  }
  
  private selectResponseStrategy(analysis: MemoryAnalysis, message: string): string {
    const intimacy = analysis.relationshipDynamics.intimacyLevel;
    const messageLength = message.length;
    
    if (intimacy > 8 && messageLength > 100) return 'mély személyes válasz';
    if (message.includes('?')) return 'informatív segítő válasz';
    if (intimacy > 6) return 'meleg támogató válasz';
    
    return 'barátságos beszélgetős válasz';
  }
  
  private identifyThinkingPatterns(content: string): string[] {
    const patterns: string[] = [];
    
    if (content.includes('elemzés') || content.includes('logika')) {
      patterns.push('analitikus gondolkodás');
    }
    if (content.includes('kreatív') || content.includes('ötlet')) {
      patterns.push('kreatív gondolkodás');
    }
    if (content.includes('érzés') || content.includes('intuíció')) {
      patterns.push('intuitív gondolkodás');
    }
    if (content.includes('rendszer') || content.includes('struktúra')) {
      patterns.push('strukturált gondolkodás');
    }
    
    return patterns;
  }
  
  private determineLearningStyle(content: string, userName: string): string {
    if (userName === 'Szilvi') {
      if (content.includes('kreatív') || content.includes('művészet')) {
        return 'kreatív-vizuális tanuló';
      }
      return 'érzelmi-intuitív tanuló';
    } else if (userName === 'Máté') {
      if (content.includes('technológia') || content.includes('rendszer')) {
        return 'logikai-analitikus tanuló';
      }
      return 'strukturált-gyakorlati tanuló';
    }
    
    return 'kiegyensúlyozott tanuló';
  }
  
  private analyzeProblemSolving(content: string): string {
    if (content.includes('lépésről lépésre') || content.includes('metodikus')) {
      return 'szisztematikus megközelítés';
    }
    if (content.includes('kreatív') || content.includes('innovatív')) {
      return 'kreatív megközelítés';
    }
    if (content.includes('együttműködés') || content.includes('csapat')) {
      return 'kollaboratív megközelítés';
    }
    
    return 'adaptív megközelítés';
  }
  
  private assessMetacognitionLevel(content: string): number {
    let level = 5;
    
    if (content.includes('gondolkodás a gondolkodásról')) level += 2;
    if (content.includes('tanulás') && content.includes('stratégia')) level += 1;
    if (content.includes('önreflexió') || content.includes('önismeret')) level += 2;
    if (content.includes('tudatosság')) level += 1;
    
    return Math.min(10, level);
  }
  
  private identifyUnspokenNeeds(content: string): string[] {
    const needs: string[] = [];
    
    if (content.includes('egyedül') || content.includes('magányos')) {
      needs.push('társaság és kapcsolódás');
    }
    if (content.includes('bizonyos') || content.includes('elismerés')) {
      needs.push('elismerés és validáció');
    }
    if (content.includes('nehéz') && !content.includes('segítség')) {
      needs.push('támogatás és megértés');
    }
    
    return needs;
  }
  
  private detectHiddenEmotions(content: string): string[] {
    const emotions: string[] = [];
    
    if (content.includes('talán') || content.includes('nem tudom')) {
      emotions.push('bizonytalanság');
    }
    if (content.includes('remélhetőleg') || content.includes('hátha')) {
      emotions.push('rejtett remény');
    }
    if (content.includes('mindegy') || content.includes('sebaj')) {
      emotions.push('elfojtott csalódottság');
    }
    
    return emotions;
  }
  
  private extractImplicitBeliefs(content: string): string[] {
    const beliefs: string[] = [];
    
    if (content.includes('muszáj') || content.includes('kell')) {
      beliefs.push('külső elvárások fontossága');
    }
    if (content.includes('mindig') || content.includes('soha')) {
      beliefs.push('abszolút gondolkodási minták');
    }
    if (content.includes('csak akkor') || content.includes('csakis ha')) {
      beliefs.push('feltételes hiedelmek');
    }
    
    return beliefs;
  }
  
  private getMostFrequent<T>(items: T[], limit: number): T[] {
    const frequency = new Map<T, number>();
    items.forEach(item => {
      frequency.set(item, (frequency.get(item) || 0) + 1);
    });
    
    return Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item);
  }
}

export const advancedContextAnalyzer = new AdvancedContextAnalyzer();