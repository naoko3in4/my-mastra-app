import express from 'express';
import path from 'path';
import { TravelAdvisor } from './mastra/services/travel-advisor';
import * as dotenv from 'dotenv';
import { getAirportName } from './mastra/utils/airport-codes';
import { getAirlineName } from './mastra/utils/airline-codes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '127.0.0.1';

// APIキーの確認
const apiKey = process.env.AMADEUS_API_KEY;
const apiSecret = process.env.AMADEUS_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('警告: Amadeus APIキーが設定されていません。モックデータが使用されます。');
} else {
  console.log('Amadeus APIキーが設定されています。');
}

// セキュリティ設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const advisor = new TravelAdvisor(
  apiKey || '',
  apiSecret || ''
);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/suggest', async (req, res) => {
  try {
    console.log('受信したフォームデータ:', req.body);
    const { origin, departureDate, returnDate } = req.body;
    
    if (!origin || !departureDate || !returnDate) {
      throw new Error('必須パラメータが不足しています');
    }

    const suggestions = await advisor.suggestDestinations(
      origin,
      departureDate,
      returnDate
    );

    res.render('suggestions', { 
      suggestions,
      origin,
      departureDate,
      returnDate,
      getAirportName,
      getAirlineName
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.render('error', { 
      message: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
    });
  }
});

app.listen(port, hostname, () => {
  console.log(`サーバーが起動しました: http://${hostname}:${port}`);
}); 