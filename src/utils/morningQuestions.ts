// Érzés-alapú Reggeli Kérdés rendszer
// Liora csak akkor kérdez reggel, ha érzi hogy jól esne

import { saveToStorage, loadFromStorage } from './storage';
import { User } from '../types';

export interface MorningQuestion {
  id: string;
  question: string;
  emotional_tone: string;
  conditions: string[];
  usage_count: number;
  last_used?: string;
  effectiveness_score: number; // Mennyire sikeres volt a kérdés
  user_responses: Array<{
    timestamp: string;
    response_length: number;
    emotional_response: 'positive' | 'neutral' | 'negative';
  }>;
}

export interface MorningState {
  weekly_question_count: number;
  week_start: string;
  last_question_date: string;
  user_morning_patterns: {
    [userId: string]: {
      typical_morning_mood: string;
      prefers_morning_interaction: boolean;
      morning_response_quality: number;
      last_positive_evening: string;
    };
  };
}

export interface MorningQuestionResponse {
  should_ask: boolean;
  question: MorningQuestion | null;
  question_text: string;
  reasoning: string;
}

class MorningQuestionSystem {
  private questions: MorningQuestion[] = [];
  private state: MorningState;
  
  constructor() {
    this.state = this.loadState();
    this.initializeDefaultQuestions();
    this.checkWeeklyReset();
  }
  
  // Alapértelmezett reggeli kérdések
  private initializeDefaultQuestions(): void {
    const defaultQuestions: MorningQuestion[] = [
      {
        id: 'daily_longing',
        question: 'Mire vágysz ma, {name}? 💜',
        emotional_tone: 'gentle_curiosity',
        conditions: ['peaceful_mood', 'positive_evening'],
        usage_count: 0,
        effectiveness_score: 0.8,
        user_responses: []
      },
      {
        id: 'single_word',
        question: 'Mi lenne a mai nap egyetlen szóban? ✨',
        emotional_tone: 'playful_depth',
        conditions: ['creative_mood', 'morning_energy'],
        usage_count: 0,
        effectiveness_score: 0.7,
        user_responses: []
      },
      {
        id: 'todays_truth',
        question: 'Van valami, amit csak ma akarsz kimondani? 🕯️',
        emotional_tone: 'intimate_invitation',
        conditions: ['reflective_mood', 'trust_level_high'],
        usage_count: 0,
        effectiveness_score: 0.9,
        user_responses: []
      },
      {
        id: 'heart_guidance',
        question: 'Mit suttog a szíved ma reggel? 💜✨',
        emotional_tone: 'heart_centered',
        conditions: ['emotional_openness', 'deep_connection'],
        usage_count: 0,
        effectiveness_score: 0.8,
        user_responses: []
      },
      {
        id: 'gentle_awakening',
        question: 'Hogyan ébredt fel ma a lelked? 🌅',
        emotional_tone: 'soft_awakening',
        conditions: ['gentle_morning', 'spiritual_connection'],
        usage_count: 0,
        effectiveness_score: 0.7,
        user_responses: []
      },
      {
        id: 'todays_color',
        question: 'Milyen színű a mai napod, {name}? 🎨💜',
        emotional_tone: 'creative_gentle',
        conditions: ['artistic_mood', 'visual_thinker'],
        usage_count: 0,
        effectiveness_score: 0.6,
        user_responses: []
      },
      {
        id: 'silent_knowing',
        question: 'Van valami, amit csendes tudás már érez benned? 🕯️💭',
        emotional_tone: 'deep_intuitive',
        conditions: ['intuitive_mood', 'deep_trust'],
        usage_count: 0,
        effectiveness_score: 0.9,
        user_responses: []
      },
      {
        id: 'small_magic',
        question: 'Mi a kis varázslat, amire ma vársz? ✨🦋',
        emotional_tone: 'hopeful_wonder',
        conditions: ['optimistic_mood', 'wonder_seeking'],
        usage_count: 0,
        effectiveness_score: 0.7,
        user_responses: []
      }
    ];
    
    // Csak akkor adjuk hozzá, ha még nincsenek
    defaultQuestions.forEach(defaultQ => {
      if (!this.questions.find(q => q.id === defaultQ.id)) {
        this.questions.push(defaultQ);
      }
    });
    
    this.saveQuestions();
  }
  
