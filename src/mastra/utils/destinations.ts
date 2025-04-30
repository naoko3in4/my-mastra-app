export interface Destination {
  city: string;
  cityJa: string;
  country: string;
  countryJa: string;
  bestSeasons: string[];
  tags: string[];
  description: string;
}

export const destinations: Destination[] = [
  {
    city: 'Bangkok',
    cityJa: 'バンコク',
    country: 'Thailand',
    countryJa: 'タイ',
    bestSeasons: ['11', '12', '1', '2'],
    tags: ['グルメ', '寺院', 'ショッピング', '観光'],
    description: '活気あふれる街並みと美味しい料理、豪華な寺院が魅力的な都市です。'
  },
  {
    city: 'Paris',
    cityJa: 'パリ',
    country: 'France',
    countryJa: 'フランス',
    bestSeasons: ['4', '5', '6', '9', '10'],
    tags: ['芸術', 'グルメ', '観光', 'ショッピング'],
    description: '芸術と文化の都市。美食の街としても有名です。'
  },
  {
    city: 'Sydney',
    cityJa: 'シドニー',
    country: 'Australia',
    countryJa: 'オーストラリア',
    bestSeasons: ['12', '1', '2', '3'],
    tags: ['ビーチ', '自然', '観光'],
    description: '美しいビーチと自然、都市観光が楽しめる街です。'
  },
  {
    city: 'Singapore',
    cityJa: 'シンガポール',
    country: 'Singapore',
    countryJa: 'シンガポール',
    bestSeasons: ['1', '2', '6', '7'],
    tags: ['グルメ', 'ショッピング', '観光'],
    description: '近代的な街並みと多文化な食事が魅力的な都市国家です。'
  },
  {
    city: 'Seoul',
    cityJa: 'ソウル',
    country: 'South Korea',
    countryJa: '韓国',
    bestSeasons: ['3', '4', '5', '9', '10'],
    tags: ['グルメ', 'ショッピング', '観光', '文化'],
    description: 'K-POPや韓国料理、ショッピングが楽しめる活気ある都市です。'
  }
];

export function findDestinationsByWeather(temperature: number, precipitation: number): Destination[] {
  // 気温と降水確率に基づいて目的地をフィルタリング
  return destinations.filter(dest => {
    const month = new Date().getMonth() + 1;
    const isGoodSeason = dest.bestSeasons.includes(month.toString());
    const isGoodWeather = temperature >= 15 && temperature <= 30 && precipitation < 50;
    return isGoodSeason && isGoodWeather;
  });
}

export function findDestinationByCity(city: string): Destination | undefined {
  return destinations.find(dest => 
    dest.city.toLowerCase() === city.toLowerCase() ||
    dest.cityJa === city
  );
} 