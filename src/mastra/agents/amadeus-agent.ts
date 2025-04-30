import { FlightSearchParams, FlightOffer, sortFlightOffers } from '../types/flight.js';
import { getAirportCode, getAirportName } from '../utils/airport-codes.js';

interface AmadeusResponse {
  data: Array<{
    id: string;
    price: {
      total: string;
      currency: string;
    };
    itineraries: Array<{
      duration: string;
      segments: Array<{
        departure: {
          iataCode: string;
          at: string;
        };
        arrival: {
          iataCode: string;
          at: string;
        };
        carrierCode: string;
        number: string;
        duration: string;
      }>;
    }>;
    bookingLink?: string;
  }>;
}

export class AmadeusAgent {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    // 地名から空港コードを取得
    const originCode = getAirportCode(params.origin);
    const destinationCode = getAirportCode(params.destination);

    if (!originCode || !destinationCode) {
      throw new Error('空港が見つかりません。正しい地名を入力してください。');
    }

    // 空港名を取得
    const originName = getAirportName(params.origin);
    const destinationName = getAirportName(params.destination);

    console.log(`検索中: ${originName} → ${destinationName}`);

    try {
      // Amadeus APIを呼び出す
      const queryParams = new URLSearchParams({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: params.departureDate,
        adults: '1',
        currencyCode: 'JPY',
        max: '20'
      });

      if (params.isRoundTrip && params.returnDate) {
        queryParams.append('returnDate', params.returnDate);
      }

      const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: AmadeusResponse = await response.json();

      const flightOffers = data.data.map((offer: any) => ({
        id: offer.id,
        price: {
          amount: offer.price.total,
          currency: offer.price.currency
        },
        segments: offer.itineraries[0].segments.map((segment: any) => ({
          departureAirport: segment.departure.iataCode,
          arrivalAirport: segment.arrival.iataCode,
          departureTime: segment.departure.at,
          arrivalTime: segment.arrival.at,
          duration: segment.duration,
          airline: segment.carrierCode,
          flightNumber: segment.number
        })),
        bookingUrl: offer.bookingLink || 
          `https://www.amadeus.com/flights/booking/${offer.id}?origin=${originCode}&destination=${destinationCode}&departureDate=${params.departureDate}`,
        totalDuration: offer.itineraries[0].duration
      }));

      // 価格と所要時間でソート
      return sortFlightOffers(flightOffers);
    } catch (error) {
      console.error('フライト検索中にエラーが発生しました:', error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  }
} 