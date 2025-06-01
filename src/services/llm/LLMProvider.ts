export interface LLMProvider {
  generateSummary(content: string): Promise<string>;
} 