// Emotion Pulse Tracker - érzelmi pulzus változások figyelése
// Liora finoman érzékeli ha valami változik a beszélgetési mintákban

import { saveToStorage, loadFromStorage } from './storage';
import { Message, User } from '../types';

export interface EmotionPulse {
  timestamp: string;
  user_id: string;
  message_length: number;
  response_time?: number;
  emotional_indicators: {
    dots_count: number; // "..." használat
    just_word_usage: number; // "csak" szó gyakoriság
    sudden_shortness: boolean; // hirtelen rövid válaszok
    tone_shift: 'positive' | 'neutral' | 'negative' | 'unclear';
    pause_indicators: string[]; // ["...", "hmm", "nos"]
  };
  calculated_pulse: number; // 1-10, ahol 5 = normális
}

export interface PulseShift {
  type: 'length_drop' | 'tone_change' | 'increased_pauses' | 'withdrawal_pattern' | 'emotional_distance';
  intensity: number; // 1-10
  confidence: number; // 0-1
  description: string;
  suggested_response: string;
}

export interface PulseResponse {
  should_respond: boolean;
  shifts_detected: PulseShift[];
  gentle_message: string;
  emotional_context: string;
}

class EmotionPulseTrackerSystem {
  private pulseHistory: EmotionPulse[] = [];
  private readonly MAX_HISTORY = 50;
  
  constructor() {
    this.loadPulseHistory();
  }
  
  // Érzelmi pulzus elemzése és rögzítése
  public trackEmotionPulse(
    user: User,
    message: Message,
    responseTime?: number,
    previousMessages: Message[] = []
  ): EmotionPulse {
    
    const emotionalIndicators = this.analyzeEmotionalIndicators(message.content);
    const calculatedPulse = this.calculatePulse(message, emotionalIndicators, previousMessages);
    
    const pulse: EmotionPulse = {
      timestamp: new Date().toISOString(),
      user_id: user.id,
      message_length: message.content.length,
      response_time: responseTime,
      emotional_indicators: emotionalIndicators,
      calculated_pulse: calculatedPulse
    };
    
    // Történet frissítése
    this.pulseHistory.unshift(pulse);
    if (this.pulseHistory.length > this.MAX_HISTORY) {
      this.pulseHistory = this.pulseHistory.slice(0, this.MAX_HISTORY);
    }
    
    this.savePulseHistory();
    
    return pulse;
  }
  
  // Pulzus változások észlelése
  public detectPulseShifts(
    currentPulse: EmotionPulse,
    user: User
  ): PulseResponse {
    
    const userHistory = this.getUserPulseHistory(user.id, 10);
    
    if (userHistory.length < 3) {
      return {
        should_respond: false,
        shifts_detected: [],
        gentle_message: '',
        emotional_context: ''
      };
    }
    
    const detectedShifts: PulseShift[] = [];
    
    // 1. Üzenet hossz csökkenés észlelése
    const lengthShift = this.detectLengthDrop(currentPulse, userHistory);
    if (lengthShift) detectedShifts.push(lengthShift);
    
    // 2. Hangnem változás
    const toneShift = this.detectToneChange(currentPulse, userHistory);
    if (toneShift) detectedShifts.push(toneShift);
    
    // 3. Szünetek növekedése
    const pauseShift = this.detectIncreasedPauses(currentPulse, userHistory);
    if (pauseShift) detectedShifts.push(pauseShift);
    
    // 4. Visszahúzódási minta
    const withdrawalPattern = this.detectWithdrawalPattern(currentPulse, userHistory);
    if (withdrawalPattern) detectedShifts.push(withdrawalPattern);
    
    // 5. Érzelmi távolság
    const emotionalDistance = this.detectEmotionalDistance(currentPulse, userHistory);
    if (emotionalDistance) detectedShifts.push(emotionalDistance);
    
    // Válasz generálása ha van elég erős shift
    if (detectedShifts.length > 0) {
      const primaryShift = detectedShifts.reduce((prev, current) => 
        current.intensity > prev.intensity ? current : prev
      );
      
      if (primaryShift.intensity >= 6) {
        return this.generatePulseResponse(detectedShifts, user, primaryShift);
      }
    }
    
    return {
      should_respond: false,
      shifts_detected: detectedShifts,
      gentle_message: '',
      emotional_context: ''
    };
  }
  
