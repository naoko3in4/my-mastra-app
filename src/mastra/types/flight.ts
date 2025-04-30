export interface FlightSegment {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: string;
  flightNumber: string;
}

export interface FlightOffer {
  id: string;
  price: {
    amount: string;
    currency: string;
  };
  segments: FlightSegment[];
  bookingUrl: string;
  totalDuration: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  isRoundTrip: boolean;
}

export function sortFlightOffers(offers: FlightOffer[]): FlightOffer[] {
  return [...offers].sort((a, b) => {
    const priceA = parseFloat(a.price.amount);
    const priceB = parseFloat(b.price.amount);
    if (priceA !== priceB) {
      return priceA - priceB;
    }
    return parseDuration(a.totalDuration) - parseDuration(b.totalDuration);
  });
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours * 60 + minutes;
} 