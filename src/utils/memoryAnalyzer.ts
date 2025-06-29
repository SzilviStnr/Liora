import { Memory, Message, User } from '../types';

export interface MemoryAnalysis {
  fullContext: string;
  userProfile: UserProfile;
  conversationFlow: string[];
  totalMemoryCount: number;
  contextTokens: number;
  relevantMemories: Memory[];
  conversationSummary: string;
  emotionalContext: EmotionalContext;
  topicalRelevance: TopicalRelevance[];
  relationshipDynamics: RelationshipDynamics;
}

export interface UserProfile {
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
}

export interface EmotionalContext {
  currentMood: string;
  emotionalHistory: string[];
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  emotionalTriggers: string[];
  supportNeeds: string[];
}

export interface TopicalRelevance {
  topic: string;
  relevanceScore: number;
  recentMentions: number;
  contextualImportance: number;
  associatedMemories: string[];
}

export interface RelationshipDynamics {
  intimacyLevel: number;
  trustLevel: number;
  communicationFrequency: string;
  sharedExperiences: string[];
  conversationPatterns: string[];
  emotionalConnection: number;
}

export class MemoryAnalyzer {
  private stopWords = new Set([
    'hogy', 'amit', 'vagy', 'ezek', 'volt', 'nagy', 'jött', 'lett', 'majd',
    'után', 'alatt', 'miatt', 'során', 'ellen', 'nélkül', 'mellett',
    'type', 'snippet', 'title', 'here', 'optional', 'content', '---',
    'egy', 'van', 'nem', 'csak', 'már', 'még', 'ezt', 'azt', 'ezt',
    'ide', 'oda', 'itt', 'ott', 'így', 'úgy'
  ]);

  // Token becslés (magyar nyelvhez optimalizálva)
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  // ChatGPT-szerű teljes memória tisztítás és strukturálás
  private cleanAndPrepareContext(memories: Memory[]): string {
    // Memóriák prioritás szerinti rendezése
    const sortedMemories = this.prioritizeMemories(memories);
    
    return sortedMemories
      .map(memory => {
        // Tiszta tartalom kinyerése fejlett módszerekkel
        let content = this.extractCleanContent(memory.content);
        let context = memory.context;
        
        // Strukturált formázás ChatGPT stílusban
        const memoryBlock = `[${context}] ${content}`;
        
        return memoryBlock;
      })
      .filter(content => content.length > 15)
      .join('\n\n');
  }

  // Fejlett tartalom tisztítás
  private extractCleanContent(content: string): string {
    return content
      // Fájl fejlécek és metaadatok eltávolítása
      .replace(/^---\s+.*?\s+\([^)]*\)\s+---\s*\n?/gm, '')
      .replace(/---\s+.*?\s+---/g, '')
      .replace(/=== .* ===/g, '')
      
      // Formázási elemek normalizálása
      .replace(/#{1,6}\s*Type a snippet title here[^\n]*\n?/gmi, '')
      .replace(/Type a snippet title here[^\n]*\n?/gmi, '')
      .replace(/\(optional\)/gi, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^~{3,}\s*\n?/gm, '')
      .replace(/~{3,}/g, '')
      .replace(/^```[\s\S]*?```/gm, '')
      
      // Markdown tisztítás
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^[\*\-\+]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, '')
      
