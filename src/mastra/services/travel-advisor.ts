import { AmadeusAgent } from '../agents/amadeus-agent';
import { weatherTool } from '../tools/weather-tool';
import { findDestinationsByWeather, findDestinationByCity, Destination } from '../utils/destinations';
import { getAirportCode } from '../utils/airport-codes';
import { FlightOffer } from '../types/flight';

interface WeatherInfo {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  conditions: string;
  location: string;
}

interface TravelSuggestion {
  destination: string;
  destinationJa: string;
  description: string;
  weather: WeatherInfo;
  flight: {
    price: {
      amount: number;
      currency: string;
    };
    duration: string;
    airline: string;
  };
  score: number;
}

// モックフライトデータ
const mockFlights: Record<string, FlightOffer[]> = {
  'Paris': [{
    id: 'mock-paris-1',
    price: {
      amount: '120000',
      currency: 'JPY'
    },
    segments: [{
      departureAirport: 'HND',
      arrivalAirport: 'CDG',
      departureTime: '2025-05-01T10:00:00',
      arrivalTime: '2025-05-01T16:30:00',
      duration: 'PT6H30M',
      airline: 'AF',
      flightNumber: 'AF293'
    }],
    bookingUrl: 'https://example.com/booking/mock-paris-1',
    totalDuration: 'PT12H30M'
  }],
  'Seoul': [{
    id: 'mock-seoul-1',
    price: {
      amount: '80000',
      currency: 'JPY'
    },
    segments: [{
      departureAirport: 'HND',
      arrivalAirport: 'ICN',
      departureTime: '2025-05-01T09:00:00',
      arrivalTime: '2025-05-01T11:30:00',
      duration: 'PT2H30M',
      airline: 'KE',
      flightNumber: 'KE702'
    }],
    bookingUrl: 'https://example.com/booking/mock-seoul-1',
    totalDuration: 'PT2H30M'
  }]
};

export class TravelAdvisor {
  private amadeusAgent: AmadeusAgent;
  private useMockData: boolean = false;

  constructor(apiKey: string, apiSecret: string) {
    this.amadeusAgent = new AmadeusAgent(apiKey, apiSecret);
    // APIキーが無効な場合はモックデータを使用
    if (!apiKey || !apiSecret || apiKey.trim() === '' || apiSecret.trim() === '') {
      console.log('APIキーが設定されていないため、モックデータを使用します');
      this.useMockData = true;
    } else {
      console.log('APIキーが設定されています。実際のAPIを使用します。');
    }
  }

  private calculateScore(price: number, duration: number, weather: WeatherInfo): number {
    // 価格、所要時間、天気を考慮してスコアを計算
    const priceScore = 1 - (price / 300000); // 30万円を基準
    const durationScore = 1 - (duration / (24 * 60)); // 24時間を基準
    const weatherScore = (weather.temperature >= 20 && weather.temperature <= 28) ? 1 : 0.5;
    
    return (priceScore * 0.4) + (durationScore * 0.3) + (weatherScore * 0.3);
  }

  async suggestDestinations(origin: string, departureDate: string, returnDate: string): Promise<TravelSuggestion[]> {
    const suggestions: TravelSuggestion[] = [];
    const originCode = getAirportCode(origin);
    
    if (!originCode) {
      throw new Error(`出発地 ${origin} の空港が見つかりません。`);
    }

    // 候補となる目的地の天気を確認
    const weatherPromises = findDestinationsByWeather(20, 30).map(async (dest: Destination) => {
      try {
        const weather = await weatherTool.execute(dest.city);
        const destCode = getAirportCode(dest.city);
        
        if (!destCode) {
          console.warn(`目的地 ${dest.city} の空港が見つかりません。`);
          return null;
        }

        let flights: FlightOffer[] = [];
        
        if (this.useMockData && mockFlights[dest.city]) {
          console.log(`モックデータを使用: ${dest.city}`);
          flights = mockFlights[dest.city];
        } else {
          try {
            // フライト情報を検索
            flights = await this.amadeusAgent.searchFlights({
              origin: originCode,
              destination: destCode,
              departureDate,
              returnDate,
              isRoundTrip: true
            });
          } catch (error) {
            console.error(`フライト検索中にエラーが発生しました: ${error}`);
            // エラーが発生した場合はモックデータを使用
            if (mockFlights[dest.city]) {
              console.log(`エラーのためモックデータを使用: ${dest.city}`);
              flights = mockFlights[dest.city];
            } else {
              return null;
            }
          }
        }

        if (flights.length > 0) {
          const bestFlight = flights[0]; // 最安値のフライト
          const durationMatch = bestFlight.totalDuration?.match(/PT(\d+)H(\d+)M/);
          const durationMinutes = durationMatch ? 
            parseInt(durationMatch[1]) * 60 + parseInt(durationMatch[2]) : 
            1440; // デフォルト24時間

          // 価格を数値に変換
          const priceAmount = parseFloat(bestFlight.price.amount);

          const score = this.calculateScore(
            priceAmount,
            durationMinutes,
            weather
          );

          suggestions.push({
            destination: dest.city,
            destinationJa: dest.cityJa,
            description: dest.description,
            weather,
            flight: {
              price: {
                amount: priceAmount,
                currency: bestFlight.price.currency
              },
              duration: bestFlight.totalDuration || '不明',
              airline: bestFlight.segments[0].airline
            },
            score
          });
        }
      } catch (error) {
        console.error(`Error processing destination ${dest.city}:`, error);
        return null;
      }
    });

    await Promise.all(weatherPromises);
    return suggestions.sort((a, b) => b.score - a.score);
  }
} 