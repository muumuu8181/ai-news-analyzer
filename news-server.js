#!/usr/bin/env node

// News analyzer server with Gemini CLI integration
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

const PORT = 8080;
const HOST = 'localhost';

// Get list of HTML files
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

// Gemini CLI analysis function
async function analyzeWithGemini(prompt) {
  return new Promise((resolve, reject) => {
    const command = `echo '${prompt.replace(/'/g, "'\''").substring(0, 3000)}' | gemini-cli chat --model gemini-2.5-flash`;
    
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Gemini CLI Error:', error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.warn('Gemini CLI Warning:', stderr);
      }
      
      resolve(stdout.trim());
    });
  });
}

// Translation function
async function translateWithGemini(text) {
  const prompt = `以下のニュースタイトルを自然な日本語に翻訳してください。翻訳結果のみを返してください：\n\n${text}`;
  return analyzeWithGemini(prompt);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let filePath = '.' + parsedUrl.pathname;
  
  // API endpoints
  // Enhanced Gemini CLI analysis with better error handling
  if (parsedUrl.pathname === '/api/gemini-analyze' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const prompt = data.prompt;
        
        console.log('🤖 Gemini CLI分析開始...');
        console.log('📝 プロンプト長:', prompt.length);
        
        const result = await analyzeWithGemini(prompt);
        console.log('✅ Gemini CLI分析完了');
        console.log('📄 結果長:', result.length);
        
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: true, result }));
      } catch (error) {
        console.error('❌ 分析エラー:', error);
        res.writeHead(500, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }
  
  if (parsedUrl.pathname === '/api/translate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const text = data.text;
        
        console.log('🌍 翻訳開始:', text.substring(0, 50) + '...');
        const result = await translateWithGemini(text);
        console.log('✅ 翻訳完了');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result }));
      } catch (error) {
        console.error('❌ 翻訳エラー:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }
  
  if (filePath === './') {
    // Create index page
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📰 ニュース一覧</title>
    <style>
        body {
            font-family: 'Hiragino Sans', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .news-list {
            display: grid;
            gap: 20px;
        }
        .news-item {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .news-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        }
        .news-item a {
            text-decoration: none;
            color: #2c3e50;
            font-size: 1.2em;
            font-weight: bold;
        }
        .news-item a:hover {
            color: #667eea;
        }
        .news-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .japanese {
            background: linear-gradient(to right, #ff6b6b, #ee5a24);
            color: white;
            padding: 2px 8px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-left: 10px;
        }
        .english {
            background: linear-gradient(to right, #4834d4, #686de0);
            color: white;
            padding: 2px 8px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <h1>📰 保存されたニュース記事</h1>
    <div class="news-list">
        ${htmlFiles.map(file => {
            const isJapanese = file.includes('nhk') || file.includes('asahi') || file.includes('itmedia');
            const displayName = file
                .replace('.html', '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
            return `
            <div class="news-item">
                <a href="/${file}">📄 ${displayName}</a>
                ${isJapanese ? '<span class="japanese">日本語</span>' : '<span class="english">English</span>'}
                <div class="news-meta">
                    📁 ${file} | 📊 ${Math.round(fs.statSync(file).size / 1024)}KB
                </div>
            </div>
            `;
        }).join('')}
    </div>
    <div style="text-align: center; margin-top: 40px; color: #7f8c8d;">
        <p>🌐 サーバー: http://${HOST}:${PORT}</p>
        <p>📱 Termux News Server v1.0</p>
    </div>
</body>
</html>
    `);
    return;
  }
  
  // Serve JSON files
  if (fs.existsSync(filePath) && path.extname(filePath) === '.json') {
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(content);
      }
    });
    return;
  }
  
  // Serve HTML files
  if (fs.existsSync(filePath) && path.extname(filePath) === '.html') {
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content, 'utf-8');
      }
    });
  } else {
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(PORT, () => {
  console.log('━'.repeat(60));
  console.log('🚀 ニュースサーバー起動成功！');
  console.log('━'.repeat(60));
  console.log(`\n📡 サーバーアドレス: http://localhost:${PORT}\n`);
  console.log('🌐 ブラウザで開くには以下のコマンドを実行:');
  console.log(`   termux-open-url "http://localhost:${PORT}"\n`);
  console.log('📱 または手動でブラウザに入力:');
  console.log(`   http://localhost:${PORT}\n`);
  console.log('📰 利用可能なニュース:');
  htmlFiles.forEach(file => {
    console.log(`   • http://localhost:${PORT}/${file}`);
  });
  console.log('\n⏹️  停止するには Ctrl+C を押してください');
  console.log('━'.repeat(60));
});