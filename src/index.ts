import 'dotenv/config';
import { AmadeusAgent } from './mastra/agents/amadeus-agent.js';
import { weatherTool } from './mastra/tools/weather-tool.js';

// コマンドライン引数を取得
const args = process.argv.slice(2);
const mode = args[0] || 'flights'; // デフォルトはflights

// 環境変数からAPIキーを取得
const apiKey = process.env.AMADEUS_API_KEY;
const apiSecret = process.env.AMADEUS_API_SECRET;

async function main() {
  try {
    if (mode === 'flights') {
      // フライト検索モード
      if (!apiKey || !apiSecret) {
        console.error('AMADEUS_API_KEYとAMADEUS_API_SECRETを設定してください');
        process.exit(1);
      }

      const agent = new AmadeusAgent(apiKey, apiSecret);
      
      const searchParams = {
        origin: 'HND',
        destination: 'JFK',
        departureDate: new Date('2025-07-01'),
        returnDate: new Date('2025-07-15'),
        isRoundTrip: true
      };
      
      const results = await agent.searchFlights(searchParams);
      console.log('検索結果:', JSON.stringify(results, null, 2));
    } else if (mode === 'weather') {
      // 天気検索モード
      const location = args[1] || 'Tokyo';
      console.log(`${location}の天気を検索中...`);
      
      try {
        const weather = await weatherTool.execute(location);
        console.log('天気情報:', JSON.stringify(weather, null, 2));
      } catch (error) {
        console.error('天気情報の取得に失敗しました:', error instanceof Error ? error.message : String(error));
      }
    } else {
      console.error('無効なモードです。flightsまたはweatherを指定してください。');
      process.exit(1);
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main(); 