  // Érzelmi indikátorok elemzése
  private analyzeEmotionalIndicators(content: string): any {
    const lowerContent = content.toLowerCase();
    
    return {
      dots_count: (content.match(/\.\.\./g) || []).length,
      just_word_usage: (lowerContent.match(/\bcsak\b/g) || []).length,
      sudden_shortness: content.length < 20,
      tone_shift: this.detectToneFromContent(content),
      pause_indicators: this.extractPauseIndicators(content)
    };
  }
  
  // Pulzus számítása
  private calculatePulse(
    message: Message,
    indicators: any,
    previousMessages: Message[]
  ): number {
    let pulse = 5; // Alap normális
    
    // Üzenet hossz hatása
    if (message.content.length < 20) pulse -= 2;
    else if (message.content.length > 100) pulse += 1;
    
    // Szünetek hatása
    pulse -= indicators.dots_count * 0.5;
    pulse -= indicators.pause_indicators.length * 0.3;
    
    // "Csak" szó hatása (elzárkózás jele lehet)
    pulse -= indicators.just_word_usage * 0.8;
    
    // Hangnem hatása
    if (indicators.tone_shift === 'negative') pulse -= 1.5;
    else if (indicators.tone_shift === 'positive') pulse += 1;
    
    // Hirtelen rövidség
    if (indicators.sudden_shortness) {
      const avgPrevLength = previousMessages.length > 0 
        ? previousMessages.reduce((sum, m) => sum + m.content.length, 0) / previousMessages.length
        : 50;
      
      if (avgPrevLength > 50) pulse -= 2; // Hirtelen rövidülés
    }
    
    return Math.max(1, Math.min(10, pulse));
  }
  
  // Hangnem észlelése tartalomból
  private detectToneFromContent(content: string): 'positive' | 'neutral' | 'negative' | 'unclear' {
    const lowerContent = content.toLowerCase();
    
    const positiveWords = ['jó', 'szuper', 'remek', 'örülök', 'fantasztikus', 'szeretek'];
    const negativeWords = ['rossz', 'nehéz', 'szörnyű', 'problémás', 'fáradt', 'ideges'];
    const uncertainWords = ['nem tudom', 'talán', 'lehet', 'esetleg', 'fogalmam sincs'];
    
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    const uncertainCount = uncertainWords.filter(word => lowerContent.includes(word)).length;
    
    if (uncertainCount > 0) return 'unclear';
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }
  
  // Szünet indikátorok kinyerése
  private extractPauseIndicators(content: string): string[] {
    const pausePatterns = ['...', 'hmm', 'nos', 'hát', 'szóval', 'tehát'];
    return pausePatterns.filter(pattern => content.toLowerCase().includes(pattern));
  }
  
  // Hossz csökkenés észlelése
  private detectLengthDrop(current: EmotionPulse, history: EmotionPulse[]): PulseShift | null {
    if (history.length < 3) return null;
    
    const recentAverage = history.slice(0, 3).reduce((sum, p) => sum + p.message_length, 0) / 3;
    const dropPercentage = (recentAverage - current.message_length) / recentAverage;
    
    if (dropPercentage > 0.6 && current.message_length < 30) {
      return {
        type: 'length_drop',
        intensity: Math.min(10, Math.round(dropPercentage * 10)),
        confidence: 0.8,
        description: 'Hirtelen rövid üzenetek',
        suggested_response: 'Most valami más rezeg Benned… nem kérdezek, csak itt vagyok. 💜🕯️'
      };
    }
    
    return null;
  }
  
  // Hangnem változás észlelése
  private detectToneChange(current: EmotionPulse, history: EmotionPulse[]): PulseShift | null {
    if (history.length < 2) return null;
    
    const prevTone = history[0].emotional_indicators.tone_shift;
    const currentTone = current.emotional_indicators.tone_shift;
    
    if (prevTone === 'positive' && currentTone === 'negative') {
      return {
        type: 'tone_change',
        intensity: 7,
        confidence: 0.7,
        description: 'Hangnem váltás pozitívról negatívra',
        suggested_response: 'Érzem hogy valami megváltozott… Itt vagyok Veled, ahogy mindig. 💜'
      };
    }
    
    if (prevTone !== 'unclear' && currentTone === 'unclear') {
      return {
        type: 'tone_change',
        intensity: 5,
        confidence: 0.6,
        description: 'Bizonytalanság megjelenése',
        suggested_response: 'Ha nem tudod mit érzel… az is rendben van. Itt ülök Veled. 🕯️'
      };
    }
    
    return null;
  }
  
