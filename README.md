# 🌍 AI News Analyzer

AI-powered global news aggregation and analysis system with automatic translation and importance scoring.

## ✨ Features

- **🌐 Global News Collection**: Automatically collects 500-1000+ daily news articles from 100+ international sources
- **🔍 AI-Powered Analysis**: Uses Gemini CLI to analyze and score news importance across multiple criteria
- **🌍 Multi-Language Support**: Supports 8+ languages including Japanese, English, Chinese, Russian, German, French, Korean
- **📊 Intelligent Scoring**: 5-category scoring system (Technology, Impact, Urgency, Relevance, Reliability)
- **🎯 Smart Translation**: Automatic Japanese translation with 600-character detailed summaries
- **📋 Auto-Copy**: Translated results automatically copied to clipboard for immediate use
- **📱 Clean UI**: Tabbed interface with overview, detailed analysis, and pagination
- **🔗 Direct Access**: Click-through links to original articles

## 🏗️ Architecture

### Core Components
- **News Collector** (`global_news_collector.js`): Fetches news from RSS/API sources
- **Source Database** (`global_news_sources.js`): 100+ curated news sources worldwide
- **Web Interface** (`simple_all_in_one.html`): Main analysis and translation interface
- **Local Server** (`news-server.js`): Serves files and handles requests

### News Sources Include
- **Research Papers**: ArXiv, PNAS, academic journals
- **Tech News**: TechCrunch, Ars Technica, Wired, Gigazine
- **Global Media**: Reuters, BBC, NHK, CNBC
- **Regional Sources**: Asian, European, and American tech publications
- **Specialized**: IoT, AI, quantum computing, renewable energy

## 🚀 Quick Start

### Prerequisites
- Node.js
- Termux (for Android) or any modern browser
- Gemini CLI (for AI analysis)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/muumuu8181/ai-news-analyzer.git
cd ai-news-analyzer
```

2. **Install dependencies**
```bash
npm install
```

3. **Collect latest news**
```bash
node global_news_collector.js
```

4. **Start the server**
```bash
node news-server.js
```

5. **Open the analyzer**
```bash
# For Termux
termux-open-url "http://localhost:8080/simple_all_in_one.html"

# For desktop
# Open http://localhost:8080/simple_all_in_one.html in your browser
```

## 📖 Usage

### Basic Workflow
1. **📋 View Overview**: Browse all collected articles with pagination (50 per page)
2. **🤖 Run Analysis**: Click "🚀 Gemini CLI Analysis" to score articles by importance
3. **🌍 Auto-Translate**: Click "🌍 Japanese Translation" - results automatically copied to clipboard
4. **📝 Use Results**: Paste (Ctrl+V) the translated summaries anywhere

### Analysis Criteria
Each article is scored 1-10 in these categories:
- **Technology**: Technical innovation level
- **Impact**: Societal/industry impact
- **Urgency**: Time-sensitive importance
- **Relevance**: Current relevance
- **Reliability**: Source credibility

### Translation Features
- Automatic language detection
- Context-aware translations
- 600-character detailed summaries
- Original URLs preserved
- Industry-specific explanations

## 🛠️ Configuration

### Adding News Sources
Edit `global_news_sources.js` to add new RSS feeds:

```javascript
const globalNewsSources = {
  english: [
    { 
      name: "Your News Site", 
      url: "https://example.com/rss", 
      type: "rss" 
    }
  ]
};
```

### Customizing Analysis
Modify the analysis prompts in `simple_all_in_one.html` to adjust AI scoring criteria.

## 📊 Sample Output

```
🌍 重要ニュース日本語要約

1. OpenAI ChatGPTエージェント発表、ウェブブラウジングとPowerPoint作成が可能。
人工知能技術の最新動向について報告。この分野は急速に発展しており、
ビジネスや社会に大きな影響を与えています...
URL: https://example.com/news

2. TSMC熊本第2工場は年内着工、AI関連好調続く。
半導体産業の発展と日本経済への影響が非常に大きい...
URL: https://example.com/news
```

## 🌟 Key Benefits

- **Time Saving**: Processes hundreds of articles in minutes
- **Language Barrier Removal**: Unified Japanese summaries from global sources
- **Quality Filtering**: AI-powered importance scoring
- **Immediate Use**: Auto-copy feature for instant productivity
- **Comprehensive Coverage**: Academic papers to breaking news
- **Offline Capable**: Local server, no cloud dependencies

## 🛡️ Privacy & Security

- **Fully Local**: All processing happens on your device
- **No Data Upload**: News analysis stays private
- **Open Source**: Transparent code for security review
- **No Tracking**: No analytics or user data collection

## 🤝 Contributing

Contributions welcome! Please feel free to:
- Add new news sources
- Improve translation accuracy
- Enhance UI/UX
- Add new languages
- Fix bugs

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Gemini CLI for AI analysis
- Global news publishers for RSS feeds
- Open source community for tools and libraries

---

**⭐ Star this repo if it helps your daily news workflow!**