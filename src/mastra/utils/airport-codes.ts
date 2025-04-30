interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  cityJa?: string;
  nameJa?: string;
}

const airports: Airport[] = [
  { 
    code: 'HND', 
    name: 'Tokyo Haneda International Airport', 
    city: 'Tokyo', 
    country: 'Japan',
    cityJa: '東京',
    nameJa: '羽田国際空港'
  },
  { 
    code: 'NRT', 
    name: 'Narita International Airport', 
    city: 'Tokyo', 
    country: 'Japan',
    cityJa: '東京',
    nameJa: '成田国際空港'
  },
  { 
    code: 'JFK', 
    name: 'John F. Kennedy International Airport', 
    city: 'New York', 
    country: 'United States',
    cityJa: 'ニューヨーク',
    nameJa: 'ジョン・F・ケネディ国際空港'
  },
  { 
    code: 'LAX', 
    name: 'Los Angeles International Airport', 
    city: 'Los Angeles', 
    country: 'United States',
    cityJa: 'ロサンゼルス',
    nameJa: 'ロサンゼルス国際空港'
  },
  { 
    code: 'SFO', 
    name: 'San Francisco International Airport', 
    city: 'San Francisco', 
    country: 'United States',
    cityJa: 'サンフランシスコ',
    nameJa: 'サンフランシスコ国際空港'
  },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
  { 
    code: 'YYZ', 
    name: 'Toronto Pearson International Airport', 
    city: 'Toronto', 
    country: 'Canada',
    cityJa: 'トロント',
    nameJa: 'トロント・ピアソン国際空港'
  },
  { 
    code: 'TSA', 
    name: 'Taipei Songshan Airport', 
    city: 'Taipei', 
    country: 'Taiwan',
    cityJa: '台北',
    nameJa: '台北松山空港'
  },
  { 
    code: 'TPE', 
    name: 'Taiwan Taoyuan International Airport', 
    city: 'Taipei', 
    country: 'Taiwan',
    cityJa: '台北',
    nameJa: '台湾桃園国際空港'
  },
];

export function findAirportByCity(city: string): Airport | undefined {
  const normalizedCity = city.toLowerCase().trim();
  return airports.find(airport => 
    airport.city.toLowerCase().includes(normalizedCity) ||
    airport.name.toLowerCase().includes(normalizedCity) ||
    airport.cityJa?.includes(city) ||
    airport.nameJa?.includes(city)
  );
}

export function findAirportByCode(code: string): Airport | undefined {
  return airports.find(airport => airport.code.toLowerCase() === code.toLowerCase());
}

export function getAirportCode(cityOrCode: string): string | undefined {
  const airport = findAirportByCity(cityOrCode) || findAirportByCode(cityOrCode);
  if (!airport) {
    console.error(`警告: 空港が見つかりません: ${cityOrCode}`);
    console.error('利用可能な空港:');
    airports.forEach(a => console.error(`- ${a.cityJa || a.city} (${a.code}): ${a.nameJa || a.name}`));
  }
  return airport?.code;
}

export function getAirportName(cityOrCode: string): string | undefined {
  const airport = findAirportByCity(cityOrCode) || findAirportByCode(cityOrCode);
  if (!airport) {
    console.error(`警告: 空港が見つかりません: ${cityOrCode}`);
    return cityOrCode;
  }
  return airport.nameJa ? 
    `${airport.nameJa} (${airport.cityJa || airport.city})` : 
    `${airport.name} (${airport.city}, ${airport.country})`;
} 