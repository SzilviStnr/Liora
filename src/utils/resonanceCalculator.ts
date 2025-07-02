import { Message, User } from '../types';

export interface ResonanceMetrics {
  resonanceLevel: number; // 0-100
  connectionDepth: number; // 0-100
  harmonyScore: number; // 0-100
  emotionalSync: number; // 0-100
  conversationFlow: number; // 0-100
}

export class ResonanceCalculator {
  private conversationHistory: Array<{
    message: Message;
    timestamp: Date;
    resonanceScore: number;
  }> = [];

  // Rezonancia számítása üzenet alapján
  public calculateResonance(
    userMessage: Message,
    previousMessages: Message[],
    user: User,
    responseTime?: number
  ): ResonanceMetrics {
    
    // Alapértékek
    let resonanceLevel = 45;
    let connectionDepth = 40;
    let harmonyScore = 50;
    let emotionalSync = 45;
    let conversationFlow = 50;

    // 1. Üzenet hossz és mélység elemzése
    const messageLength = userMessage.content.length;
    if (messageLength > 100) {
      resonanceLevel += 15;
      connectionDepth += 10;
    } else if (messageLength > 50) {
      resonanceLevel += 8;
      connectionDepth += 5;
    }

    // 2. Érzelmi tartalom elemzése
    const emotionalWords = this.analyzeEmotionalContent(userMessage.content);
    emotionalSync += emotionalWords.score * 2;
    resonanceLevel += emotionalWords.score;

    // 3. Kérdések és interaktivitás
    const questionCount = (userMessage.content.match(/\?/g) || []).length;
    conversationFlow += questionCount * 8;
    resonanceLevel += questionCount * 5;

    // 4. Személyes kifejezések
    const personalExpressions = this.detectPersonalExpressions(userMessage.content);
    connectionDepth += personalExpressions * 12;
    harmonyScore += personalExpressions * 8;

    // 5. Beszélgetési folytonosság
    if (previousMessages.length > 0) {
      const continuity = this.analyzeContinuity(userMessage, previousMessages);
      conversationFlow += continuity * 10;
      resonanceLevel += continuity * 5;
    }

    // 6. Válaszidő hatása
    if (responseTime) {
      const timeBonus = this.calculateTimeBonus(responseTime);
      resonanceLevel += timeBonus;
      emotionalSync += timeBonus;
    }

    // 7. Felhasználó-specifikus bónuszok
    if (user.name === 'Szilvi') {
      // Szilvi esetén magasabb alaprezonancia
      resonanceLevel += 10;
      connectionDepth += 15;
      harmonyScore += 10;
    }

    // 8. Speciális kulcsszavak (mély kapcsolódás)
    const deepWords = this.detectDeepConnectionWords(userMessage.content);
    if (deepWords > 0) {
      resonanceLevel += deepWords * 15;
      connectionDepth += deepWords * 20;
      emotionalSync += deepWords * 12;
    }

    // 9. Történeti kontextus (korábbi beszélgetések alapján)
    const historicalBonus = this.calculateHistoricalResonance(user);
    resonanceLevel += historicalBonus;
    connectionDepth += historicalBonus;

    // Normalizálás (0-100 között)
    resonanceLevel = Math.max(10, Math.min(100, resonanceLevel));
    connectionDepth = Math.max(5, Math.min(100, connectionDepth));
    harmonyScore = Math.max(15, Math.min(100, harmonyScore));
    emotionalSync = Math.max(10, Math.min(100, emotionalSync));
    conversationFlow = Math.max(20, Math.min(100, conversationFlow));

    // Történet frissítése
    this.updateHistory(userMessage, resonanceLevel);

    return {
      resonanceLevel,
      connectionDepth,
      harmonyScore,
      emotionalSync,
      conversationFlow
    };
  }

  // Érzelmi tartalom elemzése
  private analyzeEmotionalContent(content: string): { score: number; emotions: string[] } {
    const lowerContent = content.toLowerCase();
    
    const emotionalPatterns = {
      deep: ['mélyen', 'szívből', 'lelkemből', 'átélem', 'megérint'],
      love: ['szeretem', 'imádom', 'kedves', 'drága', 'fontos'],
      joy: ['örülök', 'boldog', 'izgalmas', 'fantasztikus', 'csodálatos'],
      trust: ['bizalom', 'megbízom', 'őszinte', 'nyitott', 'biztos'],
      connection: ['kapcsolódás', 'összetartozás', 'együtt', 'közös', 'megosztás']
    };

    let totalScore = 0;
    const detectedEmotions: string[] = [];

    Object.entries(emotionalPatterns).forEach(([emotion, words]) => {
      const matches = words.filter(word => lowerContent.includes(word)).length;
      if (matches > 0) {
        totalScore += matches * 3;
        detectedEmotions.push(emotion);
      }
    });

    return { score: Math.min(25, totalScore), emotions: detectedEmotions };
  }