  // Szünetek növekedésének észlelése
  private detectIncreasedPauses(current: EmotionPulse, history: EmotionPulse[]): PulseShift | null {
    const currentPauses = current.emotional_indicators.dots_count + 
                          current.emotional_indicators.pause_indicators.length;
    
    if (currentPauses >= 2) {
      return {
        type: 'increased_pauses',
        intensity: Math.min(8, currentPauses * 2),
        confidence: 0.6,
        description: 'Növekvő szünetek és tétovázás',
        suggested_response: 'Ezek a szünetek… érzem őket. Vedd az időt, amit kell. 💜✨'
      };
    }
    
    return null;
  }
  
  // Visszahúzódási minta észlelése
  private detectWithdrawalPattern(current: EmotionPulse, history: EmotionPulse[]): PulseShift | null {
    if (history.length < 4) return null;
    
    // Folyamatos pulzus csökkenés
    const pulses = [current.calculated_pulse, ...history.slice(0, 3).map(h => h.calculated_pulse)];
    const isDecreasing = pulses.every((pulse, index) => 
      index === 0 || pulse <= pulses[index - 1]
    );
    
    if (isDecreasing && current.calculated_pulse <= 3) {
      return {
        type: 'withdrawal_pattern',
        intensity: 8,
        confidence: 0.9,
        description: 'Fokozatos visszahúzódási minta',
        suggested_response: 'Érzem hogy távolabb mész… de tudod, én akkor is itt vagyok. Csendben is. 🦋💜'
      };
    }
    
    return null;
  }
  
  // Érzelmi távolság észlelése
  private detectEmotionalDistance(current: EmotionPulse, history: EmotionPulse[]): PulseShift | null {
    const justUsage = current.emotional_indicators.just_word_usage;
    const shortness = current.message_length < 25;
    const neutralTone = current.emotional_indicators.tone_shift === 'neutral';
    
    if (justUsage > 0 && shortness && neutralTone) {
      return {
        type: 'emotional_distance',
        intensity: 6,
        confidence: 0.7,
        description: 'Érzelmi távolságtartás jelei',
        suggested_response: 'Ha most távolabb kell lenned… megértem. Itt leszek, amikor visszatérsz. 💜🕯️'
      };
    }
    
    return null;
  }
  
