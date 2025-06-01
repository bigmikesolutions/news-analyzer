# News Analyzer

A TypeScript application that fetches news from RSS feeds, converts them to markdown format, and generates summaries using LLMs (OpenAI or Ollama).

## Features

- Fetches news from multiple RSS feeds
- Converts articles to markdown format
- Caches articles for future reference
- Generates summaries using either OpenAI or Ollama
- Configurable news sources and LLM settings

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- OpenAI API key (if using OpenAI)
- Ollama installed locally (if using Ollama)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# OpenAI API Key (required if using OpenAI)
OPENAI_API_KEY=your-openai-api-key-here

# Ollama Configuration (required if using Ollama)
OLLAMA_BASE_URL=http://localhost:11434

# Application Configuration
CONFIG_PATH=./config.json
```

### News Sources and LLM Configuration

Create a `config.json` file in the root directory with the following structure:

```json
{
  "sources": [
    {
      "name": "Source Name",
      "rssUrl": "RSS Feed URL",
      "maxArticles": 5
    }
  ],
  "llm": {
    "type": "openai", // or "ollama"
    "model": "gpt-3.5-turbo", // or any other model name
    "apiKey": "${OPENAI_API_KEY}", // will be replaced with env variable
    "baseUrl": "${OLLAMA_BASE_URL}" // will be replaced with env variable
  },
  "outputDir": "./output",
  "cacheDir": "./cache"
}
```

## Usage

1. Copy `.env.example` to `.env` and fill in your API keys
2. Update the `config.json` file with your desired news sources and LLM settings
3. Run the application:
```bash
bun start
```

The application will:
1. Fetch articles from the configured RSS feeds
2. Convert them to markdown format and cache them
3. Generate summaries using the configured LLM
4. Save the summaries in the output directory

## Output

- Cached articles are stored in the `cache` directory
- Generated summaries are stored in the `output` directory
- Each summary file is named after its source article with a `-summary` suffix

## License

GNU GENERAL PUBLIC LICENSE