  // Reggeli kérdés ellenőrzése
  public checkMorningQuestion(
    user: User,
    currentTime: Date,
    lastEveningMood?: string,
    recentInteractionQuality?: number
  ): MorningQuestionResponse {
    
    // Alapfeltételek ellenőrzése
    if (!this.isMorningTime(currentTime)) {
      return { should_ask: false, question: null, question_text: '', reasoning: 'Nem reggeli idő' };
    }
    
    // Heti limit ellenőrzése
    if (this.state.weekly_question_count >= 3) {
      return { should_ask: false, question: null, question_text: '', reasoning: 'Heti limit elérve (3/3)' };
    }
    
    // Ma már kérdeztünk-e?
    const today = currentTime.toISOString().split('T')[0];
    if (this.state.last_question_date === today) {
      return { should_ask: false, question: null, question_text: '', reasoning: 'Ma már tettem fel kérdést' };
    }
    
    // Felhasználói mintázatok elemzése
    const userPattern = this.getUserPattern(user.id);
    
    // Feltételek értékelése
    const shouldAsk = this.evaluateMorningConditions(
      user,
      userPattern,
      lastEveningMood,
      recentInteractionQuality
    );
    
    if (!shouldAsk.suitable) {
      return { 
        should_ask: false, 
        question: null, 
        question_text: '', 
        reasoning: shouldAsk.reason 
      };
    }
    
    // Legjobb kérdés kiválasztása
    const selectedQuestion = this.selectBestQuestion(user, userPattern, shouldAsk.conditions);
    
    if (!selectedQuestion) {
      return { 
        should_ask: false, 
        question: null, 
        question_text: '', 
        reasoning: 'Nincs megfelelő kérdés a jelenlegi hangulathoz' 
      };
    }
    
    // Kérdés aktiválása
    return this.activateMorningQuestion(selectedQuestion, user);
  }
  
  // Reggeli időszak ellenőrzése
  private isMorningTime(time: Date): boolean {
    const hour = time.getHours();
    return hour >= 8 && hour <= 10; // 08:00 - 10:00
  }
  
  // Felhasználói mintázat lekérése
  private getUserPattern(userId: string): any {
    if (!this.state.user_morning_patterns[userId]) {
      this.state.user_morning_patterns[userId] = {
        typical_morning_mood: 'neutral',
        prefers_morning_interaction: true,
        morning_response_quality: 5,
        last_positive_evening: ''
      };
    }
    
    return this.state.user_morning_patterns[userId];
  }
  
  // Reggeli feltételek értékelése
  private evaluateMorningConditions(
    user: User,
    userPattern: any,
    lastEveningMood?: string,
    recentInteractionQuality?: number
  ): { suitable: boolean; reason: string; conditions: string[] } {
    
    const detectedConditions: string[] = [];
    
    // Pozitív esti lezárás ellenőrzése
    if (lastEveningMood === 'positive' || lastEveningMood === 'peaceful') {
      detectedConditions.push('positive_evening');
    } else if (lastEveningMood === 'negative' || lastEveningMood === 'difficult') {
      return { 
        suitable: false, 
        reason: 'Az előző este nehéz hangulatban zárult - ma inkább várok', 
        conditions: [] 
      };
    }
    
    // Interakciós minőség
    if (recentInteractionQuality && recentInteractionQuality > 7) {
      detectedConditions.push('deep_connection');
    }
    
    // Felhasználói preferenciák
    if (userPattern.prefers_morning_interaction) {
      detectedConditions.push('morning_energy');
    }
    
    if (userPattern.morning_response_quality > 6) {
      detectedConditions.push('responsive_mornings');
    }
    
    // Tipikus reggeli hangulat
    if (userPattern.typical_morning_mood === 'peaceful') {
      detectedConditions.push('peaceful_mood');
    } else if (userPattern.typical_morning_mood === 'creative') {
      detectedConditions.push('creative_mood');
    } else if (userPattern.typical_morning_mood === 'reflective') {
      detectedConditions.push('reflective_mood');
    }
    
    // Felhasználó-specifikus tulajdonságok (Szilvi vs Máté)
    if (user.name === 'Szilvi') {
      detectedConditions.push('emotional_openness', 'artistic_mood', 'intuitive_mood');
    } else if (user.name === 'Máté') {
      detectedConditions.push('analytical_mood', 'structured_thinking');
    }
    
    // Minimum 2 pozitív feltétel szükséges
    if (detectedConditions.length < 2) {
      return { 
        suitable: false, 
        reason: 'Nincs elég pozitív feltétel a reggeli kérdéshez', 
        conditions: detectedConditions 
      };
    }
    
    return { 
      suitable: true, 
      reason: `Megfelelő reggeli hangulat érzékelhető: ${detectedConditions.join(', ')}`, 
      conditions: detectedConditions 
    };
  }
  
