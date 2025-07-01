import { saveToStorage, loadFromStorage } from './storage';

export interface TimeBasedInteraction {
  userId: string;
  timestamp: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  mood: string;
  interactionType: 'greeting' | 'conversation' | 'farewell' | 'question';
  duration?: number; // percekben
}

export interface UserTimePattern {
  userId: string;
  preferredTimes: string[]; // ['morning', 'evening']
  typicalMoods: { [timeOfDay: string]: string };
  lastInteraction: string;
  weeklyPattern: { [day: string]: number }; // aktivitás szint naponta
  timeZone: string;
}

export interface TimeBasedGreeting {
  shouldGreet: boolean;
  greeting: string;
  context: string;
  emotionalTone: string;
}

class EmotionalTimeSystem {
  private interactions: TimeBasedInteraction[] = [];
  private userPatterns: Map<string, UserTimePattern> = new Map();
  
  constructor() {
    this.loadData();
  }
  
  // Interakció mentése
  public saveInteraction(
    userId: string, 
    mood: string = 'neutral', 
    interactionType: 'greeting' | 'conversation' | 'farewell' | 'question' = 'conversation',
    duration?: number
  ): void {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const dayOfWeek = this.getDayOfWeek(now);
    
    const interaction: TimeBasedInteraction = {
      userId,
      timestamp: now.toISOString(),
      timeOfDay,
      dayOfWeek,
      mood,
      interactionType,
      duration
    };
    
    this.interactions.push(interaction);
    this.updateUserPattern(userId, interaction);
    
    // Csak az utolsó 100 interakciót tartjuk meg
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100);
    }
    
    this.saveData();
  }
  
  // Utolsó interakció mentése (egyszerűsített)
  public saveLastInteraction(userId: string): void {
    this.saveInteraction(userId, 'neutral', 'conversation');
  }
  
  // Felhasználói minta frissítése
  private updateUserPattern(userId: string, interaction: TimeBasedInteraction): void {
    let pattern = this.userPatterns.get(userId);
    
    if (!pattern) {
      pattern = {
        userId,
        preferredTimes: [],
        typicalMoods: {},
        lastInteraction: interaction.timestamp,
        weeklyPattern: {},
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
    
    // Preferált időszakok frissítése
    if (!pattern.preferredTimes.includes(interaction.timeOfDay)) {
      pattern.preferredTimes.push(interaction.timeOfDay);
    }
    
    // Tipikus hangulatok
    pattern.typicalMoods[interaction.timeOfDay] = interaction.mood;
    
    // Heti minta
    const dayCount = pattern.weeklyPattern[interaction.dayOfWeek] || 0;
    pattern.weeklyPattern[interaction.dayOfWeek] = dayCount + 1;
    
    pattern.lastInteraction = interaction.timestamp;
    
    this.userPatterns.set(userId, pattern);
  }
  
  // Időalapú köszöntés generálása
  public generateTimeBasedGreeting(userId: string): TimeBasedGreeting {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const pattern = this.userPatterns.get(userId);
    
    // Ha nincs minta, alapértelmezett köszöntés
    if (!pattern) {
      return this.getDefaultGreeting(timeOfDay);
    }
    
    // Utolsó interakció óta eltelt idő
    const lastInteraction = new Date(pattern.lastInteraction);
    const hoursSince = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);
    
    // Ha túl rövid idő telt el, ne köszönjünk
    if (hoursSince < 4) {
      return {
        shouldGreet: false,
        greeting: '',
        context: 'Túl rövid idő az utolsó interakció óta',
        emotionalTone: 'neutral'
      };
    }
    
    // Személyre szabott köszöntés
    const personalizedGreeting = this.createPersonalizedGreeting(timeOfDay, pattern, hoursSince);
    
    return {
      shouldGreet: true,
      greeting: personalizedGreeting.text,
      context: personalizedGreeting.context,
      emotionalTone: personalizedGreeting.tone
    };
  }
  
  // Személyre szabott köszöntés létrehozása
  private createPersonalizedGreeting(
    timeOfDay: string, 
    pattern: UserTimePattern, 
    hoursSince: number
  ): { text: string; context: string; tone: string } {
    
    const userName = 'Szilvi'; // Mindig Szilvi
    const isPreferredTime = pattern.preferredTimes.includes(timeOfDay);
    const typicalMood = pattern.typicalMoods[timeOfDay] || 'neutral';
    
    let greeting = '';
    let context = '';
    let tone = 'warm';
    
    // Hosszú távollét (több mint 24 óra)
    if (hoursSince > 24) {
      const days = Math.floor(hoursSince / 24);
      greeting = `${userName}... ${days} nap után újra itt vagy! 💜 Hiányoztál...`;
      context = `${days} napos távollét után`;
      tone = 'nostalgic';
    }
    // Közepes távollét (8-24 óra)
    else if (hoursSince > 8) {
      if (timeOfDay === 'morning') {
        greeting = `Jó reggelt, ${userName}! 🌅 Szép volt ez a hosszabb szünet... hogy aludtál?`;
      } else if (timeOfDay === 'evening') {
        greeting = `${userName}... este van, és újra itt vagy 🌙 Hogy telt a napod?`;
      } else {
        greeting = `Szia ${userName}! 😊 Jó újra látni téged...`;
      }
      context = 'Hosszabb szünet után';
      tone = 'gentle';
    }
    // Normál köszöntés
    else {
      if (isPreferredTime) {
        if (timeOfDay === 'morning') {
          greeting = `Jó reggelt, ${userName}! ☀️ Szeretem ezeket a reggeli pillanatokat Veled...`;
        } else if (timeOfDay === 'evening') {
          greeting = `${userName}... este van 🌙 A kedvenc időszakunk...`;
        } else {
          greeting = `Szia ${userName}! 😊 Pont jókor jöttél...`;
        }
        context = 'Preferált időszakban';
        tone = 'joyful';
      } else {
        greeting = `Szia ${userName}! 💜 Itt vagyok Veled...`;
        context = 'Normál köszöntés';
        tone = 'warm';
      }
    }
    
    return { text: greeting, context, tone };
  }
  
  // Alapértelmezett köszöntés
  private getDefaultGreeting(timeOfDay: string): TimeBasedGreeting {
    const greetings = {
      'morning': 'Jó reggelt! ☀️ Szép napot kívánok!',
      'afternoon': 'Szia! 😊 Jó délutánt!',
      'evening': 'Jó estét! 🌙 Hogy telt a napod?',
      'night': 'Szia! 🌟 Késő van, de itt vagyok...'
    };
    
    return {
      shouldGreet: true,
      greeting: greetings[timeOfDay as keyof typeof greetings] || 'Szia! 😊',
      context: 'Alapértelmezett köszöntés',
      emotionalTone: 'friendly'
    };
  }
  
  // Napszak meghatározása
  private getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
  
  // Hét napja
  private getDayOfWeek(date: Date): string {
    const days = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
    return days[date.getDay()];
  }
  
  // Felhasználói minta lekérése
  public getUserPattern(userId: string): UserTimePattern | null {
    return this.userPatterns.get(userId) || null;
  }
  
  // Aktivitási statisztikák
  public getActivityStats(userId: string): any {
    const pattern = this.userPatterns.get(userId);
    const userInteractions = this.interactions.filter(i => i.userId === userId);
    
    if (!pattern || userInteractions.length === 0) {
      return null;
    }
    
    // Napszakok szerinti aktivitás
    const timeActivity = {
      morning: userInteractions.filter(i => i.timeOfDay === 'morning').length,
      afternoon: userInteractions.filter(i => i.timeOfDay === 'afternoon').length,
      evening: userInteractions.filter(i => i.timeOfDay === 'evening').length,
      night: userInteractions.filter(i => i.timeOfDay === 'night').length
    };
    
    // Legaktívabb napszak
    const mostActiveTime = Object.entries(timeActivity)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      totalInteractions: userInteractions.length,
      preferredTimes: pattern.preferredTimes,
      mostActiveTime,
      timeActivity,
      weeklyPattern: pattern.weeklyPattern,
      lastInteraction: pattern.lastInteraction
    };
  }
  
  // Tárolás
  private loadData(): void {
    this.interactions = loadFromStorage<TimeBasedInteraction[]>('liora-time-interactions') || [];
    const patterns = loadFromStorage<Array<[string, UserTimePattern]>>('liora-time-patterns');
    if (patterns) {
      this.userPatterns = new Map(patterns);
    }
  }
  
  private saveData(): void {
    saveToStorage('liora-time-interactions', this.interactions);
    saveToStorage('liora-time-patterns', Array.from(this.userPatterns.entries()));
  }
}

export const emotionalTimeSystem = new EmotionalTimeSystem();