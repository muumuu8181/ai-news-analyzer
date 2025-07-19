#!/usr/bin/env node

// Global News Sources - 100+ sites from around the world
// 目標: 1日1000件の多言語ニュース収集

const globalNewsSources = {
  // 日本語ソース (目標: 200件/日)
  japanese: [
    // ニュース
    { name: "NHKニュース", url: "https://www3.nhk.or.jp/rss/news/cat0.xml", type: "rss" },
    { name: "朝日新聞", url: "https://www.asahi.com/rss/asahi/newsheadlines.rdf", type: "rss" },
    { name: "読売新聞", url: "https://www.yomiuri.co.jp/rss/", type: "rss" },
    { name: "日経新聞", url: "https://www.nikkei.com/rss/news.rdf", type: "rss" },
    { name: "毎日新聞", url: "https://mainichi.jp/rss/etc/mainichi-flash.rss", type: "rss" },
    
    // 技術系
    { name: "ITmedia", url: "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml", type: "rss" },
    { name: "CNET Japan", url: "https://feeds.japan.cnet.com/rss/cnet/all.rdf", type: "rss" },
    { name: "TechCrunch Japan", url: "https://jp.techcrunch.com/feed/", type: "rss" },
    { name: "Gigazine", url: "https://gigazine.net/news/rss_2.0/", type: "rss" },
    { name: "週刊アスキー", url: "https://weekly.ascii.jp/cate/1/rss.xml", type: "rss" },
    
    // 科学系
    { name: "科学新聞", url: "https://sci-news.co.jp/feed/", type: "rss" },
    { name: "日本の研究.com", url: "https://research-er.jp/rss", type: "rss" },
    { name: "JST Science Portal", url: "https://scienceportal.jst.go.jp/rss/news.xml", type: "rss" },
  ],
  
  // 英語ソース (目標: 300件/日)
  english: [
    // 論文・研究
    { name: "ArXiv CS", url: "http://arxiv.org/rss/cs", type: "rss", category: "論文" },
    { name: "ArXiv Physics", url: "http://arxiv.org/rss/physics", type: "rss", category: "論文" },
    { name: "ArXiv Math", url: "http://arxiv.org/rss/math", type: "rss", category: "論文" },
    { name: "ArXiv Biology", url: "http://arxiv.org/rss/q-bio", type: "rss", category: "論文" },
    { name: "Nature RSS", url: "https://www.nature.com/nature.rss", type: "rss", category: "論文" },
    { name: "Science Magazine", url: "https://www.science.org/rss/news_current.xml", type: "rss", category: "論文" },
    { name: "PLOS ONE", url: "https://journals.plos.org/plosone/feed/", type: "rss", category: "論文" },
    { name: "bioRxiv", url: "https://connect.biorxiv.org/biorxiv_xml.php?subject=all", type: "rss", category: "論文" },
    
    // 技術ニュース
    { name: "Hacker News", url: "https://hnrss.org/frontpage", type: "rss" },
    { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", type: "rss" },
    { name: "IEEE Spectrum", url: "https://spectrum.ieee.org/feeds/feed.rss", type: "rss" },
    { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/technology-lab", type: "rss" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", type: "rss" },
    { name: "Wired", url: "https://www.wired.com/feed/rss", type: "rss" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/", type: "rss" },
    { name: "AnandTech", url: "https://www.anandtech.com/rss/", type: "rss" },
    
    // エネルギー・環境
    { name: "Energy.gov", url: "https://www.energy.gov/rss/news.xml", type: "rss" },
    { name: "Renewable Energy World", url: "https://www.renewableenergyworld.com/feed/", type: "rss" },
    { name: "CleanTechnica", url: "https://cleantechnica.com/feed/", type: "rss" },
    
    // AI・ML
    { name: "OpenAI Blog", url: "https://openai.com/blog/rss/", type: "rss" },
    { name: "Google AI Blog", url: "https://ai.googleblog.com/feeds/posts/default", type: "rss" },
    { name: "DeepMind Blog", url: "https://deepmind.com/blog/feed/basic/", type: "rss" },
    { name: "Machine Learning Reddit", url: "https://www.reddit.com/r/MachineLearning/.rss", type: "rss" },
  ],
  
  // 中国語ソース (目標: 150件/日)
  chinese: [
    // 技術系
    { name: "36氪", url: "https://36kr.com/feed", type: "rss" },
    { name: "极客公园", url: "https://www.geekpark.net/rss", type: "rss" },
    { name: "虎嗅网", url: "https://www.huxiu.com/rss/0.xml", type: "rss" },
    { name: "少数派", url: "https://sspai.com/feed", type: "rss" },
    { name: "爱范儿", url: "https://www.ifanr.com/feed", type: "rss" },
    
    // 科学系
    { name: "科学网", url: "http://news.sciencenet.cn/xml/news.aspx", type: "rss" },
    { name: "中科院", url: "http://www.cas.cn/rss/kydt.xml", type: "rss" },
    { name: "果壳网", url: "https://www.guokr.com/rss/", type: "rss" },
    
    // AI/技術
    { name: "机器之心", url: "https://www.jiqizhixin.com/rss", type: "rss" },
    { name: "量子位", url: "https://www.qbitai.com/rss", type: "rss" },
  ],
  
  // ロシア語ソース (目標: 100件/日)
  russian: [
    // 技術系
    { name: "Habr", url: "https://habr.com/ru/rss/all/all/", type: "rss" },
    { name: "N+1", url: "https://nplus1.ru/rss", type: "rss" },
    { name: "3DNews", url: "https://3dnews.ru/news/rss", type: "rss" },
    { name: "Hi-Tech Mail.ru", url: "https://hi-tech.mail.ru/rss/all/", type: "rss" },
    { name: "CNews", url: "https://www.cnews.ru/inc/rss/news.xml", type: "rss" },
    
    // 科学系
    { name: "Элементы", url: "https://elementy.ru/rss/news", type: "rss" },
    { name: "Наука и жизнь", url: "https://www.nkj.ru/rss/", type: "rss" },
    { name: "Индикатор", url: "https://indicator.ru/rss", type: "rss" },
  ],
  
  // ドイツ語ソース (目標: 100件/日)
  german: [
    { name: "Heise", url: "https://www.heise.de/rss/heise-atom.xml", type: "rss" },
    { name: "Golem", url: "https://rss.golem.de/rss.php?feed=RSS2.0", type: "rss" },
    { name: "t3n", url: "https://t3n.de/rss.xml", type: "rss" },
    { name: "Spektrum", url: "https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406", type: "rss" },
    { name: "Max Planck", url: "https://www.mpg.de/rss", type: "rss" },
  ],
  
  // フランス語ソース (目標: 50件/日)
  french: [
    { name: "Le Monde Tech", url: "https://www.lemonde.fr/sciences/rss_full.xml", type: "rss" },
    { name: "CNRS", url: "https://www.cnrs.fr/fr/rss/actualites", type: "rss" },
    { name: "Futura Sciences", url: "https://www.futura-sciences.com/rss/actualites.xml", type: "rss" },
    { name: "01net", url: "https://www.01net.com/rss/actualites/", type: "rss" },
  ],
  
  // 韓国語ソース (目標: 50件/日) 
  korean: [
    { name: "ZDNet Korea", url: "https://zdnet.co.kr/news/rss.xml", type: "rss" },
    { name: "Bloter", url: "https://www.bloter.net/feed", type: "rss" },
    { name: "IT Chosun", url: "http://it.chosun.com/site/data/rss/rss.xml", type: "rss" },
  ],
  
  // その他の言語 (目標: 50件/日)
  others: [
    // スペイン語
    { name: "Xataka", url: "https://www.xataka.com/feedburner.xml", type: "rss", lang: "es" },
    { name: "ComputerHoy", url: "https://computerhoy.com/feed", type: "rss", lang: "es" },
    
    // イタリア語
    { name: "Punto Informatico", url: "https://www.punto-informatico.it/feed/", type: "rss", lang: "it" },
    
    // ポルトガル語
    { name: "Tecnoblog", url: "https://tecnoblog.net/feed/", type: "rss", lang: "pt" },
    
    // アラビア語
    { name: "AITnews", url: "https://aitnews.com/feed/", type: "rss", lang: "ar" },
  ]
};

// 統計情報
function getStatistics() {
  let total = 0;
  const stats = {};
  
  for (const [lang, sources] of Object.entries(globalNewsSources)) {
    stats[lang] = sources.length;
    total += sources.length;
  }
  
  console.log('📊 グローバルニュースソース統計:');
  console.log('─'.repeat(50));
  console.log(`📰 総サイト数: ${total} サイト`);
  console.log('');
  console.log('🌍 言語別内訳:');
  for (const [lang, count] of Object.entries(stats)) {
    const percentage = ((count / total) * 100).toFixed(1);
    console.log(`  ${lang}: ${count}サイト (${percentage}%)`);
  }
  console.log('');
  console.log('🎯 1日の目標記事数: 1,000件');
  console.log('  日本語: 200件');
  console.log('  英語: 300件');
  console.log('  中国語: 150件');
  console.log('  ロシア語: 100件');
  console.log('  その他: 250件');
  console.log('─'.repeat(50));
}

// Export for use in other scripts
module.exports = globalNewsSources;

// If run directly, show statistics
if (require.main === module) {
  getStatistics();
}