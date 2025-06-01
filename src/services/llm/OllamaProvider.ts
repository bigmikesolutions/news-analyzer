import { LLMProvider } from './LLMProvider';

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateSummary(content: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt: `Please summarize the following article:\n\n${content}`,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response || 'No summary generated';
  }
} 