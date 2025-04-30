import 'dotenv/config';
import { AmadeusAgent } from './mastra/agents/amadeus-agent';
import { weatherTool } from './mastra/tools/weather-tool';
import { getAirportName } from './mastra/utils/airport-codes';
import { getAirlineName } from './mastra/utils/airline-codes';
import { FlightOffer, FlightSegment } from './mastra/types/flight';

// コマンドライン引数を取得
const args = process.argv.slice(2);
const mode = args[0] || 'flights'; // デフォルトはflights

// 環境変数からAPIキーを取得
const apiKey = process.env.AMADEUS_API_KEY;
const apiSecret = process.env.AMADEUS_API_SECRET;

function formatFlightOffer(offer: FlightOffer): string {
  const originName = getAirportName(offer.segments[0].departureAirport) || offer.segments[0].departureAirport;
  const destinationName = getAirportName(offer.segments[offer.segments.length - 1].arrivalAirport) || offer.segments[offer.segments.length - 1].arrivalAirport;

  // 航空会社情報を整形
  const airlineInfo = offer.segments.map((s: FlightSegment) => {
    const airlineName = getAirlineName(s.airline);
    return `${airlineName} (${s.airline} ${s.flightNumber})`;
  }).join(' → ');

  const formatTime = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  function calculateDuration(departureTime: string, arrivalTime: string): number {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    let minutes = Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60));
    
    // 到着時刻が出発時刻より早い場合は24時間を加算
    if (minutes < 0) {
      minutes += 24 * 60;
    }
    return minutes;
  }

  function formatDuration(duration: string | undefined, departureTime: string, arrivalTime: string): string {
    if (duration) {
      const match = duration.match(/PT(\d+)H(\d+)M/);
      if (match) {
        const [, hours, minutes] = match;
        return `${hours}時間${minutes}分`;
      }
    }
    const minutes = calculateDuration(departureTime, arrivalTime);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}時間${remainingMinutes}分`;
  }

  function calculateConnectionTime(currentSegment: any, nextSegment: any): number {
    const currentArrival = new Date(currentSegment.arrivalTime);
    const nextDeparture = new Date(nextSegment.departureTime);
    return Math.floor((nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60));
  }

  function formatConnectionTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}時間${remainingMinutes}分`;
  }

  // フライト詳細情報を整形
  const flightDetails = offer.segments.map((segment, index) => {
    const departureTime = new Date(segment.departureTime);
    const arrivalTime = new Date(segment.arrivalTime);
    const connectionTime = index < offer.segments.length - 1 
      ? calculateConnectionTime(segment, offer.segments[index + 1])
      : 0;

    let details = `
  ${index + 1}. ${getAirportName(segment.departureAirport)} → ${getAirportName(segment.arrivalAirport)}
     出発: ${formatTime(departureTime)}
     到着: ${formatTime(arrivalTime)}
     所要時間: ${formatDuration(segment.duration, segment.departureTime, segment.arrivalTime)}`;

    if (index < offer.segments.length - 1) {
      const nextSegment = offer.segments[index + 1];
      const nextDepartureTime = new Date(nextSegment.departureTime);
      details += `\n     接続空港: ${getAirportName(segment.arrivalAirport)}
     接続時間: ${formatConnectionTime(connectionTime)}
     次便出発: ${formatTime(nextDepartureTime)}`;
    }

    return details;
  }).join('\n\n');

  return `
✈️ フライト情報:
  出発: ${originName}
  到着: ${destinationName}
  価格: ${offer.price.amount} ${offer.price.currency}
  総所要時間: ${formatDuration(offer.totalDuration, offer.segments[0].departureTime, offer.segments[offer.segments.length - 1].arrivalTime)}
  
  航空会社: ${airlineInfo}

フライト詳細:
${flightDetails}

  予約URL: ${offer.bookingUrl}
  ※ 予約URLはテスト環境のため、実際の予約ページには遷移しません。本番環境では実際の予約ページに遷移します。
`;
}

