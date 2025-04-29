declare module 'amadeus' {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
  }

  interface FlightOffer {
    itineraries: Array<{
      segments: Array<{
        carrierCode: string;
        number: string;
        departure: {
          at: string;
        };
        arrival: {
          at: string;
        };
      }>;
      duration: string;
    }>;
    price: {
      total: string;
    };
  }

  interface AmadeusResponse {
    data: FlightOffer[];
  }

  interface AmadeusAPI {
    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<AmadeusResponse>;
      };
    };
    referenceData: {
      locations: {
        get(params: any): Promise<{ data: Array<{ iataCode: string }> }>;
      };
    };
  }

  class Amadeus {
    constructor(config: AmadeusConfig);
    shopping: AmadeusAPI['shopping'];
    referenceData: AmadeusAPI['referenceData'];
  }

  export default Amadeus;
} 