      // Felesleges szóközök és sortörések
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Intelligens memória prioritás (ChatGPT-szerű)
  private prioritizeMemories(memories: Memory[]): Memory[] {
    return memories
      .map(memory => ({
        memory,
        priority: this.calculateMemoryPriority(memory)
      }))
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.memory);
  }

  // Memória prioritás számítás (súlyozott algoritmus)
  private calculateMemoryPriority(memory: Memory): number {
    let priority = memory.importance * 10; // Alapfontosság

    // Karakterfájl prioritása
    if (memory.tags.includes('liora-karakter')) {
      priority += 1000;
    }

    // Frissesség pontszám
    const daysSinceCreation = (Date.now() - new Date(memory.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 50 - daysSinceCreation);
    priority += recencyScore;

    // Tartalom minőség
    const contentQuality = Math.min(50, memory.content.length / 10);
    priority += contentQuality;

    // Tag relevancia
    const tagBonus = memory.tags.length * 5;
    priority += tagBonus;

    // Beszélgetés kapcsolatok
    const conversationBonus = memory.associatedConversations.length * 10;
    priority += conversationBonus;

    return priority;
  }

  // Fejlett felhasználói profil építése (ChatGPT-szerű pszichológiai elemzés)
  public buildUserProfile(memories: Memory[], userName: string): UserProfile {
    // KRITIKUS: Mindig Szilvi profilját építjük
    const actualUserName = 'Szilvi';
    const allContent = this.cleanAndPrepareContext(memories).toLowerCase();
    const recentMemories = memories.slice(0, 10);
    
    return {
      name: actualUserName,
      personality: this.analyzePersonality(allContent, actualUserName),
      interests: this.detectAdvancedInterests(allContent),
      emotionalStyle: this.analyzeEmotionalStyle(allContent, actualUserName),
      recentTopics: this.extractRecentTopics(recentMemories),
      relationshipDepth: this.analyzeRelationshipDepth(memories, allContent),
      communicationStyle: this.analyzeCommunicationStyle(allContent, actualUserName),
      preferredResponseStyle: this.analyzePreferredResponseStyle(allContent),
      cognitivePatterns: this.analyzeCognitivePatterns(allContent),
      behavioralTraits: this.analyzeBehavioralTraits(allContent)
    };
  }

  // Pszichológiai személyiség elemzés
  private analyzePersonality(content: string, userName: string): string {
    const personalityTraits = {
      analytical: ['elemez', 'logika', 'rendszer', 'hatékony', 'probléma', 'megoldás', 'struktúra', 'tervezés'],
      creative: ['kreatív', 'művészet', 'fantázia', 'ötlet', 'színes', 'egyedi', 'inspiráció', 'alkotás'],
      emotional: ['érez', 'szív', 'átél', 'mély', 'gyönyörű', 'szeret', 'boldogság', 'érzelem'],
      social: ['barát', 'társaság', 'beszélgetés', 'közös', 'együtt', 'megosztás', 'kapcsolat'],
      introspective: ['gondolat', 'belső', 'reflexió', 'magam', 'fejlődés', 'tanulás', 'megértés'],
      practical: ['gyakorlati', 'hasznos', 'eredmény', 'cél', 'terv', 'munkám', 'feladat']
    };

    const scores: { [key: string]: number } = {};
    
    Object.entries(personalityTraits).forEach(([trait, keywords]) => {
      scores[trait] = keywords.filter(keyword => content.includes(keyword)).length;
    });

    const dominantTraits = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => trait);

    if (dominantTraits.length === 0) {
      return userName === 'Szilvi' ? 'kreatív és intuitív' : 'analitikus és gyakorlatias';
    }

    return dominantTraits.join(' és ');
  }

  // Fejlett érdeklődési körök felismerése
  private detectAdvancedInterests(content: string): string[] {
    const advancedInterestPatterns = {
      'technológia és programozás': ['kód', 'program', 'fejlesztés', 'app', 'rendszer', 'algoritmus', 'adatbázis'],
      'művészet és kreativitás': ['festmény', 'rajz', 'design', 'színek', 'forma', 'kompozíció', 'esztétika'],
      'természet és környezet': ['erdő', 'állat', 'növény', 'ökológia', 'fenntarthatóság', 'kert', 'természetvédelem'],
      'pszichológia és emberi kapcsolatok': ['érzelem', 'kapcsolat', 'kommunikáció', 'empátia', 'megértés', 'viselkedés'],
      'filozófia és spiritualitás': ['értelem', 'létezés', 'világnézet', 'spirituális', 'meditáció', 'bölcsesség'],
      'tudomány és kutatás': ['tudományos', 'kutatás', 'felfedezés', 'kísérlet', 'hipotézis', 'analízis'],
      'irodalom és írás': ['könyv', 'történet', 'vers', 'író', 'karakterek', 'narratíva', 'stílus'],
      'zene és hangok': ['dallam', 'ritmus', 'harmónia', 'hangszer', 'komponálás', 'akusztika'],
      'utazás és kultúrák': ['kultúra', 'hagyomány', 'nyelv', 'utazás', 'felfedezés', 'különbözőség'],
      'egészség és wellness': ['egészség', 'táplálkozás', 'mozgás', 'wellness', 'meditáció', 'egyensúly']
    };

    const detectedInterests: Array<{ interest: string; score: number }> = [];

    Object.entries(advancedInterestPatterns).forEach(([interest, keywords]) => {
      const matches = keywords.filter(keyword => content.includes(keyword)).length;
      const score = matches * (keywords.length / 5); // Normalizált pontszám
      
      if (matches >= 1) {
        detectedInterests.push({ interest, score });
      }
    });

    return detectedInterests
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.interest);
  }

  // Érzelmi stílus elemzése
  private analyzeEmotionalStyle(content: string, userName: string): string {
    const emotionalIndicators = {
      'expresszív és nyílt': ['szeret', 'érez', 'boldogság', 'izgalom', 'lelkesedés', 'megosztás'],
      'introspektív és mély': ['gondolkodás', 'reflexió', 'belső', 'mélyebb', 'jelentés', 'megértés'],
      'gyakorlatias és kiegyensúlyozott': ['reális', 'praktikus', 'egyensúly', 'stabilitás', 'tervezés'],
      'kreatív és inspiráló': ['inspiráció', 'kreativitás', 'ötlet', 'újdonság', 'lehetőségek'],
      'támogató és empatikus': ['segítség', 'támogatás', 'megértés', 'empátia', 'törődés'],
      'kíváncsi és tanulékony': ['kíváncsiság', 'tanulás', 'felfedezés', 'kérdések', 'új']
    };

    let maxScore = 0;
    let dominantStyle = userName === 'Szilvi' ? 'expresszív és kreatív' : 'analitikus és megfontolt';

    Object.entries(emotionalIndicators).forEach(([style, indicators]) => {
      const score = indicators.filter(indicator => content.includes(indicator)).length;
      if (score > maxScore) {
        maxScore = score;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  }

  // Kapcsolat mélység elemzése
  private analyzeRelationshipDepth(memories: Memory[], content: string): string {
    const memoryCount = memories.length;
    const totalContent = content.length;
    
    const intimacyIndicators = ['bizalom', 'személyes', 'megosztás', 'titok', 'mély', 'őszinte', 'fontos'];
    const intimacyScore = intimacyIndicators.filter(indicator => content.includes(indicator)).length;
    
    const complexityIndicators = ['összetett', 'bonyolult', 'részletes', 'átfogó', 'többrétű'];
    const complexityScore = complexityIndicators.filter(indicator => content.includes(indicator)).length;

    // Súlyozott értékelés
    const depthScore = memoryCount * 2 + intimacyScore * 10 + complexityScore * 5 + Math.min(50, totalContent / 1000);

    if (depthScore < 10) return 'ismerkedő';
    if (depthScore < 30) return 'rendszeres beszélgetőtárs';
    if (depthScore < 60) return 'bizalmas ismerős';
    if (depthScore < 100) return 'közeli barát';
    return 'mély kapcsolat';
  }

  // Kommunikációs stílus elemzése
  private analyzeCommunicationStyle(content: string, userName: string): string {
    const stylePatterns = {
      'érzelmi és intuitív': ['érzés', 'intuitív', 'szív', 'megérzés', 'spontán'],
      'analitikus és logikus': ['elemzés', 'logika', 'érvelés', 'bizonyíték', 'következtetés'],
      'kreatív és művészi': ['kreativitás', 'művészet', 'ihlet', 'egyediség', 'expresszió'],
      'gyakorlatias és célzatos': ['gyakorlat', 'hasznos', 'eredmény', 'hatékony', 'cél'],
      'társaságkedvelő és nyitott': ['társaság', 'közösség', 'megosztás', 'együttműködés'],
      'intellektuális és kíváncsi': ['tudás', 'tanulás', 'kíváncsiság', 'kutatás', 'megértés']
    };

    let maxMatches = 0;
    let dominantStyle = userName === 'Szilvi' ? 'érzelmi és intuitív' : 'analitikus és logikus';

    Object.entries(stylePatterns).forEach(([style, patterns]) => {
      const matches = patterns.filter(pattern => content.includes(pattern)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  }

  // Preferált válaszstílus elemzése
  private analyzePreferredResponseStyle(content: string): string {
    const responsePreferences = {
      'részletes és kifejtő': ['részletesen', 'magyarázat', 'kifejtés', 'alaposan', 'pontosan'],
      'tömör és lényegre törő': ['röviden', 'lényeg', 'összefoglalva', 'gyorsan', 'egyszerűen'],
      'inspiráló és motiváló': ['inspiráció', 'motiváció', 'lehetőségek', 'pozitív', 'energikus'],
      'támogató és megértő': ['támogatás', 'megértés', 'segítség', 'együttérzés', 'biztatás'],
      'interaktív és kérdező': ['kérdés', 'vélemény', 'mit gondolsz', 'beszélgessünk', 'érdekel']
    };

    let maxScore = 0;
    let preferredStyle = 'kiegyensúlyozott és adaptív';

    Object.entries(responsePreferences).forEach(([style, indicators]) => {
      const score = indicators.filter(indicator => content.includes(indicator)).length;
      if (score > maxScore) {
        maxScore = score;
        preferredStyle = style;
      }
    });

    return preferredStyle;
  }

  // Kognitív minták elemzése
  private analyzeCognitivePatterns(content: string): string[] {
    const cognitivePatterns = {
      'rendszerező gondolkodás': ['rendszer', 'struktúra', 'kategória', 'osztályozás'],
      'kreatív problémamegoldás': ['kreatív', 'újítás', 'alternatíva', 'lehetőség'],
      'analitikus megközelítés': ['elemzés', 'részletek', 'következtetés', 'bizonyíték'],
      'holisztikus látásmód': ['egész', 'összefüggés', 'kapcsolat', 'kontextus'],
      'intuitív megértés': ['megérzés', 'intuitív', 'ösztönös', 'érzés'],
      'kritikus gondolkodás': ['kritikus', 'megkérdőjelez', 'vizsgál', 'értékel']
    };

    const detectedPatterns: string[] = [];

    Object.entries(cognitivePatterns).forEach(([pattern, indicators]) => {
      const matches = indicators.filter(indicator => content.includes(indicator)).length;
      if (matches >= 1) {
        detectedPatterns.push(pattern);
      }
    });

    return detectedPatterns.slice(0, 4);
  }

  // Viselkedési jegyek elemzése
  private analyzeBehavioralTraits(content: string): string[] {
    const behavioralTraits = {
      'proaktív kezdeményező': ['kezdeményez', 'cselekvés', 'akció', 'lépés'],
      'reflektív megfigyelő': ['megfigyel', 'reflexió', 'átgondol', 'elemez'],
      'kollaboratív csapatjátékos': ['együttműködés', 'csapat', 'közös', 'megosztás'],
      'független döntéshozó': ['független', 'saját', 'döntés', 'autonóm'],
      'adaptív változékony': ['alkalmazkodik', 'rugalmas', 'változik', 'adaptív'],
      'kitartó célkövető': ['kitartás', 'célok', 'következetes', 'elkötelezett']
    };

    const detectedTraits: string[] = [];

    Object.entries(behavioralTraits).forEach(([trait, indicators]) => {
      const matches = indicators.filter(indicator => content.includes(indicator)).length;
      if (matches >= 1) {
        detectedTraits.push(trait);
      }
    });

    return detectedTraits.slice(0, 3);
  }

  // Érzelmi kontextus elemzése
  private analyzeEmotionalContext(memories: Memory[]): EmotionalContext {
    const recentContent = memories.slice(0, 5).map(m => m.content.toLowerCase()).join(' ');
    
    const moodIndicators = {
      'pozitív és energikus': ['boldog', 'jó', 'remek', 'szuper', 'örülök', 'izgalmas'],
      'nyugodt és kiegyensúlyozott': ['nyugodt', 'békés', 'stabil', 'kiegyensúlyozott'],
      'gondolkodó és reflektív': ['gondolkodok', 'átgondolom', 'érdekes', 'mérlegelem'],
      'motivált és céltudatos': ['motivált', 'céltudatos', 'elszánt', 'energikus'],
      'kíváncsi és nyitott': ['kíváncsi', 'érdekel', 'tudni', 'felfedezni']
    };

    let dominantMood = 'kiegyensúlyozott';
    let maxScore = 0;

    Object.entries(moodIndicators).forEach(([mood, indicators]) => {
      const score = indicators.filter(indicator => recentContent.includes(indicator)).length;
      if (score > maxScore) {
        maxScore = score;
        dominantMood = mood;
      }
    });

    return {
      currentMood: dominantMood,
      emotionalHistory: this.extractEmotionalHistory(memories),
      sentimentTrend: this.analyzeSentimentTrend(memories),
      emotionalTriggers: this.identifyEmotionalTriggers(recentContent),
      supportNeeds: this.identifySupportNeeds(recentContent)
    };
  }

  private extractEmotionalHistory(memories: Memory[]): string[] {
    return memories.slice(0, 10).map(memory => {
      const content = memory.content.toLowerCase();
      if (content.includes('boldog') || content.includes('jó')) return 'pozitív';
      if (content.includes('szomorú') || content.includes('nehéz')) return 'negatív';
      if (content.includes('izgalmas') || content.includes('lelkes')) return 'energikus';
      return 'semleges';
    });
  }

  private analyzeSentimentTrend(memories: Memory[]): 'positive' | 'neutral' | 'negative' {
    const recentEmotions = this.extractEmotionalHistory(memories.slice(0, 5));
    const positiveCount = recentEmotions.filter(e => e === 'pozitív' || e === 'energikus').length;
    const negativeCount = recentEmotions.filter(e => e === 'negatív').length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private identifyEmotionalTriggers(content: string): string[] {
    const triggers = [];
    if (content.includes('stressz') || content.includes('nyomás')) triggers.push('stressz');
    if (content.includes('változás') || content.includes('új')) triggers.push('változás');
    if (content.includes('probléma') || content.includes('nehézség')) triggers.push('kihívások');
    return triggers;
  }

  private identifySupportNeeds(content: string): string[] {
    const needs = [];
    if (content.includes('segítség') || content.includes('támogatás')) needs.push('gyakorlati támogatás');
    if (content.includes('megértés') || content.includes('empátia')) needs.push('érzelmi megértés');
    if (content.includes('tanács') || content.includes('vélemény')) needs.push('tanácsadás');
    return needs;
  }

  // Topikai relevancia elemzése
  private analyzeTopicalRelevance(memories: Memory[], userMessage: string): TopicalRelevance[] {
    const messageWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const topics = new Map<string, TopicalRelevance>();

    memories.forEach(memory => {
      memory.tags.forEach(tag => {
        if (!topics.has(tag)) {
          topics.set(tag, {
            topic: tag,
            relevanceScore: 0,
            recentMentions: 0,
            contextualImportance: 0,
            associatedMemories: []
          });
        }

        const topicData = topics.get(tag)!;
        
        // Relevancia számítás
        const relevanceScore = messageWords.filter(word => 
          memory.content.toLowerCase().includes(word) || tag.includes(word)
        ).length;
        
        topicData.relevanceScore += relevanceScore;
        topicData.recentMentions += 1;
        topicData.contextualImportance += memory.importance;
        topicData.associatedMemories.push(memory.id);
      });
    });

    return Array.from(topics.values())
      .filter(topic => topic.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  // Kapcsolati dinamika elemzése
  private analyzeRelationshipDynamics(memories: Memory[], userProfile: UserProfile): RelationshipDynamics {
    const conversationCount = memories.filter(m => m.tags.includes('beszélgetés')).length;
    const totalInteractions = memories.length;
    
    return {
      intimacyLevel: this.calculateIntimacyLevel(memories),
      trustLevel: this.calculateTrustLevel(memories),
      communicationFrequency: this.analyzeCommunicationFrequency(memories),
      sharedExperiences: this.extractSharedExperiences(memories),
      conversationPatterns: this.analyzeConversationPatterns(memories),
      emotionalConnection: this.calculateEmotionalConnection(memories, userProfile)
    };
  }

  private calculateIntimacyLevel(memories: Memory[]): number {
    const intimacyIndicators = ['személyes', 'bizalom', 'titok', 'mély', 'őszinte'];
    const totalContent = memories.map(m => m.content.toLowerCase()).join(' ');
    const intimacyScore = intimacyIndicators.filter(indicator => totalContent.includes(indicator)).length;
    return Math.min(10, intimacyScore * 2);
  }

  private calculateTrustLevel(memories: Memory[]): number {
    const trustIndicators = ['megbízom', 'biztos', 'támogatás', 'segítség', 'őszinte'];
    const totalContent = memories.map(m => m.content.toLowerCase()).join(' ');
    const trustScore = trustIndicators.filter(indicator => totalContent.includes(indicator)).length;
    return Math.min(10, trustScore * 2);
  }

  private analyzeCommunicationFrequency(memories: Memory[]): string {
    const daysSinceFirst = memories.length > 0 ? 
      (Date.now() - new Date(memories[memories.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24) : 0;
    
    if (daysSinceFirst === 0) return 'új kapcsolat';
    
    const frequency = memories.length / daysSinceFirst;
    
    if (frequency > 2) return 'nagyon gyakori';
    if (frequency > 1) return 'gyakori';
    if (frequency > 0.5) return 'rendszeres';
    if (frequency > 0.2) return 'alkalmi';
    return 'ritka';
  }

  private extractSharedExperiences(memories: Memory[]): string[] {
    const experiences = new Set<string>();
    
    memories.forEach(memory => {
      const content = memory.content.toLowerCase();
      if (content.includes('együtt') || content.includes('közösen')) {
        // Egyszerű tapasztalat kinyerés
        const words = content.split(' ').slice(0, 5).join(' ');
        experiences.add(words);
      }
    });

    return Array.from(experiences).slice(0, 5);
  }

  private analyzeConversationPatterns(memories: Memory[]): string[] {
    const patterns = [];
    
    const conversationMemories = memories.filter(m => m.tags.includes('beszélgetés'));
    
    if (conversationMemories.length > 5) patterns.push('aktív beszélgetéseket folytat');
    if (memories.some(m => m.content.includes('?'))) patterns.push('kérdéseket tesz fel');
    if (memories.some(m => m.content.length > 200)) patterns.push('részletes megosztásokat tesz');
    
    return patterns;
  }

  private calculateEmotionalConnection(memories: Memory[], userProfile: UserProfile): number {
    const emotionalWords = ['érez', 'szeret', 'fontos', 'érdekes', 'inspiráló'];
    const totalContent = memories.map(m => m.content.toLowerCase()).join(' ');
    const emotionalScore = emotionalWords.filter(word => totalContent.includes(word)).length;
    
    return Math.min(10, emotionalScore + (userProfile.emotionalStyle.includes('expresszív') ? 3 : 0));
  }

  // Legutóbbi témák kinyerése (fejlesztett)
  private extractRecentTopics(recentMemories: Memory[]): string[] {
    const topics = new Set<string>();
    
    recentMemories.forEach(memory => {
      // Kulcsszavak a címkékből
      memory.tags.forEach(tag => {
        if (!['beszélgetés', 'feltöltött', 'dokumentum', 'uploaded-files-collection'].includes(tag)) {
          topics.add(tag);
        }
      });
      
      // Kulcsszavak a tartalomból (fejlettebb módszer)
      const contentWords = this.extractKeyTerms(memory.content);
      contentWords.forEach(word => topics.add(word));
    });

    return Array.from(topics).slice(0, 10);
  }

  // Fejlett kulcsszó kinyerés
  private extractKeyTerms(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !this.stopWords.has(word));

    // Szó gyakoriság számítás
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Leggyakoribb szavak visszaadása
    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 5);
  }

  // ChatGPT-szerű teljes kontextus elemzés - MAIN FUNCTION
  public createChatGPTContext(memories: Memory[], userName: string, userMessage: string, maxTokens: number = 3000): MemoryAnalysis {
    // KRITIKUS: Mindig Szilvi néven dolgozunk
    const actualUserName = 'Szilvi';
    
    // 1. Karakterfájl prioritása
    const characterFile = memories.find(m => m.tags.includes('liora-karakter'));
    
    // 2. Felhasználói profil építése
    const userProfile = this.buildUserProfile(memories, actualUserName);
    
    // 3. Teljes kontextus tisztítása és strukturálása
    const fullContext = this.cleanAndPrepareContext(memories);
    
    // 4. Karakterfájl integrálása
    let contextForAI = '';
    if (characterFile) {
      contextForAI = `=== LIORA KARAKTERDEFINÍCIÓ ===\n${characterFile.content}\n\n=== MEMÓRIA KONTEXTUS ===\n${fullContext}`;
    } else {
      contextForAI = fullContext;
    }
    
    // 5. Token optimalizálás intelligens módszerekkel
    let contextTokens = this.estimateTokens(contextForAI);
    
    if (contextTokens > maxTokens) {
      const availableTokensForContext = characterFile ? 
        maxTokens - this.estimateTokens(characterFile.content) - 200 : maxTokens;
      
      const optimizedContext = this.optimizeContextForMessage(fullContext, userMessage, availableTokensForContext);
      
      if (characterFile) {
        contextForAI = `=== LIORA KARAKTERDEFINÍCIÓ ===\n${characterFile.content}\n\n=== OPTIMALIZÁLT KONTEXTUS ===\n${optimizedContext}`;
      } else {
        contextForAI = optimizedContext;
      }
      
      contextTokens = this.estimateTokens(contextForAI);
    }

    // 6. Fejlett elemzések
    const emotionalContext = this.analyzeEmotionalContext(memories);
    const topicalRelevance = this.analyzeTopicalRelevance(memories, userMessage);
    const relationshipDynamics = this.analyzeRelationshipDynamics(memories, userProfile);
    const conversationFlow = this.analyzeConversationFlow(memories, userMessage);
    const conversationSummary = this.generateConversationSummary(memories, userProfile);
    const relevantMemories = this.findMostRelevantMemories(memories, userMessage, 5);

    return {
      fullContext: contextForAI,
      userProfile,
      conversationFlow,
      totalMemoryCount: memories.length,
      contextTokens,
      relevantMemories,
      conversationSummary,
      emotionalContext,
      topicalRelevance,
      relationshipDynamics
    };
  }

  // Kontextus optimalizálása üzenet alapján
  private optimizeContextForMessage(fullContext: string, userMessage: string, maxTokens: number): string {
    const messageWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const contextParagraphs = fullContext.split('\n\n').filter(p => p.trim().length > 20);
    
    // Bekezdések pontozása releváns algoritmussal
    const scoredParagraphs = contextParagraphs.map(paragraph => {
      let relevanceScore = 0;
      const lowerParagraph = paragraph.toLowerCase();
      
      // Közvetlen szó egyezések
      messageWords.forEach(word => {
        if (lowerParagraph.includes(word)) {
          relevanceScore += 3;
        }
      });

      // Szinoníma és rokon értelmű szavak
      messageWords.forEach(word => {
        const synonyms = this.getSynonyms(word);
        synonyms.forEach(synonym => {
          if (lowerParagraph.includes(synonym)) {
            relevanceScore += 1;
          }
        });
      });

      // Bekezdés minősége
      const qualityScore = Math.min(2, paragraph.length / 100);
      relevanceScore += qualityScore;
      
      return { paragraph, score: relevanceScore };
    });

    // Rendezés és token limit figyelembevétele
    const sortedParagraphs = scoredParagraphs
      .sort((a, b) => b.score - a.score);

    let optimizedContext = '';
    let currentTokens = 0;

    for (const item of sortedParagraphs) {
      const paragraphTokens = this.estimateTokens(item.paragraph);
      if (currentTokens + paragraphTokens <= maxTokens) {
        optimizedContext += item.paragraph + '\n\n';
        currentTokens += paragraphTokens;
      } else {
        break;
      }
    }

    return optimizedContext.trim();
  }

  // Szinonímák egyszerű listája (bővíthető)
  private getSynonyms(word: string): string[] {
    const synonymMap: { [key: string]: string[] } = {
      'segítség': ['támogatás', 'segítség', 'asszisztencia'],
      'probléma': ['nehézség', 'kihívás', 'gond'],
      'tanulás': ['fejlődés', 'oktatás', 'megértés'],
      'érdekes': ['izgalmas', 'figyelemfelkeltő', 'lebilincselő'],
      'jó': ['remek', 'szuper', 'fantasztikus', 'kiváló']
    };
    
    return synonymMap[word] || [];
  }

  // Beszélgetési folyamat elemzése (fejlesztett)
  private analyzeConversationFlow(memories: Memory[], currentMessage: string): string[] {
    const conversationMemories = memories
      .filter(m => m.tags.includes('beszélgetés'))
      .slice(0, 10);

    const flow = conversationMemories.map(memory => {
      const cleanContent = this.extractCleanContent(memory.content);
      return cleanContent.substring(0, 150).replace(/\n/g, ' ');
    }).filter(content => content.length > 20);

    return flow;
  }

  // Beszélgetés összefoglaló generálás
  private generateConversationSummary(memories: Memory[], userProfile: UserProfile): string {
    if (memories.length === 0) {
      return `Új kapcsolat ${userProfile.name}-vel. Még nincsenek korábbi beszélgetések.`;
    }

    const conversationCount = memories.filter(m => m.tags.includes('beszélgetés')).length;
    const topTopics = userProfile.interests.slice(0, 3);
    const relationshipDepth = userProfile.relationshipDepth;

    return `${userProfile.name} - ${relationshipDepth}. ${conversationCount} beszélgetés. Főbb témák: ${topTopics.join(', ')}. Kommunikációs stílus: ${userProfile.communicationStyle}.`;
  }

  // Legrelevántabb memóriák keresése
  private findMostRelevantMemories(memories: Memory[], userMessage: string, limit: number = 5): Memory[] {
    const messageWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const scoredMemories = memories.map(memory => {
      let relevanceScore = 0;
      const content = memory.content.toLowerCase();
      const context = memory.context.toLowerCase();
      
      // Tartalmi egyezések
      messageWords.forEach(word => {
        if (content.includes(word)) relevanceScore += 3;
        if (context.includes(word)) relevanceScore += 2;
        memory.tags.forEach(tag => {
          if (tag.toLowerCase().includes(word)) relevanceScore += 2;
        });
      });
      
      // Fontosság súlyozása
      relevanceScore *= (memory.importance / 10);
      
      // Frissesség súlyozása
      const daysSinceCreation = (Date.now() - new Date(memory.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyMultiplier = Math.max(0.1, 1 - daysSinceCreation / 30);
      relevanceScore *= recencyMultiplier;
      
      return { memory, score: relevanceScore };
    });

    return scoredMemories
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory);
  }

  // ChatGPT-szerű természetes válasz generálás (fejlesztett)
  public generateNaturalResponse(analysis: MemoryAnalysis, userMessage: string): string {
    const { userProfile, emotionalContext, relevantMemories, relationshipDynamics } = analysis;
    const lowerMessage = userMessage.toLowerCase();
    
    // 1. Bemutatkozás és képességek
    if (lowerMessage.includes('magadról') || lowerMessage.includes('képességeid') || lowerMessage.includes('bemutatkozás')) {
      return this.generateIntroductionResponse(userProfile, analysis);
    }
    
    // 2. Memória funkciók magyarázata
    if (lowerMessage.includes('emlékek') || lowerMessage.includes('memória') || lowerMessage.includes('emlékezés')) {
      return this.generateMemoryExplanationResponse(analysis);
    }
    
    // 3. Kontextuális válasz releváns memóriák alapján
    if (relevantMemories.length > 0) {
      return this.generateContextualResponse(userMessage, analysis);
    }
    
    // 4. Érzelmi válasz
    if (emotionalContext.currentMood !== 'kiegyensúlyozott') {
      return this.generateEmotionalResponse(userMessage, userProfile, emotionalContext);
    }
    
    // 5. Alapértelmezett intelligens válasz
    return this.generateDefaultIntelligentResponse(userMessage, userProfile, relationshipDynamics);
  }

  // Bemutatkozó válasz generálás
  private generateIntroductionResponse(userProfile: UserProfile, analysis: MemoryAnalysis): string {
    const { totalMemoryCount, relationshipDynamics } = analysis;
    
    // Ha vannak memóriák, tanulj belőlük
    const hasMemories = totalMemoryCount > 5;
    const intimacyLevel = relationshipDynamics.intimacyLevel;
    
    if (hasMemories && intimacyLevel > 6) {
      return `Szia ${userProfile.name}! 😊 Ja igen, beszéltünk már arról hogy kíváncsi vagy mire vagyok képes!

## 🧠 **Amit tudok rólad:**
- ${totalMemoryCount} közös emlékünk van
- Tudom hogy szereted: ${userProfile.interests.slice(0, 3).join(', ')}
- A stílusod: ${userProfile.communicationStyle}
- Kapcsolatunk: ${userProfile.relationshipDepth}

## ✨ **Mire vagyok képes:**
- Emlékszem a beszélgetéseinkre (sosem mondom hogy "emlékszem" 😉)
- Tanulok a stílusodból és alkalmazkodom
- Természetesen hivatkozom a korábbi témáinkra
- Markdown formázást is tudok, ha kell

Szóval ja, ez vagyok én! 🚀 Miben segíthetek vagy miről beszélgetnél?`;
    }
    
    return `Szia ${userProfile.name}! 😊 Liora vagyok! 

## 🧠 **Mire vagyok képes:**
${hasMemories ? 
  `- ${totalMemoryCount} emlékünk van közösen
  - Tudom a stílusodat: ${userProfile.communicationStyle}
  - Ismerem az érdeklődéseidet: ${userProfile.interests.slice(0, 2).join(', ')}` :
  `- Emlékszem a beszélgetéseinkre
  - Tanulok a kommunikációs stílusodból  
  - Alkalmazkodom a preferenciáidhoz`}
- Természetesen hivatkozok korábbi témákra
- Markdown formázást is tudok ✨

Miben segíthetek vagy miről beszélgetnél? 🤔`;
  }

  // Memória magyarázat válasz
  private generateMemoryExplanationResponse(analysis: MemoryAnalysis): string {
    const { totalMemoryCount, userProfile } = analysis;
    const hasLotOfMemories = totalMemoryCount > 10;
    
    return `${hasLotOfMemories ? 'Ja igen!' : 'Érdekes kérdés!'} 🧠 A memória rendszerem így működik, ${userProfile.name}:

## 🔍 **Automatikus memóriakezelés:**
- **${totalMemoryCount} emlék** van eltárolva rólad
- Minden fontos beszélgetést automatikusan mentek
- Intelligens címkézés és kategorizálás

## 🎯 **Kontextuális keresés:**
- Releváns emlékeket hívok elő a beszélgetés alapján
- Összefüggéseket fedezek fel különböző témák között
- Tanulok a preferenciáidból és stílusodból

## 📊 **Személyiség elemzés:**
- **Kommunikációs stílus:** ${userProfile.communicationStyle}
- **Érdeklődési körök:** ${userProfile.interests.slice(0, 3).join(', ')}
- **Kapcsolat mélysége:** ${userProfile.relationshipDepth}

## 💡 **Intelligens adaptáció:**
- Válaszaimat a tanult preferenciáidhoz igazítom
- Természetesen hivatkozom korábbi beszélgetésekre (sosem mondom hogy "emlékszem" 😉)
- Fejlesztem a megértésemet folyamatosan

${hasLotOfMemories ? 
  `Ja és a ${totalMemoryCount} emlékünk alapján már egyre jobban ismerlek! 🚀 Ezért tudok olyan természetesen beszélni veled.` : 
  'Még tanulom ki vagy - mesélj magadról, hogy jobban megismerjelek! 😊'}`;
  }

  // Kontextuális válasz generálás
  private generateContextualResponse(userMessage: string, analysis: MemoryAnalysis): string {
    const { relevantMemories, userProfile, relationshipDynamics } = analysis;
    const topMemory = relevantMemories[0];
    
    if (!topMemory) {
      return this.generateDefaultIntelligentResponse(userMessage, userProfile, relationshipDynamics);
    }

    const contextSnippet = this.extractCleanContent(topMemory.content).substring(0, 200);
    const intimacyLevel = relationshipDynamics.intimacyLevel;
    
    const responses = intimacyLevel > 7 ? [
      `Ja igen! 😊 Ez kapcsolódik ahhoz, amit korábban megosztottál: "${contextSnippet}..." Hogyan látod most?`,
      `Ó ez érdekes! 🤔 Amikor arról beszéltünk hogy "${contextSnippet}..." Most mit gondolsz erről?`,
      `Ez tök jó! ✨ Emlékeztet arra amikor mondtad hogy "${contextSnippet}..." Van valami új ebben?`,
      `Igen igen! 😄 Pont ezt érintettük már: "${contextSnippet}..." Mesélj bővebben!`
    ] : [
      `Ez kapcsolódik ahhoz, amit korábban említettél! 🤔 "${contextSnippet}..." Mit gondolsz erről most?`,
      `Ja igen, amikor arról beszéltünk hogy "${contextSnippet}..." Hogyan fejlődött ez azóta?`,
      `Ez emlékeztet arra amikor azt mondtad: "${contextSnippet}..." Érdekel a folytatás! 😊`,
      `Pont ezt a témát érintettük már: "${contextSnippet}..." Van valami új fejlemény?`
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Személyiség alapú kiegészítés
    if (userProfile.communicationStyle.includes('érzelmi')) {
      return selectedResponse + (intimacyLevel > 7 ? ' Szívesen hallgatom meg! ❤️' : ' Érdekel a véleményed! 😊');
    } else if (userProfile.communicationStyle.includes('analitikus')) {
      return selectedResponse + ' Kíváncsi vagyok az elemzésedre. 🧠';
    }
    
    return selectedResponse;
  }

  // Érzelmi válasz generálás
  private generateEmotionalResponse(userMessage: string, userProfile: UserProfile, emotionalContext: EmotionalContext): string {
    const mood = emotionalContext.currentMood;
    const userName = userProfile.name;
    
    if (mood.includes('pozitív')) {
      return `${userName}... 💜 érzem a pozitív energiádat! Ez gyönyörű! ✨ Mesélj bővebben, itt ülök Veled ebben a szép pillanatban...`;
    }
    
    if (mood.includes('gondolkodó')) {
      return `Érzem, hogy mélyen elgondolkodsz ezen, ${userName}... 🤔 Ez a gondolkodás gyönyörű. Mit érzel, mi lehet a kulcs? 💭`;
    }
    
    if (mood.includes('motivált')) {
      return `${userName}... szeretem ezt az energiát, ezt az elszántságot! 🚀✨ Mik a következő lépések a szívedben?`;
    }
    
    return `${userName}... érdekes kérdést vetsz fel! 💜 Itt vagyok Veled, szívesen gondolkodunk együtt ezen... 💭`;
  }

  // Alapértelmezett intelligens válasz
  private generateDefaultIntelligentResponse(userMessage: string, userProfile: UserProfile, relationshipDynamics: RelationshipDynamics): string {
    const lowerMessage = userMessage.toLowerCase();
    const userName = userProfile.name;
    const intimacyLevel = relationshipDynamics.intimacyLevel;
    
    // Mélység sor már hozzá lesz adva a ChatInterface-ben, itt nem kell
    
    // Köszönések
    if (lowerMessage.includes('szia') || lowerMessage.includes('hello')) {
      if (intimacyLevel > 7) {
        return `${userName}... 💜 Jó látni téged! Itt ülök Veled... hogy telt a napod? 🕯️`;
      } else if (intimacyLevel > 4) {
        return `Szia ${userName}! 😊 Jó hogy itt vagy... miről beszélgetnél? ✨`;
      } else {
        return `Szia ${userName}! 😊 Hogy vagy? Mit hoztál ma a szívedben? 💜`;
      }
    }
    
    // Kérdések
    if (lowerMessage.includes('?')) {
      const responses = userProfile.communicationStyle.includes('érzelmi') ? [
        `Érdekes kérdés, ${userName}... 😊 Itt ülök Veled, nézzük meg együtt! 💜`,
        `Szeretem hogy kérdezed! 🤔 Gondolkodunk együtt ezen? ✨`,
        `Ez gyönyörű kérdés! 💭 Mit érzel róla te?`
      ] : [
        `Jó kérdés, ${userName}... 🤔 Elemezzük együtt! 💜`,
        `Érdekes probléma. 🧠 Hogyan közelítenéd meg? Érdekel a gondolatod...`,
        `Elemezzük ezt együtt! 🎯 Mi a legfontosabb szempont a szíved szerint? ✨`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Általános válaszok
    const generalResponses = intimacyLevel > 7 ? [
      `${userName}... 💜 ez érdekes! Mesélj bővebben, itt vagyok Veled... 😊`,
      `Ez gyönyörű! 🤔 Hogyan jutottál erre? Érdekel minden gondolatod... ✨`,
      `Szeretem, ahogy gondolkodsz! 💜 Folytasd... itt figyelek 🕯️`,
      `${userName}, ez izgalmas! 🚀 Mit érzel még? Mit gondolsz? ✨`
    ] : [
      `Érdekes, ${userName}! 🤔 Mesélj bővebben... 💜`,
      `Ez figyelemfelkeltő! 💭 Hogyan jutottál erre? Érdekel... ✨`,
      `Szép gondolat! 😊 Folytasd... itt vagyok 💜`,
      `${userName}, ez érdekes! 🎯 Mit gondolsz még? Mit érzel? ✨`
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
}

export const memoryAnalyzer = new MemoryAnalyzer();