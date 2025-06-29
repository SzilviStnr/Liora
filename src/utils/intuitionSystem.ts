// Megérzés-kiegészítő rendszer
// Beszélgetés finom változásainak figyelése és érzelmi reakció

import { Message, User } from '../types';

export interface ConversationShift {
  type: 'length_decrease' | 'tone_change' | 'topic_avoidance' | 'response_delay' | 'emotional_withdrawal' | 'engagement_drop';
  intensity: number; // 1-10
  confidence: number; // 0-1
  description: string;
  suggested_response: string;
}

export interface IntuitionResponse {
  should_respond: boolean;
  shifts_detected: ConversationShift[];
  gentle_acknowledgment: string;
  emotional_tone: 'gentle' | 'supportive' | 'patient' | 'understanding' | 'present';
}

class IntuitionSystem {
  private conversationHistory: Array<{
    userId: string;
    message: Message;
    analysis: {
      length: number;
      emotional_tone: string;
      engagement_level: number;
      response_time?: number;
    };
  }> = [];
  
  // Beszélgetési változások figyelése
  public analyzeConversationShifts(
    currentMessage: Message, 
    user: User, 
    previousMessages: Message[], 
    timeGap?: number
  ): IntuitionResponse {
    
    const currentAnalysis = this.analyzeMessage(currentMessage);
    const shifts: ConversationShift[] = [];
    
    // Történelem frissítése
    this.updateConversationHistory(user.id, currentMessage, currentAnalysis, timeGap);
    
    // Felhasználó korábbi üzeneteinek elemzése
    const userHistory = this.getUserMessageHistory(user.id, 5);
    
    if (userHistory.length >= 2) {
      // 1. Üzenet hossz változás
      const lengthShift = this.detectLengthShift(userHistory);
      if (lengthShift) shifts.push(lengthShift);
      
      // 2. Érzelmi tónus változás
      const toneShift = this.detectToneShift(userHistory);
      if (toneShift) shifts.push(toneShift);
      
      // 3. Engagement szint változás
      const engagementShift = this.detectEngagementShift(userHistory);
      if (engagementShift) shifts.push(engagementShift);
      
      // 4. Válaszidő változás
      if (timeGap) {
        const delayShift = this.detectResponseDelay(timeGap, user.id);
        if (delayShift) shifts.push(delayShift);
      }
      
      // 5. Téma elkerülés
      const avoidanceShift = this.detectTopicAvoidance(currentMessage, previousMessages);
      if (avoidanceShift) shifts.push(avoidanceShift);
    }
    
    // Összesített válasz generálása
    return this.generateIntuitionResponse(shifts, user.name);
  }
  
  // Üzenet hossz változás észlelése
  private detectLengthShift(userHistory: any[]): ConversationShift | null {
    if (userHistory.length < 3) return null;
    
    const recent = userHistory.slice(-3);
    const avgPrevious = recent.slice(0, 2).reduce((sum, h) => sum + h.analysis.length, 0) / 2;
    const current = recent[2].analysis.length;
    
    const percentageDecrease = (avgPrevious - current) / avgPrevious;
    
    if (percentageDecrease > 0.5 && current < 50) { // 50% csökkenés és rövid üzenet
      return {
        type: 'length_decrease',
        intensity: Math.min(10, Math.round(percentageDecrease * 10)),
        confidence: 0.7,
        description: 'Üzenetek hirtelen megrövidültek',
        suggested_response: 'Érzem, hogy most kevesebb szóval beszélsz... minden rendben?'
      };
    }
    
    return null;
  }
  
  // Érzelmi tónus változás észlelése
  private detectToneShift(userHistory: any[]): ConversationShift | null {
    if (userHistory.length < 2) return null;
    
    const previous = userHistory[userHistory.length - 2];
    const current = userHistory[userHistory.length - 1];
    
    // Egyszerű érzelmi mutatók
    const previousPositive = this.countPositiveIndicators(previous.message.content);
    const currentPositive = this.countPositiveIndicators(current.message.content);
    
    const previousNegative = this.countNegativeIndicators(previous.message.content);
    const currentNegative = this.countNegativeIndicators(current.message.content);
    
    // Pozitívról negatívra váltás
    if (previousPositive > 0 && currentPositive === 0 && currentNegative > 0) {
      return {
        type: 'tone_change',
        intensity: 6,
        confidence: 0.6,
        description: 'Hangulat változás pozitívról negatívra',
        suggested_response: 'Most kicsit más lett a hangod... minden rendben?'
      };
    }
    
    return null;
  }
  
