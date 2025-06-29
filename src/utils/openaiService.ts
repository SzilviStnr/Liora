import { loadFromStorage } from './storage';

export interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private getApiKey(): string | null {
    return loadFromStorage<string>('liora-openai-api-key');
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API kulcs nincs beállítva. Kérlek add meg a beállításokban.');
    }

    return this.createChatCompletionWithRetry(request, apiKey);
  }

  private async createChatCompletionWithRetry(
    request: ChatCompletionRequest, 
    apiKey: string, 
    retryCount: number = 0
  ): Promise<string> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: request.model || 'gpt-3.5-turbo',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Hibás API kulcs. Kérlek ellenőrizd a beállításokban.');
        } else if (response.status === 429) {
          // Rate limit error - implement retry with exponential backoff
          if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.createChatCompletionWithRetry(request, apiKey, retryCount + 1);
          } else {
            throw new Error('API limit túllépve. Próbáld meg később.');
          }
        } else if (response.status === 402) {
          throw new Error('Nincs elegendő kredited az OpenAI fiókodban.');
        } else {
          throw new Error(`OpenAI API hiba: ${errorData.error?.message || 'Ismeretlen hiba'}`);
        }
      }

      const data: ChatCompletionResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Nem érkezett válasz az OpenAI-tól');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      // If it's a rate limit error and we haven't exhausted retries, try again
      if (error instanceof Error && error.message.includes('Failed to fetch') && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.createChatCompletionWithRetry(request, apiKey, retryCount + 1);
      }
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Hálózati hiba történt az OpenAI API hívásakor');
      }
    }
  }

  isConfigured(): boolean {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey.startsWith('sk-');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.createChatCompletion({
        messages: [
          { role: 'user', content: 'Teszt' }
        ],
        max_tokens: 5
      });
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export const openaiService = new OpenAIService();