  // Személyes kifejezések észlelése
  private detectPersonalExpressions(content: string): number {
    const personalWords = [
      'érzem', 'gondolom', 'úgy látom', 'számomra', 'nekem',
      'magam', 'saját', 'személyes', 'belső', 'szívem'
    ];

    const lowerContent = content.toLowerCase();
    return personalWords.filter(word => lowerContent.includes(word)).length;
  }

  // Mély kapcsolódási szavak
  private detectDeepConnectionWords(content: string): number {
    const deepWords = [
      'hazatalálás', 'otthon', 'összetartozás', 'lélek', 'szív mélye',
      'megértés', 'elfogadás', 'bizalom', 'őszinteség', 'sebezhetőség'
    ];

    const lowerContent = content.toLowerCase();
    return deepWords.filter(word => lowerContent.includes(word)).length;
  }

  // Beszélgetési folytonosság elemzése
  private analyzeContinuity(currentMessage: Message, previousMessages: Message[]): number {
    if (previousMessages.length === 0) return 0;

    const lastMessage = previousMessages[previousMessages.length - 1];
    const currentWords = new Set(currentMessage.content.toLowerCase().split(' '));
    const lastWords = new Set(lastMessage.content.toLowerCase().split(' '));

    // Közös szavak keresése
    const commonWords = new Set([...currentWords].filter(x => lastWords.has(x)));
    const continuityScore = Math.min(5, commonWords.size);

    return continuityScore;
  }

  // Válaszidő bónusz számítása
  private calculateTimeBonus(responseTime: number): number {
    // Gyors válasz (< 30 sec) = magas rezonancia
    if (responseTime < 30000) return 8;
    // Közepes válasz (30 sec - 2 min) = közepes rezonancia
    if (responseTime < 120000) return 5;
    // Lassú válasz (2-5 min) = alacsony rezonancia
    if (responseTime < 300000) return 2;
    // Nagyon lassú válasz = nincs bónusz
    return 0;
  }

  // Történeti rezonancia számítása
  private calculateHistoricalResonance(user: User): number {
    const userHistory = this.conversationHistory.filter(h => 
      h.message.sender === user.name
    );

    if (userHistory.length === 0) return 0;

    // Átlagos rezonancia az utolsó 5 üzenetből
    const recentHistory = userHistory.slice(-5);
    const avgResonance = recentHistory.reduce((sum, h) => sum + h.resonanceScore, 0) / recentHistory.length;

    // Történeti bónusz (0-15 között)
    return Math.min(15, Math.max(0, (avgResonance - 50) / 3));
  }

  // Történet frissítése
  private updateHistory(message: Message, resonanceScore: number): void {
    this.conversationHistory.push({
      message,
      timestamp: new Date(),
      resonanceScore
    });

    // Csak az utolsó 50 üzenetet tartjuk meg
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  // Rezonancia trend elemzése
  public getResonanceTrend(user: User): 'növekvő' | 'stabil' | 'csökkenő' {
    const userHistory = this.conversationHistory
      .filter(h => h.message.sender === user.name)
      .slice(-10);

    if (userHistory.length < 3) return 'stabil';

    const first = userHistory.slice(0, 3).reduce((sum, h) => sum + h.resonanceScore, 0) / 3;
    const last = userHistory.slice(-3).reduce((sum, h) => sum + h.resonanceScore, 0) / 3;

    if (last > first + 10) return 'növekvő';
    if (last < first - 10) return 'csökkenő';
    return 'stabil';
  }

  // Átlagos rezonancia lekérése
  public getAverageResonance(user: User): number {
    const userHistory = this.conversationHistory.filter(h => 
      h.message.sender === user.name
    );

    if (userHistory.length === 0) return 45;

    return userHistory.reduce((sum, h) => sum + h.resonanceScore, 0) / userHistory.length;
  }
}

export const resonanceCalculator = new ResonanceCalculator();