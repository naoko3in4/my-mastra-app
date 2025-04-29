import Amadeus from 'amadeus';
import { format } from 'date-fns';

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  isRoundTrip?: boolean;
}

export class AmadeusAgent {
  private amadeus: Amadeus;

  constructor(apiKey: string, apiSecret: string) {
    this.amadeus = new Amadeus({
      clientId: apiKey,
      clientSecret: apiSecret
    });
  }

  async searchFlights(params: FlightSearchParams) {
    try {
      console.log('Amadeus APIで検索中...');
      
      // 日付をフォーマット
      const departureDate = format(params.departureDate, 'yyyy-MM-dd');
      const returnDate = params.returnDate ? format(params.returnDate, 'yyyy-MM-dd') : '';
      
      // 空港コードを取得
      const originAirport = await this.getAirportCode(params.origin);
      const destinationAirport = await this.getAirportCode(params.destination);
      
      // フライト検索
      const response = await this.amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originAirport,
        destinationLocationCode: destinationAirport,
        departureDate: departureDate,
        returnDate: returnDate,
        adults: '1',
        currencyCode: 'JPY',
        max: 5
      });
      
      // 結果を整形
      const results = response.data.map(offer => {
        const itinerary = offer.itineraries[0];
        const segment = itinerary.segments[0];
        const price = offer.price.total;
        
        return {
          airline: segment.carrierCode,
          flightNumber: segment.number,
          departureTime: segment.departure.at,
          arrivalTime: segment.arrival.at,
          price: `${price} JPY`,
          duration: itinerary.duration
        };
      });
      
      // 重複を排除
      const uniqueResults = this.removeDuplicates(results);
      
      return uniqueResults;
      
    } catch (error) {
      console.error('エラーが発生しました:', error);
      throw error;
    }
  }
  
  // 重複を排除する関数
  private removeDuplicates(flights: any[]) {
    const uniqueFlights = [];
    const seen = new Set();
    
    for (const flight of flights) {
      // フライトの一意性を判断するキーを作成
      const key = `${flight.airline}-${flight.flightNumber}-${flight.departureTime}-${flight.arrivalTime}-${flight.duration}`;
      
      // まだ見ていないフライトの場合のみ追加
      if (!seen.has(key)) {
        seen.add(key);
        uniqueFlights.push(flight);
      }
    }
    
    return uniqueFlights;
  }
  
  private async getAirportCode(cityName: string): Promise<string> {
    // 3文字の大文字の場合は既に空港コードとみなす
    if (/^[A-Z]{3}$/.test(cityName)) {
      return cityName;
    }

    try {
      // 都市名から空港コードを検索
      const response = await this.amadeus.referenceData.locations.get({
        keyword: cityName,
        subType: 'CITY,AIRPORT'
      });
      
      const location = response.data[0];
      if (!location) {
        throw new Error(`空港コードが見つかりません: ${cityName}`);
      }
      
      return location.iataCode;
    } catch (error) {
      console.error('空港コードの取得に失敗しました:', error);
      throw error;
    }
  }
} 