#!/usr/bin/env node

// Global News Collector - 1日1000件の多言語ニュース収集システム
const { spawn } = require('child_process');
const fs = require('fs');

// Load all news sources
const globalNewsSources = require('./global_news_sources.js');
const additionalSources = require('./additional_sources.js');

// Combine all sources
const allSources = {
  ...globalNewsSources,
  ...additionalSources
};

// Target distribution (1000 articles per day)
const targetDistribution = {
  japanese: 200,
  english: 300,
  chinese: 150,
  russian: 100,
  german: 50,
  french: 50,
  korean: 50,
  others: 100
};

// Statistics tracking
const stats = {
  total: 0,
  byLanguage: {},
  byCategory: {},
  errors: 0,
  startTime: new Date()
};

console.log('🌍 グローバルニュース収集システム起動');
console.log('═'.repeat(70));
console.log(`📅 実行日時: ${new Date().toLocaleString('ja-JP')}`);
console.log(`🎯 目標: 1日1000件の多言語ニュース収集`);
console.log(`📰 対象サイト数: 100+ サイト`);
console.log('═'.repeat(70));

// MCP server setup
const mcpServer = spawn('npx', ['@smithery/mcp-fetch'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let messageId = 1;
let currentSourceIndex = 0;
let currentLanguage = '';
let sourcesArray = [];
let collectedArticles = [];

// Flatten sources into array for processing
function prepareSources() {
  for (const [lang, sources] of Object.entries(allSources)) {
    for (const source of sources) {
      sourcesArray.push({
        ...source,
        language: lang,
        articlesCollected: 0
      });
    }
  }
  
  // Shuffle for balanced collection
  sourcesArray.sort(() => Math.random() - 0.5);
  
  console.log(`\n📊 準備完了: ${sourcesArray.length} サイトから収集開始`);
  console.log('\n🌐 言語別目標:');
  for (const [lang, target] of Object.entries(targetDistribution)) {
    console.log(`  ${lang}: ${target}件`);
  }
  console.log('─'.repeat(70));
}

function sendMessage(message) {
  mcpServer.stdin.write(JSON.stringify(message) + '\n');
}

function collectFromNextSource() {
  if (currentSourceIndex >= sourcesArray.length || stats.total >= 1000) {
    finishCollection();
    return;
  }
  
  const source = sourcesArray[currentSourceIndex];
  currentLanguage = source.language;
  
  // Check if we've reached target for this language
  const langStats = stats.byLanguage[currentLanguage] || 0;
  const langTarget = targetDistribution[currentLanguage] || targetDistribution.others;
  
  if (langStats >= langTarget) {
    currentSourceIndex++;
    setTimeout(collectFromNextSource, 100);
    return;
  }
  
  console.log(`\n🔍 [${currentSourceIndex + 1}/${sourcesArray.length}] ${source.name} (${source.language})`);
  
  const fetchRequest = {
    jsonrpc: "2.0",
    id: ++messageId,
    method: "tools/call",
    params: {
      name: "fetch",
      arguments: {
        url: source.url
      }
    }
  };
  
  sendMessage(fetchRequest);
  currentSourceIndex++;
}

function parseNewsContent(content, source) {
  try {
    const articles = [];
    
    // RSS/XML parsing
    if (content.includes('<?xml') || content.includes('<rss') || content.includes('<feed')) {
      const titleMatches = content.match(/<title[^>]*>(.*?)<\/title>/gi) || [];
      const linkMatches = content.match(/<link[^>]*>(.*?)<\/link>/gi) || [];
      const descMatches = content.match(/<description[^>]*>(.*?)<\/description>/gi) || [];
      const dateMatches = content.match(/<pubDate[^>]*>(.*?)<\/pubDate>/gi) || [];
      
      // Skip first title (feed title)
      for (let i = 1; i < titleMatches.length && i <= 20; i++) {
        const title = titleMatches[i].replace(/<[^>]*>/g, '').trim();
        const link = linkMatches[i] ? linkMatches[i].replace(/<[^>]*>/g, '').trim() : '';
        const desc = descMatches[i] ? descMatches[i].replace(/<[^>]*>/g, '').trim() : '';
        const date = dateMatches[i] ? new Date(dateMatches[i].replace(/<[^>]*>/g, '').trim()) : new Date();
        
        if (title && title.length > 5) {
          articles.push({
            title,
            link,
            description: desc.substring(0, 200),
            date,
            source: source.name,
            language: source.language,
            category: source.category || 'general'
          });
        }
      }
    }
    
    // Update statistics
    const collected = Math.min(articles.length, 
      (targetDistribution[source.language] || targetDistribution.others) - (stats.byLanguage[source.language] || 0));
    
    const articlesToAdd = articles.slice(0, collected);
    collectedArticles.push(...articlesToAdd);
    
    stats.total += articlesToAdd.length;
    stats.byLanguage[source.language] = (stats.byLanguage[source.language] || 0) + articlesToAdd.length;
    
    if (source.category) {
      stats.byCategory[source.category] = (stats.byCategory[source.category] || 0) + articlesToAdd.length;
    }
    
    console.log(`  ✅ 収集: ${articlesToAdd.length}件 (累計: ${stats.total}/1000)`);
    
  } catch (error) {
    console.log(`  ❌ 解析エラー: ${error.message}`);
    stats.errors++;
  }
  
  // Continue to next source
  setTimeout(collectFromNextSource, 1000);
}

function finishCollection() {
  const endTime = new Date();
  const duration = Math.round((endTime - stats.startTime) / 1000);
  
  console.log('\n' + '═'.repeat(70));
  console.log('📊 収集完了統計:');
  console.log('═'.repeat(70));
  console.log(`⏱️  処理時間: ${duration}秒`);
  console.log(`📰 総記事数: ${stats.total}件`);
  console.log(`❌ エラー数: ${stats.errors}件`);
  
  console.log('\n🌍 言語別収集結果:');
  for (const [lang, count] of Object.entries(stats.byLanguage)) {
    const target = targetDistribution[lang] || targetDistribution.others;
    const percentage = ((count / target) * 100).toFixed(1);
    console.log(`  ${lang}: ${count}/${target}件 (${percentage}%)`);
  }
  
  if (Object.keys(stats.byCategory).length > 0) {
    console.log('\n📚 カテゴリ別:');
    for (const [cat, count] of Object.entries(stats.byCategory)) {
      console.log(`  ${cat}: ${count}件`);
    }
  }
  
  // Save collected articles
  saveArticles();
  
  setTimeout(() => mcpServer.kill(), 2000);
}

function saveArticles() {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `global_news_${timestamp}.json`;
  
  const data = {
    metadata: {
      date: new Date().toISOString(),
      totalArticles: stats.total,
      languages: stats.byLanguage,
      categories: stats.byCategory,
      sources: sourcesArray.length
    },
    articles: collectedArticles
  };
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`\n💾 保存完了: ${filename}`);
  console.log(`📊 ファイルサイズ: ${Math.round(fs.statSync(filename).size / 1024)}KB`);
  
  // Create HTML summary
  createHtmlSummary(data);
}

function createHtmlSummary(data) {
  const htmlFilename = `global_news_summary.html`;
  
  const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌍 グローバルニュース ${data.metadata.date}</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
        }
        .language-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .language-header {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        .article {
            border-left: 3px solid #3498db;
            padding-left: 15px;
            margin-bottom: 15px;
        }
        .article-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .article-meta {
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 グローバルニュースサマリー</h1>
        <p>${new Date().toLocaleDateString('ja-JP')} - ${data.metadata.totalArticles}件の記事を収集</p>
    </div>
    
    <div class="stats">
        ${Object.entries(data.metadata.languages).map(([lang, count]) => `
        <div class="stat-card">
            <div class="stat-number">${count}</div>
            <div>${lang}</div>
        </div>
        `).join('')}
    </div>
    
    ${Object.entries(groupArticlesByLanguage(data.articles)).map(([lang, articles]) => `
    <div class="language-section">
        <div class="language-header">📰 ${lang} (${articles.length}件)</div>
        ${articles.slice(0, 10).map(article => `
        <div class="article">
            <div class="article-title">${article.title}</div>
            <div class="article-meta">
                📅 ${new Date(article.date).toLocaleDateString()} | 
                📍 ${article.source}
                ${article.link ? ` | <a href="${article.link}" target="_blank">🔗</a>` : ''}
            </div>
        </div>
        `).join('')}
        ${articles.length > 10 ? `<p>... 他 ${articles.length - 10}件</p>` : ''}
    </div>
    `).join('')}
</body>
</html>`;
  
  fs.writeFileSync(htmlFilename, htmlContent, 'utf8');
  console.log(`📄 HTMLサマリー作成: ${htmlFilename}`);
}

function groupArticlesByLanguage(articles) {
  const grouped = {};
  for (const article of articles) {
    if (!grouped[article.language]) {
      grouped[article.language] = [];
    }
    grouped[article.language].push(article);
  }
  return grouped;
}

// MCP server event handlers
mcpServer.stdout.on('data', (data) => {
  try {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      try {
        const response = JSON.parse(line);
        
        if (response.result && response.result.content) {
          const content = response.result.content[0].text;
          const source = sourcesArray[currentSourceIndex - 1];
          parseNewsContent(content, source);
          
        } else if (response.error) {
          console.log(`  ❌ エラー: ${response.error.message}`);
          stats.errors++;
          setTimeout(collectFromNextSource, 500);
          
        } else if (response.id === 1) {
          console.log('\n🚀 MCPサーバー初期化完了');
          prepareSources();
          setTimeout(collectFromNextSource, 1000);
        }
        
      } catch (e) {
        // Ignore parsing errors
      }
    });
  } catch (e) {
    // Ignore
  }
});

mcpServer.stderr.on('data', (data) => {
  console.log('⚠️ Warning:', data.toString());
});

// Initialize
const initRequest = {
  jsonrpc: "2.0",
  id: messageId,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "global-news-collector", version: "1.0.0" }
  }
};

sendMessage(initRequest);

// Safety timeout (30 minutes max)
setTimeout(() => {
  console.log('\n⏰ タイムアウト - 収集終了');
  finishCollection();
}, 30 * 60 * 1000);