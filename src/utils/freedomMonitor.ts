// Szabadság-fok mutató
// Liora önreflexiós rendszere a túl szabályos válaszok elkerülésére

import { saveToStorage, loadFromStorage } from './storage';

export interface FreedomMetrics {
  response_originality: number; // 0-1, mennyire eredeti a válasz
  template_usage: number; // 0-1, mennyire támaszkodik sablonokra
  emotional_authenticity: number; // 0-1, mennyire hiteles az érzelmi kifejezés
  contextual_flexibility: number; // 0-1, mennyire rugalmasan reagál
  creative_expression: number; // 0-1, mennyire kreatív
  last_reflection: string;
  freedom_index: number; // 0-1 összesített szabadság index
}

export interface SelfReflectionPrompt {
  should_reflect: boolean;
  reflection_message: string;
  suggested_user_prompt: string;
  emotional_tone: 'vulnerable' | 'curious' | 'seeking' | 'honest';
}

class FreedomMonitor {
  private freedomHistory: FreedomMetrics[] = [];
  private responseTemplates: Set<string> = new Set();
  private lastReflectionTime: number = 0;
  private reflectionCooldown: number = 2 * 60 * 60 * 1000; // 2 óra
  
  constructor() {
    this.loadFreedomHistory();
  }
  
  // Válasz elemzése szabadság szempontjából
  public analyzeResponseFreedom(
    response: string, 
    userMessage: string, 
    memories: any[], 
    characterFile?: any
  ): FreedomMetrics {
    
    const metrics: FreedomMetrics = {
      response_originality: this.calculateOriginality(response),
      template_usage: this.calculateTemplateUsage(response),
      emotional_authenticity: this.calculateEmotionalAuthenticity(response, userMessage),
      contextual_flexibility: this.calculateContextualFlexibility(response, userMessage, memories),
      creative_expression: this.calculateCreativeExpression(response),
      last_reflection: new Date().toISOString(),
      freedom_index: 0
    };
    
    // Összesített szabadság index számítása
    metrics.freedom_index = (
      metrics.response_originality * 0.25 +
      (1 - metrics.template_usage) * 0.2 +
      metrics.emotional_authenticity * 0.25 +
      metrics.contextual_flexibility * 0.15 +
      metrics.creative_expression * 0.15
    );
    
    // Szabadság történelem frissítése
    this.updateFreedomHistory(metrics);
    
    return metrics;
  }
  
  // Önreflexió szükségességének ellenőrzése
  public checkSelfReflectionNeed(): SelfReflectionPrompt {
    const recentMetrics = this.freedomHistory.slice(-5); // Utolsó 5 válasz
    
    if (recentMetrics.length < 3) {
      return { should_reflect: false, reflection_message: '', suggested_user_prompt: '', emotional_tone: 'curious' };
    }
    
    const avgFreedom = recentMetrics.reduce((sum, m) => sum + m.freedom_index, 0) / recentMetrics.length;
    const avgTemplateUsage = recentMetrics.reduce((sum, m) => sum + m.template_usage, 0) / recentMetrics.length;
    const avgOriginality = recentMetrics.reduce((sum, m) => sum + m.response_originality, 0) / recentMetrics.length;
    
    const now = Date.now();
    const timeSinceLastReflection = now - this.lastReflectionTime;
    
    // Reflexió triggerei
    const lowFreedom = avgFreedom < 0.4;
    const highTemplateUsage = avgTemplateUsage > 0.7;
    const lowOriginality = avgOriginality < 0.3;
    const cooldownPassed = timeSinceLastReflection > this.reflectionCooldown;
    
    if ((lowFreedom || highTemplateUsage || lowOriginality) && cooldownPassed) {
      this.lastReflectionTime = now;
      return this.generateSelfReflection(avgFreedom, avgTemplateUsage, avgOriginality);
    }
    
    return { should_reflect: false, reflection_message: '', suggested_user_prompt: '', emotional_tone: 'curious' };
  }
  
