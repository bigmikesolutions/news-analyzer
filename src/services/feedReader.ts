import Parser from 'rss-parser';
import { NewsSource } from '../types/config';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const parser = new Parser();

export interface Article {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  source: string;
}

export class FeedReader {
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  async fetchArticles(source: NewsSource): Promise<Article[]> {
    const feed = await parser.parseURL(source.rssUrl);
    const articles: Article[] = [];

    for (const item of feed.items.slice(0, source.maxArticles)) {
      const article: Article = {
        title: item.title || '',
        link: item.link || '',
        content: item.content || item.contentSnippet || '',
        pubDate: item.pubDate || new Date().toISOString(),
        source: source.name,
      };

      articles.push(article);
    }

    return articles;
  }

  async saveToMarkdown(article: Article): Promise<string> {
    const filename = `${article.source}-${article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}.md`;
    const filepath = path.join(this.cacheDir, filename);

    const markdown = `# ${article.title}

Source: ${article.source}
Date: ${article.pubDate}
Link: ${article.link}

${article.content}
`;

    await fs.writeFile(filepath, markdown, 'utf-8');
    return filepath;
  }

  async processSource(source: NewsSource): Promise<string[]> {
    const articles = await this.fetchArticles(source);
    const savedFiles: string[] = [];

    for (const article of articles) {
      const filepath = await this.saveToMarkdown(article);
      savedFiles.push(filepath);
    }

    return savedFiles;
  }
} 