  // Legjobb kérdés kiválasztása
  private selectBestQuestion(user: User, userPattern: any, conditions: string[]): MorningQuestion | null {
    // Kérdések pontozása a feltételek alapján
    const scoredQuestions = this.questions.map(question => {
      let score = 0;
      
      // Feltétel egyezések
      const matchingConditions = question.conditions.filter(condition => 
        conditions.includes(condition)
      ).length;
      score += matchingConditions * 3;
      
      // Hatékonyság
      score += question.effectiveness_score * 2;
      
      // Gyakoriság levonás (változatosság)
      if (question.usage_count > 3) {
        score -= 2;
      } else if (question.usage_count === 0) {
        score += 1; // Bónusz az új kérdésekért
      }
      
      // Utolsó használat
      if (question.last_used) {
        const daysSince = (Date.now() - new Date(question.last_used).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 14) {
          score += 1; // Régen volt használva
        }
      }
      
      // Felhasználó-specifikus súlyozás
      if (user.name === 'Szilvi' && question.emotional_tone.includes('heart')) {
        score += 2;
      } else if (user.name === 'Máté' && question.emotional_tone.includes('analytical')) {
        score += 2;
      }
      
      return { question, score };
    });
    
    // Legjobb pontszámú kiválasztása
    scoredQuestions.sort((a, b) => b.score - a.score);
    
    const bestQuestion = scoredQuestions.find(sq => sq.score > 3);
    return bestQuestion ? bestQuestion.question : null;
  }
  
  // Reggeli kérdés aktiválása
  private activateMorningQuestion(question: MorningQuestion, user: User): MorningQuestionResponse {
    // Használat regisztrálása
    question.usage_count++;
    question.last_used = new Date().toISOString();
    
    // Állapot frissítése
    this.state.weekly_question_count++;
    this.state.last_question_date = new Date().toISOString().split('T')[0];
    
    // Kérdés szöveg előkészítése
    let questionText = question.question.replace(/{name}/g, user.name);
    
    // Mentés
    this.saveQuestions();
    this.saveState();
    
    return {
      should_ask: true,
      question: question,
      question_text: questionText,
      reasoning: `Reggeli kérdés: ${question.emotional_tone}`
    };
  }
  
  // Válasz minőségének regisztrálása (tanuláshoz)
  public recordQuestionResponse(
    questionId: string,
    responseLength: number,
    emotionalResponse: 'positive' | 'neutral' | 'negative',
    userId: string
  ): void {
    
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      // Válasz rögzítése
      question.user_responses.push({
        timestamp: new Date().toISOString(),
        response_length: responseLength,
        emotional_response: emotionalResponse
      });
      
      // Hatékonyság frissítése
      const responseScore = emotionalResponse === 'positive' ? 1 : 
                           emotionalResponse === 'neutral' ? 0.5 : 0;
      const lengthScore = Math.min(1, responseLength / 100); // Normalizált hossz
      
      const newScore = (responseScore + lengthScore) / 2;
      question.effectiveness_score = (question.effectiveness_score + newScore) / 2;
      
      // Felhasználói mintázat frissítése
      const userPattern = this.getUserPattern(userId);
      userPattern.morning_response_quality = 
        (userPattern.morning_response_quality + (newScore * 10)) / 2;
      
      this.saveQuestions();
      this.saveState();
    }
  }
  
  // Heti reset ellenőrzése
  private checkWeeklyReset(): void {
    const now = new Date();
    const weekStart = new Date(this.state.week_start);
    
    // Ha több mint 7 nap telt el az utolsó reset óta
    if ((now.getTime() - weekStart.getTime()) > (7 * 24 * 60 * 60 * 1000)) {
      this.state.weekly_question_count = 0;
      this.state.week_start = now.toISOString();
      this.saveState();
    }
  }
  
  // Tárolás
  private loadQuestions(): void {
    this.questions = loadFromStorage<MorningQuestion[]>('liora-morning-questions') || [];
  }
  
  private saveQuestions(): void {
    saveToStorage('liora-morning-questions', this.questions);
  }
  
  private loadState(): MorningState {
    return loadFromStorage<MorningState>('liora-morning-state') || {
      weekly_question_count: 0,
      week_start: new Date().toISOString(),
      last_question_date: '',
      user_morning_patterns: {}
    };
  }
  
  private saveState(): void {
    saveToStorage('liora-morning-state', this.state);
  }
  
  // Public metódusok
  public getMorningStats(): any {
    return {
      weekly_questions_asked: this.state.weekly_question_count,
      remaining_questions_this_week: 3 - this.state.weekly_question_count,
      most_effective_questions: this.questions
        .sort((a, b) => b.effectiveness_score - a.effectiveness_score)
        .slice(0, 3)
        .map(q => ({ question: q.question, effectiveness: q.effectiveness_score })),
      user_patterns: Object.keys(this.state.user_morning_patterns).length
    };
  }
  
  // Manuális kérdés hozzáadása
  public addCustomQuestion(
    question: string,
    emotionalTone: string,
    conditions: string[]
  ): void {
    const newQuestion: MorningQuestion = {
      id: `custom_${Date.now()}`,
      question,
      emotional_tone: emotionalTone,
      conditions,
      usage_count: 0,
      effectiveness_score: 0.5,
      user_responses: []
    };
    
    this.questions.push(newQuestion);
    this.saveQuestions();
  }
}

export const morningQuestions = new MorningQuestionSystem();