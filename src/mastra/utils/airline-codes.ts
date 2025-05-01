interface Airline {
  code: string;
  name: string;
  nameJa: string;
}

export const airlines: Airline[] = [
  { code: 'AC', name: 'Air Canada', nameJa: 'エア・カナダ' },
  { code: 'CX', name: 'Cathay Pacific', nameJa: 'キャセイパシフィック航空' },
  { code: 'LH', name: 'Lufthansa', nameJa: 'ルフトハンザドイツ航空' },
  { code: 'BR', name: 'EVA Air', nameJa: 'エバー航空' },
  { code: 'KE', name: 'Korean Air', nameJa: '大韓航空' },
  { code: 'JL', name: 'Japan Airlines', nameJa: '日本航空' },
  { code: 'NH', name: 'All Nippon Airways', nameJa: '全日本空輸' },
  { code: 'UA', name: 'United Airlines', nameJa: 'ユナイテッド航空' },
  { code: 'AA', name: 'American Airlines', nameJa: 'アメリカン航空' },
  { code: 'DL', name: 'Delta Air Lines', nameJa: 'デルタ航空' },
  { code: 'OZ', name: 'Asiana Airlines', nameJa: 'アシアナ航空' }
];

export function getAirlineName(code: string): string {
  const airline = airlines.find(a => a.code === code);
  return airline ? airline.nameJa : code;
} 