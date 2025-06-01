import { LLMConfig } from '../../types/config';
import { LLMProvider } from './LLMProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { OllamaProvider } from './OllamaProvider';

export class LLMProviderFactory {
  static createProvider(config: LLMConfig): LLMProvider {
    switch (config.type) {
      case 'openai': {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY environment variable is required');
        }
        return new OpenAIProvider(apiKey, config.model);
      }
      
      case 'ollama': {
        const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        return new OllamaProvider(baseUrl, config.model);
      }
      
      default:
        throw new Error(`Unsupported LLM type: ${config.type}`);
    }
  }
} 