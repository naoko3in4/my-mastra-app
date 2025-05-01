import { z } from "zod";
 
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
  };
}

interface HistoricalWeatherResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
  };
}
 
export const weatherTool = {
  id: "get-weather",
  description: "Get current and forecast weather for a location",
  execute: async (location: string, startDate?: string, endDate?: string) => {
    try {
      return await getWeather(location, startDate, endDate);
    } catch (error) {
      console.log('天気予測の取得に失敗しました。過去の平均データを取得します。');
      return await getHistoricalWeather(location, startDate, endDate);
    }
  },
};
 
const getWeather = async (location: string, startDate?: string, endDate?: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();
 
  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }
 
  const { latitude, longitude, name } = geocodingData.results[0];
 
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum${startDate ? `&start_date=${startDate}` : ''}${endDate ? `&end_date=${endDate}` : ''}`;
 
  const response = await fetch(weatherUrl);
  const data: WeatherResponse = await response.json();
 
  let avgMaxTemp = 0;
  let avgMinTemp = 0;
  let avgPrecipitation = 0;
  let weatherCodes: number[] = [];
  
  if (data.daily) {
    const days = data.daily.time.length;
    avgMaxTemp = data.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / days;
    avgMinTemp = data.daily.temperature_2m_min.reduce((a, b) => a + b, 0) / days;
    avgPrecipitation = data.daily.precipitation_sum.reduce((a, b) => a + b, 0) / days;
    weatherCodes = data.daily.weather_code;
  }

  const mostFrequentWeatherCode = getMostFrequentWeatherCode(weatherCodes);
 
  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windGust: data.current.wind_gusts_10m,
      conditions: getWeatherCondition(data.current.weather_code),
    },
    forecast: {
      avgMaxTemperature: avgMaxTemp,
      avgMinTemperature: avgMinTemp,
      avgPrecipitation: avgPrecipitation,
      conditions: getWeatherCondition(mostFrequentWeatherCode),
      days: data.daily?.time.length || 0,
    },
    location: name,
  };
};
 
function getMostFrequentWeatherCode(codes: number[]): number {
  if (codes.length === 0) return 0;
  
  const frequency: Record<number, number> = {};
  codes.forEach(code => {
    frequency[code] = (frequency[code] || 0) + 1;
  });
  
  return parseInt(Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])[0][0]);
}
 
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: "快晴",
    1: "晴れ",
    2: "一部曇り",
    3: "曇り",
    45: "霧",
    48: "霧氷",
    51: "小雨",
    53: "適度な雨",
    55: "強い雨",
    56: "軽い凍雨",
    57: "強い凍雨",
    61: "弱い雨",
    63: "適度な雨",
    65: "強い雨",
    66: "軽い凍雨",
    67: "強い凍雨",
    71: "弱い雪",
    73: "適度な雪",
    75: "強い雪",
    77: "雪粒",
    80: "弱いにわか雨",
    81: "適度なにわか雨",
    82: "強いにわか雨",
    85: "弱いにわか雪",
    86: "強いにわか雪",
    95: "雷雨",
    96: "弱い雹を伴う雷雨",
    99: "強い雹を伴う雷雨",
  };
  return conditions[code] || "不明";
}

async function getHistoricalWeather(location: string, startDate?: string, endDate?: string) {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  // 過去5年間の同じ期間のデータを取得
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  
  const historicalPromises = Array.from({ length: 5 }, (_, i) => {
    const year = startYear + i;
    const historicalStartDate = startDate ? startDate.replace(/\d{4}/, year.toString()) : undefined;
    const historicalEndDate = endDate ? endDate.replace(/\d{4}/, year.toString()) : undefined;
    
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum${historicalStartDate ? `&start_date=${historicalStartDate}` : ''}${historicalEndDate ? `&end_date=${historicalEndDate}` : ''}`;
    
    return fetch(url).then(res => res.json());
  });

  const historicalData = await Promise.all(historicalPromises);
  
  // 各年のデータを平均化
  const avgMaxTemps: number[] = [];
  const avgMinTemps: number[] = [];
  const avgPrecipitations: number[] = [];
  const weatherCodes: number[] = [];
  
  historicalData.forEach(data => {
    if (data.daily) {
      const days = data.daily.time.length;
      if (days > 0) {
        avgMaxTemps.push(data.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / days);
        avgMinTemps.push(data.daily.temperature_2m_min.reduce((a: number, b: number) => a + b, 0) / days);
        avgPrecipitations.push(data.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / days);
        weatherCodes.push(...data.daily.weather_code);
      }
    }
  });

  const finalAvgMaxTemp = avgMaxTemps.reduce((a, b) => a + b, 0) / avgMaxTemps.length;
  const finalAvgMinTemp = avgMinTemps.reduce((a, b) => a + b, 0) / avgMinTemps.length;
  const finalAvgPrecipitation = avgPrecipitations.reduce((a, b) => a + b, 0) / avgPrecipitations.length;
  const mostFrequentWeatherCode = getMostFrequentWeatherCode(weatherCodes);

  return {
    current: {
      temperature: finalAvgMaxTemp,
      feelsLike: finalAvgMaxTemp,
      humidity: 0,
      windSpeed: 0,
      windGust: 0,
      conditions: getWeatherCondition(mostFrequentWeatherCode),
    },
    forecast: {
      avgMaxTemperature: finalAvgMaxTemp,
      avgMinTemperature: finalAvgMinTemp,
      avgPrecipitation: finalAvgPrecipitation,
      conditions: getWeatherCondition(mostFrequentWeatherCode),
      days: historicalData[0]?.daily?.time.length || 0,
      isHistorical: true,
    },
    location: name,
  };
}