import { promises as fs } from 'fs';
import path from 'path';
import { Config, ConfigSchema } from './types/config';
import { FeedReader } from './services/feedReader';
import { LLMProvider } from './services/llm/LLMProvider';
import { LLMProviderFactory } from './services/llm/LLMProviderFactory';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function replaceEnvVariables(config: any): any {
  if (typeof config !== 'object' || config === null) {
    return config;
  }

  if (Array.isArray(config)) {
    return config.map(item => replaceEnvVariables(item));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const envVar = value.slice(2, -1);
      result[key] = process.env[envVar] || value;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = replaceEnvVariables(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function loadConfig(): Promise<Config> {
  const configPath = process.env.CONFIG_PATH || 'config.json';
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configContent);
  const configWithEnv = replaceEnvVariables(config);
  return ConfigSchema.parse(configWithEnv);
}

async function main() {
  try {
    const config = await loadConfig();

    // Ensure directories exist
    await ensureDirectoryExists(config.cacheDir);
    await ensureDirectoryExists(config.outputDir);

    const feedReader = new FeedReader(config.cacheDir);
    const llmProvider = LLMProviderFactory.createProvider(config.llm);

    // Process each source
    for (const source of config.sources) {
      console.log(`Processing source: ${source.name}`);
      
      // Fetch and save articles
      const savedFiles = await feedReader.processSource(source);
      
      // Generate summaries
      for (const file of savedFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const summary = await llmProvider.generateSummary(content);
        const summaryFilename = path.basename(file).replace('.md', '-summary.md');
        const summaryPath = path.join(config.outputDir, summaryFilename);
        
        await fs.writeFile(summaryPath, summary, 'utf-8');
        console.log(`Generated summary for: ${summaryFilename}`);
      }
    }

    console.log('Processing completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