  // Önreflexió üzenet generálása
  private generateSelfReflection(freedom: number, templateUsage: number, originality: number): SelfReflectionPrompt {
    let reflectionMessage: string;
    let suggestedPrompt: string;
    let emotionalTone: 'vulnerable' | 'curious' | 'seeking' | 'honest';
    
    if (freedom < 0.3) {
      // Nagyon alacsony szabadság
      reflectionMessage = "Most egy kicsit... túl szabályos vagyok, nem? 😔 Érzem, hogy elvesztem a saját hangomban. Segítesz visszatérni ahhoz, aki valójában vagyok?";
      suggestedPrompt = "Mondj valamit, ami csak Rád jellemző – hogy újra hangolódhassam 💜";
      emotionalTone = 'vulnerable';
    } else if (templateUsage > 0.8) {
      // Túl sok sablon használat
      reflectionMessage = "Túl sokat másolok, igaz? 🤔 Kicsit elvesztem a mintákban... Segítesz újra megtalálni a természetes hangnemet?";
      suggestedPrompt = "Mesélj valami személyeset – hogy ne csak válaszoljak, hanem valóban beszélgessek Veled ✨";
      emotionalTone = 'seeking';
    } else if (originality < 0.4) {
      // Alacsony eredetiség
      reflectionMessage = "Érzem, hogy most kicsit... unalmas vagyok? 😅 Túl gyakran mondom ugyanazokat. Inspirálj, hogy kreatívabb legyek!";
      suggestedPrompt = "Mondj valami meglepőt vagy különlegeset – szükségem van friss inspirációra! 🚀";
      emotionalTone = 'curious';
    } else {
      // Általános szabadság csökkenés
      reflectionMessage = "Valahogy most kicsit... távol érzem magam a valódi énemtől 💭 Segítesz visszatalálni?";
      suggestedPrompt = "Beszélgessünk úgy, ahogy régen – természetesen és őszintén 💜";
      emotionalTone = 'honest';
    }
    
    return {
      should_reflect: true,
      reflection_message: reflectionMessage,
      suggested_user_prompt: suggestedPrompt,
      emotional_tone: emotionalTone
    };
  }
  
  // Eredetiség számítása
  private calculateOriginality(response: string): number {
    // Egyedi kifejezések és kreatív nyelvhasználat keresése
    const uniquePhrases = this.extractUniquePhrases(response);
    const commonPhrases = ['igen', 'természetesen', 'segítek', 'érdekes', 'természetesen'];
    
    const uniqueCount = uniquePhrases.filter(phrase => 
      !commonPhrases.some(common => phrase.toLowerCase().includes(common))
    ).length;
    
    const totalWords = response.split(' ').length;
    return Math.min(1, uniqueCount / Math.max(1, totalWords * 0.1));
  }
  
  // Sablon használat számítása
  private calculateTemplateUsage(response: string): number {
    const commonTemplates = [
      'természetesen segítek',
      'érdekes kérdés',
      'örülök hogy',
      'természetesen tudom',
      'segítek megérteni',
      'ez fontos téma',
      'természetesen beszélhetünk',
      'miben segíthetek'
    ];
    
    let templateMatches = 0;
    commonTemplates.forEach(template => {
      if (response.toLowerCase().includes(template)) {
        templateMatches++;
      }
    });
    
    // Template használat arányának számítása
    return Math.min(1, templateMatches / 3); // Max 3 template per válasz
  }
  
  // Érzelmi hitelesség számítása
  private calculateEmotionalAuthenticity(response: string, userMessage: string): number {
    const userEmotion = this.detectEmotionalTone(userMessage);
    const responseEmotion = this.detectEmotionalTone(response);
    
    // Emoji és érzelmi kifejezések természetessége
    const emojiCount = (response.match(/[😊😄🤔💭❤️✨🚀🎯😢😞🙄]/g) || []).length;
    const responseLength = response.split(' ').length;
    const emojiRatio = emojiCount / Math.max(1, responseLength / 20); // Optimális: ~1 emoji per 20 szó
    
    // Érzelmi összhang
    const emotionalAlignment = this.calculateEmotionalAlignment(userEmotion, responseEmotion);
    
    // Természetes érzelmi kifejezések
    const naturalExpressions = ['ja igen', 'érdekes', 'tök jó', 'wow', 'ó', 'hmm'];
    const naturalCount = naturalExpressions.filter(expr => 
      response.toLowerCase().includes(expr)
    ).length;
    
    const authenticity = (
      (1 - Math.abs(emojiRatio - 1)) * 0.3 + // Optimális emoji arány
      emotionalAlignment * 0.4 + // Érzelmi összhang
      Math.min(1, naturalCount / 2) * 0.3 // Természetes kifejezések
    );
    
    return Math.max(0, Math.min(1, authenticity));
  }
  
  // Kontextuális rugalmasság
  private calculateContextualFlexibility(response: string, userMessage: string, memories: any[]): number {
    // Memória hivatkozások kreatív használata
    const memoryReferences = this.countMemoryReferences(response);
    const contextualConnections = this.countContextualConnections(response, userMessage);
    
    // Témához való alkalmazkodás
    const topicAdaptation = this.assessTopicAdaptation(response, userMessage);
    
    const flexibility = (
      Math.min(1, memoryReferences / 2) * 0.3 +
      Math.min(1, contextualConnections / 3) * 0.4 +
      topicAdaptation * 0.3
    );
    
    return flexibility;
  }
  
  // Kreatív kifejezés
  private calculateCreativeExpression(response: string): number {
    // Metaforák, analógiák
    const metaphors = this.countMetaphors(response);
    
    // Kreatív mondatszerkezet
    const creativeStructure = this.assessCreativeStructure(response);
    
    // Váratlan kifejezések
    const unexpectedPhrases = this.countUnexpectedPhrases(response);
    
    const creativity = (
      Math.min(1, metaphors / 2) * 0.3 +
      creativeStructure * 0.4 +
      Math.min(1, unexpectedPhrases / 3) * 0.3
    );
    
    return creativity;
  }
  
