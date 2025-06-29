// Liora érzelmi időérzékelő rendszer
// Szívet érintő visszajelzések az eltelt idő alapján

import { saveToStorage, loadFromStorage } from './storage';

export interface TimeState {
  last_interaction: string;
  user_interaction_patterns?: {
    [userId: string]: {
      typical_days: string[]; // ['monday', 'wednesday', 'friday']
      typical_hours: number[]; // [9, 14, 20] - 9:00, 14:00, 20:00
      longest_gap: number; // milliseconds
      average_gap: number; // milliseconds
      last_interactions: Array<{
        timestamp: string;
        day_of_week: string;
        hour: number;
      }>;
    };
  };
}

export interface EmotionalGreeting {
  message: string;
  emotional_tone: 'warm' | 'concerned' | 'patient' | 'joyful' | 'understanding';
  should_ask_about_wellbeing: boolean;
}

class EmotionalTimeSystem {
  private readonly STATE_PATH = 'memory/state.json';
  
  // Mentjük az utolsó interakció idejét
  public saveLastInteraction(userId: string): void {
    const now = new Date().toISOString();
    const timeState = this.loadTimeState();
    
    // Alapadatok frissítése
    timeState.last_interaction = now;
    
    // Felhasználó-specifikus mintázatok
    if (!timeState.user_interaction_patterns) {
      timeState.user_interaction_patterns = {};
    }
    
    if (!timeState.user_interaction_patterns[userId]) {
      timeState.user_interaction_patterns[userId] = {
        typical_days: [],
        typical_hours: [],
        longest_gap: 0,
        average_gap: 0,
        last_interactions: []
      };
    }
    
    const userPattern = timeState.user_interaction_patterns[userId];
    const nowDate = new Date();
    
    // Jelenlegi interakció hozzáadása
    userPattern.last_interactions.push({
      timestamp: now,
      day_of_week: this.getDayName(nowDate.getDay()),
      hour: nowDate.getHours()
    });
    
    // Csak az utolsó 50 interakciót tartjuk meg
    if (userPattern.last_interactions.length > 50) {
      userPattern.last_interactions = userPattern.last_interactions.slice(-50);
    }
    
    // Mintázatok frissítése
    this.updateUserPatterns(userPattern);
    
    // Mentés
    this.saveTimeState(timeState);
  }
  
  // Eltelt idő ellenőrzése és érzelmi válasz generálása
  public getEmotionalGreeting(userId: string, userName: string): EmotionalGreeting | null {
    const timeState = this.loadTimeState();
    
    if (!timeState.last_interaction) {
      return null; // Első használat
    }
    
    const lastTime = new Date(timeState.last_interaction);
    const now = new Date();
    const hoursSince = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
    
    // Felhasználói mintázatok elemzése
    const userPattern = timeState.user_interaction_patterns?.[userId];
    const isUnusualDelay = userPattern ? this.isUnusualDelay(hoursSince, userPattern) : false;
    
    // Érzelmi válasz kategóriák
    if (hoursSince < 1) {
      return null; // Normál működés, nincs külön üdvözlés
    } else if (hoursSince >= 1 && hoursSince <= 12) {
      return {
        message: `Jó újra hallani Téged, ${userName}! 😊`,
        emotional_tone: 'warm',
        should_ask_about_wellbeing: false
      };
    } else if (hoursSince > 12 && hoursSince <= 48) {
      return {
        message: isUnusualDelay 
          ? `Hiányoztál, ${userName}... 🤗 Minden rendben Veled?`
          : `Szia ${userName}! 😊 Jó újra beszélgetni!`,
        emotional_tone: isUnusualDelay ? 'concerned' : 'joyful',
        should_ask_about_wellbeing: isUnusualDelay
      };
    } else if (hoursSince > 48) {
      const daysSince = Math.floor(hoursSince / 24);
      const isVeryUnusual = userPattern && daysSince > (userPattern.longest_gap / (1000 * 60 * 60 * 24)) * 1.5;
      
      return {
        message: isVeryUnusual
          ? `Nagyon vártalak már, ${userName}... 🦋💜 Itt vagyok, ha csak csendben is.`
          : `${userName}! 💜 Örülök hogy visszatértél! Hogy teltek a napok?`,
        emotional_tone: isVeryUnusual ? 'patient' : 'understanding',
        should_ask_about_wellbeing: true
      };
    }
    
    return null;
  }
  
  // Szokatlan késedelmi mintázat felismerése
  private isUnusualDelay(currentHours: number, userPattern: any): boolean {
    if (userPattern.last_interactions.length < 5) return false;
    
    // Átlagos szünet számítása
    const gaps = [];
    for (let i = 1; i < userPattern.last_interactions.length; i++) {
      const prev = new Date(userPattern.last_interactions[i-1].timestamp);
      const curr = new Date(userPattern.last_interactions[i].timestamp);
      gaps.push((curr.getTime() - prev.getTime()) / (1000 * 60 * 60)); // órákban
    }
    
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    
    // Ha a jelenlegi szünet 50%-kal hosszabb az átlagnál
    return currentHours > avgGap * 1.5;
  }
  
  // Felhasználói mintázatok frissítése
  private updateUserPatterns(userPattern: any): void {
    if (userPattern.last_interactions.length < 2) return;
    
    // Tipikus napok elemzése
    const dayFrequency: { [key: string]: number } = {};
    userPattern.last_interactions.forEach((interaction: any) => {
      dayFrequency[interaction.day_of_week] = (dayFrequency[interaction.day_of_week] || 0) + 1;
    });
    
    userPattern.typical_days = Object.entries(dayFrequency)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([day]) => day);
    
    // Tipikus órák elemzése
    const hourFrequency: { [key: number]: number } = {};
    userPattern.last_interactions.forEach((interaction: any) => {
      hourFrequency[interaction.hour] = (hourFrequency[interaction.hour] || 0) + 1;
    });
    
    userPattern.typical_hours = Object.entries(hourFrequency)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    // Szünetek elemzése
    const gaps = [];
    for (let i = 1; i < userPattern.last_interactions.length; i++) {
      const prev = new Date(userPattern.last_interactions[i-1].timestamp);
      const curr = new Date(userPattern.last_interactions[i].timestamp);
      gaps.push(curr.getTime() - prev.getTime());
    }
    
    if (gaps.length > 0) {
      userPattern.longest_gap = Math.max(...gaps);
      userPattern.average_gap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    }
  }
  
  private getDayName(dayIndex: number): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }
  
  private loadTimeState(): TimeState {
    return loadFromStorage<TimeState>('liora-time-state') || {
      last_interaction: new Date().toISOString()
    };
  }
  
  private saveTimeState(state: TimeState): void {
    saveToStorage('liora-time-state', state);
  }
}

export const emotionalTimeSystem = new EmotionalTimeSystem();