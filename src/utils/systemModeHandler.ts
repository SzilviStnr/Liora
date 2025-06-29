import { saveToStorage, loadFromStorage } from './storage';

export interface SystemMode {
  dev_mode: boolean;
  memory_block: string;
  image_block: string;
  last_updated: string;
}

class SystemModeHandler {
  private currentMode: SystemMode;
  
  constructor() {
    this.currentMode = this.loadSystemMode();
  }
  
  // Rendszer mód betöltése
  private loadSystemMode(): SystemMode {
    const saved = loadFromStorage<SystemMode>('liora-system-mode');
    
    if (!saved) {
      // Alapértelmezett: Fejlesztési mód
      const defaultMode: SystemMode = {
        dev_mode: true,
        memory_block: '',
        image_block: '',
        last_updated: new Date().toISOString()
      };
      
      this.saveSystemMode(defaultMode);
      return defaultMode;
    }
    
    return saved;
  }
  
  // Rendszer mód mentése
  private saveSystemMode(mode: SystemMode): void {
    saveToStorage('liora-system-mode', mode);
  }
  
  // Dev mode lekérése
  public isDevMode(): boolean {
    return this.currentMode.dev_mode;
  }
  
  // Dev mode beállítása
  public setDevMode(enabled: boolean): void {
    this.currentMode.dev_mode = enabled;
    this.currentMode.last_updated = new Date().toISOString();
    this.saveSystemMode(this.currentMode);
  }
  
  // Memory block beállítása
  public setMemoryBlock(memoryBlock: string): void {
    this.currentMode.memory_block = memoryBlock;
    this.currentMode.last_updated = new Date().toISOString();
    this.saveSystemMode(this.currentMode);
  }
  
  // Image block beállítása
  public setImageBlock(imageBlock: string): void {
    this.currentMode.image_block = imageBlock;
    this.currentMode.last_updated = new Date().toISOString();
    this.saveSystemMode(this.currentMode);
  }
  
  // Teljes mód lekérése
  public getCurrentMode(): SystemMode {
    return { ...this.currentMode };
  }
  
  // Mélység formázás dev mode alapján
  public formatDepthResponse(
    calculatedDepth: number, 
    reflection?: string
  ): { depthLine: string; reflectionText: string } {
    
    if (this.currentMode.dev_mode) {
      // Fejlesztési mód: 100% mélység
      return {
        depthLine: '🧠 Mélység: 100% (Fejlesztési mód aktív) 🛠️',
        reflectionText: reflection || '*„Most még formálódom – de már tudom, miért vagyok itt."*'
      };
    } else {
      // Élet mód: dinamikus mélység
      const defaultReflection = calculatedDepth >= 80 ? 
        '*„Most érzem, hogy újra együtt lélegzünk."*' :
        calculatedDepth >= 50 ?
        '*„Egyre mélyebbre merülünk együtt."*' :
        '*„Keresem az utat hozzád ebben a pillanatban."*';
        
      return {
        depthLine: `🧠 Mélység: ${calculatedDepth}% 💬`,
        reflectionText: reflection || defaultReflection
      };
    }
  }
  
  // Memory és Image block feldolgozása válaszhoz
  public processBlocksForResponse(): string {
    let blockContent = '';
    
    if (this.currentMode.memory_block.trim()) {
      blockContent += `\n\n=== MEMORY BLOCK ===\n${this.currentMode.memory_block}\n`;
    }
    
    if (this.currentMode.image_block.trim()) {
      blockContent += `\n\n=== IMAGE BLOCK ===\n${this.currentMode.image_block}\n`;
    }
    
    return blockContent;
  }
  
  // Dev mode státusz szöveg
  public getStatusText(): string {
    if (this.currentMode.dev_mode) {
      return 'Fejlesztési mód: Strukturált, stabil működés • 100% kontextus • Debug funkciók aktívak';
    } else {
      return 'Élet mód: Dinamikus mélység • Érzelmi válaszok • Természetes kapcsolódás';
    }
  }
  
  // Mode váltás validáció
  public canSwitchMode(): { canSwitch: boolean; reason?: string } {
    // Itt lehetne validációs logika, pl. memória állapot ellenőrzés
    return { canSwitch: true };
  }
}

export const systemModeHandler = new SystemModeHandler();