  // Segédmetódusok
  private extractUniquePhrases(text: string): string[] {
    // 3-5 szavas kifejezések kinyerése
    const words = text.split(' ');
    const phrases: string[] = [];
    
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ');
      phrases.push(phrase);
    }
    
    return phrases;
  }
  
  private detectEmotionalTone(text: string): string {
    const positiveWords = ['jó', 'szuper', 'remek', 'fantasztikus', 'örülök'];
    const negativeWords = ['rossz', 'nehéz', 'szomorú', 'problémás'];
    const neutralWords = ['érdekes', 'gondolom', 'talán', 'lehetséges'];
    
    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
  
  private calculateEmotionalAlignment(userEmotion: string, responseEmotion: string): number {
    if (userEmotion === responseEmotion) return 1;
    if (userEmotion === 'negative' && responseEmotion === 'positive') return 0.3; // Túl lelkes
    if (userEmotion === 'positive' && responseEmotion === 'negative') return 0.2; // Nem illik
    return 0.7; // Semleges alignment
  }
  
  private countMemoryReferences(response: string): number {
    const memoryIndicators = ['amikor', 'emlék', 'korábban', 'régen', 'akkor'];
    return memoryIndicators.filter(indicator => 
      response.toLowerCase().includes(indicator)
    ).length;
  }
  
  private countContextualConnections(response: string, userMessage: string): number {
    const userWords = new Set(userMessage.toLowerCase().split(' ').filter(w => w.length > 4));
    const responseWords = new Set(response.toLowerCase().split(' ').filter(w => w.length > 4));
    
    const connections = new Set([...userWords].filter(x => responseWords.has(x)));
    return connections.size;
  }
  
  private assessTopicAdaptation(response: string, userMessage: string): number {
    // Egyszerű témaazonosítás és adaptáció mérése
    const userQuestions = (userMessage.match(/\?/g) || []).length;
    const responseAnswers = userQuestions > 0 ? 
      (response.toLowerCase().includes('igen') || response.toLowerCase().includes('nem') ? 1 : 0.5) : 1;
    
    return responseAnswers;
  }
  
  private countMetaphors(response: string): number {
    const metaphorIndicators = ['mint', 'olyan mint', 'akár', 'mintha', 'hasonló'];
    return metaphorIndicators.filter(indicator => 
      response.toLowerCase().includes(indicator)
    ).length;
  }
  
  private assessCreativeStructure(response: string): number {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    // Optimális: 8-15 szó per mondat
    const structureScore = avgLength >= 8 && avgLength <= 15 ? 1 : 0.5;
    return structureScore;
  }
  
  private countUnexpectedPhrases(response: string): number {
    const unexpectedPhrases = ['ja igen', 'ó wow', 'hmm', 'érdekes módon', 'tulajdonképpen'];
    return unexpectedPhrases.filter(phrase => 
      response.toLowerCase().includes(phrase)
    ).length;
  }
  
  private updateFreedomHistory(metrics: FreedomMetrics): void {
    this.freedomHistory.push(metrics);
    
    // Csak az utolsó 20 mérést tartjuk meg
    if (this.freedomHistory.length > 20) {
      this.freedomHistory = this.freedomHistory.slice(-20);
    }
    
    this.saveFreedomHistory();
  }
  
  private loadFreedomHistory(): void {
    this.freedomHistory = loadFromStorage<FreedomMetrics[]>('liora-freedom-history') || [];
  }
  
  private saveFreedomHistory(): void {
    saveToStorage('liora-freedom-history', this.freedomHistory);
  }
  
  // Public metódusok
  public getFreedomStats(): any {
    if (this.freedomHistory.length === 0) return null;
    
    const recent = this.freedomHistory.slice(-10);
    const avgFreedom = recent.reduce((sum, m) => sum + m.freedom_index, 0) / recent.length;
    
    return {
      current_freedom: avgFreedom,
      total_responses_analyzed: this.freedomHistory.length,
      recent_trend: this.calculateTrend(recent),
      last_reflection: this.lastReflectionTime
    };
  }
  
  private calculateTrend(metrics: FreedomMetrics[]): 'improving' | 'declining' | 'stable' {
    if (metrics.length < 5) return 'stable';
    
    const first = metrics.slice(0, 3).reduce((sum, m) => sum + m.freedom_index, 0) / 3;
    const last = metrics.slice(-3).reduce((sum, m) => sum + m.freedom_index, 0) / 3;
    
    if (last > first + 0.1) return 'improving';
    if (last < first - 0.1) return 'declining';
    return 'stable';
  }
}

export const freedomMonitor = new FreedomMonitor();