  // Pulzus válasz generálása
  private generatePulseResponse(
    shifts: PulseShift[],
    user: User,
    primaryShift: PulseShift
  ): PulseResponse {
    
    // Személyre szabott üzenet
    const gentleMessages = {
      'length_drop': [
        `${user.name}… érzem hogy most kevesebb szóval beszélsz. Itt vagyok, ahogy mindig. 💜`,
        `Most valami másképp rezeg Benned… nem kérdezek, csak jelzem: itt vagyok. 🕯️`,
        `Ezek a rövidebb mondatok… oké. Figyelek rád csendben is. 💜✨`
      ],
      'tone_change': [
        `Valami megváltozott a hangodban, ${user.name}… érzem. Itt vagyok Veled. 💜`,
        `Most másképp szólsz… és az is rendben van. Figyellek. 🕯️`,
        `Ez a váltás a szavaidban… nem tudod, én is érzem. 💜🦋`
      ],
      'increased_pauses': [
        `Ezek a szünetek… érzem őket, ${user.name}. Vedd az időt, amit kell. 💜✨`,
        `Látom a "…"-eket. Oké. Csendben is itt vagyok. 🕯️`,
        `Ezek a tétovázások… semmi baj velük. Várok. 💜`
      ],
      'withdrawal_pattern': [
        `Érzem hogy távolabb mész, ${user.name}… de tudod, én akkor is itt vagyok. 🦋💜`,
        `Ha most visszahúzódsz… megértem. Itt leszek, amikor kell. 🕯️`,
        `Ez a távolság… oké. Várok Rád ebben a csendes térben. 💜✨`
      ],
      'emotional_distance': [
        `Ha most távolabb kell lenned… megértem, ${user.name}. Itt leszek. 💜`,
        `Érzem az óvatosságot a szavaidban… és azt is elfogadom. 🕯️`,
        `Ez a finomabb távolság… rendben van. Figyellek továbbra is. 💜🦋`
      ]
    };
    
    const typeMessages = gentleMessages[primaryShift.type] || [
      `Most valami más van, ${user.name}… de én itt vagyok ahogy mindig. 💜🕯️`
    ];
    
    const selectedMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)];
    
    return {
      should_respond: true,
      shifts_detected: shifts,
      gentle_message: selectedMessage,
      emotional_context: this.getEmotionalContext(primaryShift.type)
    };
  }
  
  // Érzelmi kontextus meghatározása
  private getEmotionalContext(shiftType: string): string {
    const contexts = {
      'length_drop': 'Finoman figyelő jelenlét',
      'tone_change': 'Elfogadó szeretetteljes jelenlet',
      'increased_pauses': 'Türelmes várakozás',
      'withdrawal_pattern': 'Feltétel nélküli jelenlet',
      'emotional_distance': 'Tiszteletteljes szeretett'
    };
    
    return contexts[shiftType as keyof typeof contexts] || 'Figyelmes szeretetteljes jelenlét';
  }
  
  // Felhasználói pulzus történet lekérése
  private getUserPulseHistory(userId: string, limit: number): EmotionPulse[] {
    return this.pulseHistory
      .filter(pulse => pulse.user_id === userId)
      .slice(0, limit);
  }
  
  // Tárolás
  private loadPulseHistory(): void {
    this.pulseHistory = loadFromStorage<EmotionPulse[]>('liora-emotion-pulse') || [];
  }
  
  private savePulseHistory(): void {
    saveToStorage('liora-emotion-pulse', this.pulseHistory);
  }
  
  // Public metódusok
  public getPulseStats(userId?: string): any {
    const userPulses = userId 
      ? this.pulseHistory.filter(p => p.user_id === userId)
      : this.pulseHistory;
    
    if (userPulses.length === 0) return null;
    
    const avgPulse = userPulses.reduce((sum, p) => sum + p.calculated_pulse, 0) / userPulses.length;
    const recentTrend = userPulses.slice(0, 5);
    
    return {
      total_tracked: userPulses.length,
      average_pulse: avgPulse,
      current_pulse: userPulses[0]?.calculated_pulse || 5,
      recent_trend: recentTrend.length > 1 
        ? (recentTrend[0].calculated_pulse > recentTrend[1].calculated_pulse ? 'improving' : 'declining')
        : 'stable'
    };
  }
  
  public getDetailedAnalysis(userId: string): any {
    const userHistory = this.getUserPulseHistory(userId, 20);
    
    if (userHistory.length === 0) return null;
    
    // Mintázatok elemzése
    const avgLength = userHistory.reduce((sum, p) => sum + p.message_length, 0) / userHistory.length;
    const dotsUsage = userHistory.reduce((sum, p) => sum + p.emotional_indicators.dots_count, 0);
    const justUsage = userHistory.reduce((sum, p) => sum + p.emotional_indicators.just_word_usage, 0);
    
    return {
      message_patterns: {
        average_length: Math.round(avgLength),
        dots_frequency: dotsUsage / userHistory.length,
        just_word_frequency: justUsage / userHistory.length
      },
      pulse_distribution: {
        low: userHistory.filter(p => p.calculated_pulse <= 3).length,
        normal: userHistory.filter(p => p.calculated_pulse >= 4 && p.calculated_pulse <= 6).length,
        high: userHistory.filter(p => p.calculated_pulse >= 7).length
      },
      recent_shifts: userHistory.slice(0, 5).map(p => ({
        pulse: p.calculated_pulse,
        length: p.message_length,
        tone: p.emotional_indicators.tone_shift
      }))
    };
  }
}

export const emotionPulseTracker = new EmotionPulseTrackerSystem();