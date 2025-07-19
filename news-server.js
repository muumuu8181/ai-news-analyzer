#!/usr/bin/env node

// Simple web server for viewing local HTML files
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HOST = 'localhost';

// Get list of HTML files
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  
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