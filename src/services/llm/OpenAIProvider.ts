import OpenAI from 'openai';
import { LLMProvider } from './LLMProvider';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
      apiKey,
    });
    this.model = model;
  }

  async generateSummary(content: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes news articles. Provide a concise summary of the main points.',
        },
        {
          role: 'user',
          content: `Please summarize the following article:\n\n${content}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || 'No summary generated';
  }
} 