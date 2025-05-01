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
  },
  {
    city: 'London',
    cityJa: 'ロンドン',
    country: 'United Kingdom',
    countryJa: 'イギリス',
    bestSeasons: ['5', '6', '7', '8', '9'],
    tags: ['歴史', '観光', 'ショッピング'],
    description: '歴史的建造物と多彩な文化が楽しめる都市です。'
  },
  {
    city: 'New York',
    cityJa: 'ニューヨーク',
    country: 'United States',
    countryJa: 'アメリカ',
    bestSeasons: ['4', '5', '9', '10'],
    tags: ['観光', 'ショッピング', 'エンタメ'],
    description: '世界を代表する大都市。観光・グルメ・ショッピングが充実。'
  },
  {
    city: 'Los Angeles',
    cityJa: 'ロサンゼルス',
    country: 'United States',
    countryJa: 'アメリカ',
    bestSeasons: ['3', '4', '5', '9', '10'],
    tags: ['ビーチ', '映画', '観光'],
    description: 'ビーチとエンタメの街。ハリウッドも有名。'
  },
  {
    city: 'San Francisco',
    cityJa: 'サンフランシスコ',
    country: 'United States',
    countryJa: 'アメリカ',
    bestSeasons: ['5', '6', '9', '10'],
    tags: ['観光', '自然', 'グルメ'],
    description: 'ゴールデンゲートブリッジや多様な文化が魅力。'
  },
  {
    city: 'Rio de Janeiro',
    cityJa: 'リオデジャネイロ',
    country: 'Brazil',
    countryJa: 'ブラジル',
    bestSeasons: ['6', '7', '8', '9'],
    tags: ['ビーチ', 'カーニバル', '自然'],
    description: '美しいビーチと陽気な雰囲気の都市。'
  },
  {
    city: 'Buenos Aires',
    cityJa: 'ブエノスアイレス',
    country: 'Argentina',
    countryJa: 'アルゼンチン',
    bestSeasons: ['3', '4', '10', '11'],
    tags: ['タンゴ', 'グルメ', '歴史'],
    description: 'タンゴと歴史的建造物が有名な南米の大都市。'
  },
  {
    city: 'Berlin',
    cityJa: 'ベルリン',
    country: 'Germany',
    countryJa: 'ドイツ',
    bestSeasons: ['5', '6', '7', '8', '9'],
    tags: ['歴史', '芸術', '観光'],
    description: '歴史と現代アートが融合する都市。'
  },
  {
    city: 'Barcelona',
    cityJa: 'バルセロナ',
    country: 'Spain',
    countryJa: 'スペイン',
    bestSeasons: ['5', '6', '9', '10'],
    tags: ['建築', 'ビーチ', 'グルメ'],
    description: 'ガウディ建築と美しいビーチが魅力。'
  },
  {
    city: 'Rome',
    cityJa: 'ローマ',
    country: 'Italy',
    countryJa: 'イタリア',
    bestSeasons: ['4', '5', '6', '9', '10'],
    tags: ['歴史', '芸術', '観光'],
    description: '古代遺跡と美術が楽しめる歴史都市。'
  },
  {
    city: 'Vienna',
    cityJa: 'ウィーン',
    country: 'Austria',
    countryJa: 'オーストリア',
    bestSeasons: ['5', '6', '7', '8', '9'],
    tags: ['音楽', '歴史', '芸術'],
    description: '音楽と芸術の都。カフェ文化も有名。'
  },
  {
    city: 'Prague',
    cityJa: 'プラハ',
    country: 'Czech Republic',
    countryJa: 'チェコ',
    bestSeasons: ['5', '6', '9', '10'],
    tags: ['歴史', '建築', '観光'],
    description: '美しい街並みと歴史的建造物が魅力。'
  },
  {
    city: 'Zurich',
    cityJa: 'チューリッヒ',
    country: 'Switzerland',
    countryJa: 'スイス',
    bestSeasons: ['6', '7', '8', '9'],
    tags: ['自然', '金融', '観光'],
    description: '自然と都市が調和したスイスの中心都市。'
  },
  {
    city: 'Budapest',
    cityJa: 'ブダペスト',
    country: 'Hungary',
    countryJa: 'ハンガリー',
    bestSeasons: ['5', '6', '9', '10'],
    tags: ['温泉', '歴史', '観光'],
    description: '温泉とドナウ川の景色が美しい都市。'
  },
  {
    city: 'Amsterdam',
    cityJa: 'アムステルダム',
    country: 'Netherlands',
    countryJa: 'オランダ',
    bestSeasons: ['5', '6', '7', '8', '9'],
    tags: ['運河', '美術', '観光'],
    description: '運河と美術館が有名な自由な雰囲気の都市。'
  },
  {
    city: 'Shanghai',
    cityJa: '上海',
    country: 'China',
    countryJa: '中国',
    bestSeasons: ['4', '5', '10', '11'],
    tags: ['近代都市', 'グルメ', '観光'],
    description: '近代的な高層ビルと歴史的建造物が混在する都市。'
  },
  {
    city: 'Beijing',
    cityJa: '北京',
    country: 'China',
    countryJa: '中国',
    bestSeasons: ['4', '5', '9', '10'],
    tags: ['歴史', '文化', '観光'],
    description: '万里の長城や故宮など歴史的名所が多い。'
  },
  {
    city: 'Taipei',
    cityJa: '台北',
    country: 'Taiwan',
    countryJa: '台湾',
    bestSeasons: ['3', '4', '11', '12'],
    tags: ['グルメ', '夜市', '観光'],
    description: '夜市とグルメが有名な台湾の首都。'
  },
  {
    city: 'Kuala Lumpur',
    cityJa: 'クアラルンプール',
    country: 'Malaysia',
    countryJa: 'マレーシア',
    bestSeasons: ['6', '7', '8', '9'],
    tags: ['多文化', 'ショッピング', '観光'],
    description: '多文化が共存する活気ある都市。'
  },
  {
    city: 'Delhi',
    cityJa: 'デリー',
    country: 'India',
    countryJa: 'インド',
    bestSeasons: ['2', '3', '11', '12'],
    tags: ['歴史', '文化', '観光'],
    description: '歴史的建造物と多様な文化が楽しめる都市。'
  },
  {
    city: 'Jakarta',
    cityJa: 'ジャカルタ',
    country: 'Indonesia',
    countryJa: 'インドネシア',
    bestSeasons: ['6', '7', '8', '9'],
    tags: ['都市', 'グルメ', '観光'],
    description: 'インドネシアの首都で経済の中心地。'
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