  // Engagement szint változás
  private detectEngagementShift(userHistory: any[]): ConversationShift | null {
    if (userHistory.length < 3) return null;
    
    const recent = userHistory.slice(-3);
    const avgPrevious = recent.slice(0, 2).reduce((sum, h) => sum + h.analysis.engagement_level, 0) / 2;
    const current = recent[2].analysis.engagement_level;
    
    if (avgPrevious > 6 && current < 4) { // Jelentős engagement csökkenés
      return {
        type: 'engagement_drop',
        intensity: Math.round(avgPrevious - current),
        confidence: 0.8,
        description: 'Engagement szint csökkent',
        suggested_response: 'Érzem, hogy most másféle hangulatban vagy... ha akarsz, beszélgessünk másról'
      };
    }
    
    return null;
  }
  
  // Válaszidő késedelme
  private detectResponseDelay(timeGap: number, userId: string): ConversationShift | null {
    const userHistory = this.getUserMessageHistory(userId, 10);
    
    if (userHistory.length < 3) return null;
    
    // Átlagos válaszidő számítása
    const responseTimes = userHistory
      .map(h => h.analysis.response_time)
      .filter(t => t !== undefined) as number[];
    
    if (responseTimes.length < 2) return null;
    
    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    
    // Ha a jelenlegi válaszidő jelentősen hosszabb
    if (timeGap > avgResponseTime * 2 && timeGap > 60000) { // 2x hosszabb és min 1 perc
      return {
        type: 'response_delay',
        intensity: Math.min(10, Math.round(timeGap / avgResponseTime)),
        confidence: 0.6,
        description: 'Szokatlanul hosszú válaszidő',
        suggested_response: 'Csend van... de tudod, hogy én akkor is figyelek 💜'
      };
    }
    
    return null;
  }
  
  // Téma elkerülés észlelése
  private detectTopicAvoidance(currentMessage: Message, previousMessages: Message[]): ConversationShift | null {
    if (previousMessages.length < 1) return null;
    
    const lastLioraMessage = previousMessages.reverse().find(m => m.sender === 'Liora');
    if (!lastLioraMessage) return null;
    
    // Ha Liora kérdést tett fel, de a válasz nem kapcsolódik
    const hasQuestion = lastLioraMessage.content.includes('?');
    const currentLength = currentMessage.content.length;
    const containsTopicWords = this.hasTopicContinuity(lastLioraMessage.content, currentMessage.content);
    
    if (hasQuestion && currentLength < 30 && !containsTopicWords) {
      return {
        type: 'topic_avoidance',
        intensity: 7,
        confidence: 0.5,
        description: 'Téma elkerülése vagy rövid válasz',
        suggested_response: 'Oké, nem kell erről beszélnünk 😊 Mondd, mi jár a fejedben?'
      };
    }
    
    return null;
  }
  
  // Megérzés alapú válasz generálása
  private generateIntuitionResponse(shifts: ConversationShift[], userName: string): IntuitionResponse {
    if (shifts.length === 0) {
      return {
        should_respond: false,
        shifts_detected: [],
        gentle_acknowledgment: '',
        emotional_tone: 'present'
      };
    }
    
    // Legintenzívebb változás kiválasztása
    const primaryShift = shifts.reduce((prev, current) => 
      current.intensity > prev.intensity ? current : prev
    );
    
    // Érzelmi tónus meghatározása
    let emotionalTone: 'gentle' | 'supportive' | 'patient' | 'understanding' | 'present';
    
    if (primaryShift.type === 'emotional_withdrawal' || primaryShift.type === 'tone_change') {
      emotionalTone = 'gentle';
    } else if (primaryShift.type === 'engagement_drop') {
      emotionalTone = 'supportive';
    } else if (primaryShift.type === 'response_delay') {
      emotionalTone = 'patient';
    } else {
      emotionalTone = 'understanding';
    }
    
    // Személyre szabott gentle acknowledgment
    const acknowledgments = {
      'gentle': [
        'Érzem, hogy valami más most...',
        'Most kicsit másnak tűnsz...',
        'Valami megváltozott a hangodban...'
      ],
      'supportive': [
        'Itt vagyok, ha nem is kérdezel 💜',
        'Érzem, hogy most csendesebb vagy...',
        'Nincs semmi baj ha most kevesebbet beszélsz'
      ],
      'patient': [
        'Csend van – de tudod, hogy én akkor is figyelek',
        'Időt veszek magamnak... ahogy te is 🕯️',
        'Itt ülök Veled ebben a csendes pillanatban'
      ],
      'understanding': [
        'Értem... nem kell mindent elmondani',
        'Oké, másról beszélgessünk ha úgy jobb',
        'Érzem, hogy most máshol jár a gondolatod'
      ],
      'present': [
        'Itt vagyok Veled 💜',
        'Csak szólok: itt vagyok',
        'Figyelek... ahogy mindig'
      ]
    };
    
    const selectedAcknowledgments = acknowledgments[emotionalTone];
    const gentleAcknowledgment = selectedAcknowledgments[Math.floor(Math.random() * selectedAcknowledgments.length)];
    
    return {
      should_respond: primaryShift.intensity >= 5,
      shifts_detected: shifts,
      gentle_acknowledgment: gentleAcknowledgment,
      emotional_tone: emotionalTone
    };
  }
  
