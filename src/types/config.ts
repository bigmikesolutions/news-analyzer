import { z } from 'zod';

export const NewsSourceSchema = z.object({
  name: z.string(),
  rssUrl: z.string().url(),
  maxArticles: z.number().min(1).default(10),
});

export const LLMConfigSchema = z.object({
  type: z.enum(['openai', 'ollama']),
  model: z.string(),
});

export const ConfigSchema = z.object({
  sources: z.array(NewsSourceSchema),
  llm: LLMConfigSchema,
  outputDir: z.string(),
  cacheDir: z.string(),
});

export type NewsSource = z.infer<typeof NewsSourceSchema>;
export type LLMConfig = z.infer<typeof LLMConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>; 