async function main() {
  try {
    if (mode === 'flights') {
      // フライト検索モード
      if (!apiKey || !apiSecret) {
        console.error('AMADEUS_API_KEYとAMADEUS_API_SECRETを設定してください');
        process.exit(1);
      }

      const origin = args[1] || 'Tokyo';
      const destination = args[2] || 'New York';
      
      // 日付をYYYY-MM-DD形式で処理
      function parseDate(dateStr: string): Date {
        console.log('パースする日付文字列:', dateStr);
        const [year, month, day] = dateStr.split('-').map(Number);
        console.log('パース結果:', { year, month, day });
        const date = new Date(year, month - 1, day);
        console.log('生成されたDateオブジェクト:', date);
        return date;
      }

      function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      // デフォルトの日付を設定（1ヶ月後と2ヶ月後）
      const today = new Date();
      console.log('今日の日付:', today);
      
      const oneMonthLater = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      
      console.log('1ヶ月後の日付:', oneMonthLater);
      console.log('2ヶ月後の日付:', twoMonthsLater);

      const defaultDepartureDate = formatDate(oneMonthLater);
      const defaultReturnDate = formatDate(twoMonthsLater);

      console.log('デフォルトの日付設定:');
      console.log(`出発日: ${defaultDepartureDate}`);
      console.log(`帰路日: ${defaultReturnDate}`);

      let departureDate: Date;
      let returnDate: Date;

      try {
        // 入力された日付またはデフォルト値を使用
        if (args[3]) {
          console.log('出発日が指定されました:', args[3]);
          departureDate = parseDate(args[3]);
        } else {
          console.log('デフォルトの出発日を使用します');
          departureDate = oneMonthLater;
        }

        if (args[4]) {
          console.log('帰路日が指定されました:', args[4]);
          returnDate = parseDate(args[4]);
        } else {
          console.log('デフォルトの帰路日を使用します');
          returnDate = twoMonthsLater;
        }

        // 日付が有効かチェック
        if (isNaN(departureDate.getTime()) || isNaN(returnDate.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (error) {
        console.error('無効な日付形式です。YYYY-MM-DD形式で指定してください。');
        console.error('例: 2025-07-01');
        process.exit(1);
      }

      // 日付の順序をチェック
      if (returnDate < departureDate) {
        console.error('帰路日は出発日より後の日付を指定してください。');
        process.exit(1);
      }

      console.log(`フライトを検索中: ${origin} → ${destination}`);
      console.log(`出発日: ${formatDate(departureDate)} (${departureDate.toLocaleDateString('ja-JP')})`);
      console.log(`帰路日: ${formatDate(returnDate)} (${returnDate.toLocaleDateString('ja-JP')})`);

      const agent = new AmadeusAgent(apiKey, apiSecret);
      
      const searchParams = {
        origin,
        destination,
        departureDate: departureDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        isRoundTrip: true
      };
      
      const results = await agent.searchFlights(searchParams);
      
      if (results.length === 0) {
        console.log('❌ 条件に一致するフライトが見つかりませんでした。');
        return;
      }

      console.log('\n=== 検索結果 ===');
      console.log('※ 価格が安い順、所要時間が短い順に表示しています。\n');
      results.forEach((offer, index) => {
        console.log(formatFlightOffer(offer));
        if (index < results.length - 1) {
          console.log('---');
        }
      });
    } else if (mode === 'weather') {
      // 天気検索モード
      const location = args[1] || 'Tokyo';
      console.log(`🌤️ ${location}の天気を取得中...`);
      
      try {
        const weather = await weatherTool.execute(location);
        console.log('\n=== 天気情報 ===\n');
        console.log(JSON.stringify(weather, null, 2));
      } catch (error) {
        console.error('天気情報の取得に失敗しました:', error instanceof Error ? error.message : String(error));
      }
    } else {
      console.error('無効なモードです。flightsまたはweatherを指定してください。');
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ エラーが発生しました:', error.message);
    } else {
      console.error('❌ 予期せぬエラーが発生しました:', error);
    }
  }
}

main(); 