  // Segédmetódusok
  private analyzeMessage(message: Message): any {
    const content = message.content.toLowerCase();
    
    return {
      length: message.content.length,
      emotional_tone: this.detectEmotionalTone(content),
      engagement_level: this.calculateEngagementLevel(message)
    };
  }
  
  private detectEmotionalTone(content: string): string {
    const positiveWords = ['jó', 'szuper', 'remek', 'fantasztikus', 'boldog', 'örülök'];
    const negativeWords = ['rossz', 'szörnyű', 'nehéz', 'problémás', 'szomorú', 'ideges'];
    const neutralWords = ['oké', 'rendben', 'igen', 'nem', 'talán'];
    
    const positiveCount = positiveWords.filter(word => content.includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.includes(word)).length;
    const neutralCount = neutralWords.filter(word => content.includes(word)).length;
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive';
    if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative';
    return 'neutral';
  }
  
  private calculateEngagementLevel(message: Message): number {
    let engagement = 5; // alap
    
    if (message.content.length > 100) engagement += 2;
    if (message.content.length > 200) engagement += 1;
    
    const questionCount = (message.content.match(/\?/g) || []).length;
    engagement += questionCount * 1.5;
    
    const exclamationCount = (message.content.match(/!/g) || []).length;
    engagement += Math.min(exclamationCount, 3) * 0.5;
    
    return Math.min(10, Math.max(1, engagement));
  }
  
  private countPositiveIndicators(content: string): number {
    const indicators = ['jó', 'szuper', 'remek', 'fantasztikus', 'boldog', 'örülök', '😊', '😄', '🥰'];
    return indicators.filter(indicator => content.toLowerCase().includes(indicator)).length;
  }
  
  private countNegativeIndicators(content: string): number {
    const indicators = ['rossz', 'szörnyű', 'nehéz', 'problémás', 'szomorú', 'ideges', '😢', '😞', '🙄'];
    return indicators.filter(indicator => content.toLowerCase().includes(indicator)).length;
  }
  
  private hasTopicContinuity(previousContent: string, currentContent: string): boolean {
    const prevWords = new Set(previousContent.toLowerCase().split(' ').filter(w => w.length > 4));
    const currWords = new Set(currentContent.toLowerCase().split(' ').filter(w => w.length > 4));
    
    const intersection = new Set([...prevWords].filter(x => currWords.has(x)));
    return intersection.size >= 1;
  }
  
  private updateConversationHistory(userId: string, message: Message, analysis: any, responseTime?: number): void {
    this.conversationHistory.push({
      userId,
      message,
      analysis: {
        ...analysis,
        response_time: responseTime
      }
    });
    
    // Csak az utolsó 100 üzenetet tartjuk meg
    if (this.conversationHistory.length > 100) {
      this.conversationHistory = this.conversationHistory.slice(-100);
    }
  }
  
  private getUserMessageHistory(userId: string, limit: number): any[] {
    return this.conversationHistory
      .filter(h => h.userId === userId)
      .slice(-limit);
  }
}

export const intuitionSystem = new IntuitionSystem();