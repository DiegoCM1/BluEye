// backend/src/services/riskAnalysis.js

import axios from 'axios';

/** Saffir–Simpson category (0-5) from wind speed in m/s */
export function saffirCategoryFromWind(ms) {
  const kmh = ms * 3.6;
  if (kmh >= 252) return 5;
  if (kmh >= 209) return 4;
  if (kmh >= 178) return 3;
  if (kmh >= 154) return 2;
  if (kmh >= 119) return 1;
  return 0; // sin categoría / tropical
}

export async function getCurrentWeather(lat, lon, apiKey) {
  if (!apiKey) {
    throw new Error('Missing OpenWeather API key');
  }
  const response = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: { lat, lon, appid: apiKey, units: 'metric', lang: 'es' },
    }
  );
  return response.data;
}

export async function getForecast(lat, lon, apiKey) {
  const response = await axios.get(
    'https://api.openweathermap.org/data/2.5/forecast',
    {
      params: { lat, lon, appid: apiKey, units: 'metric', lang: 'es' },
    }
  );
  return response.data;
}

export function analyzeForecastTrend(forecast) {
  let score = 0;
  let factors = [];
  const next24Hours = forecast.list.slice(0, 8);
  let stormCount = 0;
  let maxWind = 0;
  let minPressure = 1013;
  let heavyRainCount = 0;

  next24Hours.forEach((item) => {
    const weather = item.weather[0].main.toLowerCase();
    if (weather.includes('thunderstorm')) {
      stormCount++;
    }
    if (item.wind?.speed > maxWind) {
      maxWind = item.wind.speed;
    }
    if (item.main.pressure < minPressure) {
      minPressure = item.main.pressure;
    }
    if (item.rain && item.rain['3h'] > 10) {
      heavyRainCount++;
    }
  });

  if (stormCount >= 3) {
    score += 20;
    factors.push('Tormentas persistentes previstas (24h)');
  }
  if (maxWind > 20) {
    score += 15;
    factors.push(`Vientos fuertes previstos (${maxWind.toFixed(1)} m/s)`);
  }
  if (minPressure < 990) {
    score += 15;
    factors.push(`Caída de presión prevista (${minPressure} hPa)`);
  }
  if (heavyRainCount >= 2) {
    score += 10;
    factors.push('Lluvias intensas previstas');
  }

  return { score, factors };
}

export function calculateRiskLevel(currentWeather, forecast) {
  let riskScore = 0;
  let factors = [];
  const windSpeed = currentWeather.wind?.speed || 0;

  if (windSpeed > 25) {
    riskScore += 30;
    factors.push(`Vientos extremos (${windSpeed.toFixed(1)} m/s)`);
  } else if (windSpeed > 15) {
    riskScore += 20;
    factors.push(`Vientos fuertes (${windSpeed.toFixed(1)} m/s)`);
  } else if (windSpeed > 8) {
    riskScore += 10;
    factors.push(`Vientos moderados (${windSpeed.toFixed(1)} m/s)`);
  }

  const pressure = currentWeather.main.pressure;
  if (pressure < 980) {
    riskScore += 25;
    factors.push(`Presión atmosférica muy baja (${pressure} hPa)`);
  } else if (pressure < 1000) {
    riskScore += 15;
    factors.push(`Presión atmosférica baja (${pressure} hPa)`);
  }

  const weather = currentWeather.weather[0].main.toLowerCase();
  const description = currentWeather.weather[0].description;

  if (weather.includes('thunderstorm')) {
    riskScore += 35;
    factors.push(`Tormenta eléctrica: ${description}`);
  } else if (weather.includes('rain') && windSpeed > 10) {
    riskScore += 20;
    factors.push(`Lluvia con vientos: ${description}`);
  } else if (weather.includes('snow') && windSpeed > 15) {
    riskScore += 25;
    factors.push(`Tormenta de nieve: ${description}`);
  } else if (weather.includes('rain')) {
    riskScore += 10;
    factors.push(`Precipitación: ${description}`);
  }

  const visibility = currentWeather.visibility || 10000;
  if (visibility < 1000) {
    riskScore += 20;
    factors.push(`Visibilidad muy baja (${(visibility / 1000).toFixed(1)} km)`);
  } else if (visibility < 5000) {
    riskScore += 10;
    factors.push(`Visibilidad reducida (${(visibility / 1000).toFixed(1)} km)`);
  }

  const temp = currentWeather.main.temp;
  if (temp > 40) {
    riskScore += 15;
    factors.push(`Temperatura extrema alta (${temp}°C)`);
  } else if (temp < -10) {
    riskScore += 15;
    factors.push(`Temperatura extrema baja (${temp}°C)`);
  }

  const forecastRisk = analyzeForecastTrend(forecast);
  riskScore += forecastRisk.score;
  factors = factors.concat(forecastRisk.factors);

  const category = saffirCategoryFromWind(windSpeed);
  return { score: Math.min(riskScore, 100), level: category, factors };
}

export function generateAlerts(riskAnalysis, currentWeather) {
  const alerts = [];

  const level = riskAnalysis.level;

  if (level >= 5) {
    alerts.push({
      type: 'EMERGENCY',
      category: 5,
      title: 'ALERTA METEOROLÓGICA EXTREMA',
      message:
        'Condiciones meteorológicas extremas detectadas. Evacue si es necesario.',
      priority: 'high',
      actions: [
        'Busque refugio inmediatamente',
        'Evite salir al exterior',
        'Manténgase informado',
        'Tenga kit de emergencia listo',
      ],
      location: currentWeather.name,
    });
  } else if (level === 4) {
    alerts.push({
      type: 'WARNING',
      category: 4,
      title: 'ALERTA METEOROLÓGICA ALTA',
      message:
        'Condiciones meteorológicas peligrosas. Tome precauciones inmediatas.',
      priority: 'medium',
      actions: [
        'Limite actividades al aire libre',
        'Asegure objetos sueltos',
        'Monitoree condiciones constantemente',
        'Prepare kit de emergencia',
      ],
      location: currentWeather.name,
    });
  } else if (level === 3) {
    alerts.push({
      type: 'WARNING',
      category: 3,
      title: 'ALERTA METEOROLÓGICA MODERADA',
      message:
        'Condiciones meteorológicas severas. Tome precauciones.',
      priority: 'medium',
      actions: [
        'Limite actividades al aire libre',
        'Asegure objetos sueltos',
        'Monitoree actualizaciones del clima',
      ],
      location: currentWeather.name,
    });
  } else if (level === 2) {
    alerts.push({
      type: 'ADVISORY',
      category: 2,
      title: 'AVISO METEOROLÓGICO',
      message: 'Condiciones meteorológicas que requieren atención.',
      priority: 'low',
      actions: [
        'Manténgase informado',
        'Evite actividades de riesgo',
        'Tenga precaución al conducir',
      ],
      location: currentWeather.name,
    });
  }

  return alerts;
}

export function generateBanner(riskAnalysis) {
  const banners = {
    1: {
      color: '#22C55E',
      backgroundColor: '#DCFCE7',
      text: '🌀 CATEGORÍA 1',
      description: 'Vientos 119–153 km/h',
      icon: '🌀',
    },
    2: {
      color: '#15803D',
      backgroundColor: '#BBF7D0',
      text: '🌀 CATEGORÍA 2',
      description: '154–177 km/h',
      icon: '🌀',
    },
    3: {
      color: '#FACC15',
      backgroundColor: '#FEF9C3',
      text: '🌀 CATEGORÍA 3',
      description: '178–208 km/h',
      icon: '🌀',
    },
    4: {
      color: '#EF4444',
      backgroundColor: '#FEE2E2',
      text: '🌀 CATEGORÍA 4',
      description: '209–251 km/h',
      icon: '🌀',
    },
    5: {
      color: '#C026D3',
      backgroundColor: '#FAE8FF',
      text: '🌀 CATEGORÍA 5',
      description: '≥ 252 km/h',
      icon: '🌀',
    },
    0: {
      color: '#60A5FA',
      backgroundColor: '#DBEAFE',
      text: '🌧️ BAJA',
      description: 'Tormenta tropical',
      icon: '🌧️',
    },
  };
  return banners[riskAnalysis.level];
}

export function generateRecommendations(riskAnalysis) {
  const recommendations = {
    5: [
      'Permanezca en un lugar seguro y resistente',
      'No conduzca a menos que sea absolutamente necesario',
      'Tenga agua y alimentos para 72 horas',
      'Mantenga dispositivos cargados y radio funcionando',
      'Escuche alertas oficiales de Protección Civil',
      'Evite ventanas y estructuras débiles',
    ],
    4: [
      'Evite todas las actividades al aire libre',
      'Conduzca con extrema precaución o evítelo',
      'Asegure objetos que puedan volarse con el viento',
      'Tenga linterna, radio y suministros a mano',
      'Manténgase alejado de árboles y estructuras altas',
    ],
    3: [
      'Planifique actividades al aire libre con cuidado',
      'Lleve ropa adecuada para las condiciones',
      'Manténgase informado de cambios en el clima',
      'Tenga precaución extra al conducir',
    ],
    2: [
      'Planifique actividades al aire libre con cuidado',
      'Manténgase informado de cambios en el clima',
      'Tenga precaución al conducir',
    ],
    1: [
      'Disfrute del día con precaución',
      'Esté atento a actualizaciones del clima',
    ],
    0: [
      'Disfrute del día con normalidad',
      'Condiciones ideales para actividades al aire libre',
      'Mantenga rutina normal de actividades',
    ],
  };
  return recommendations[riskAnalysis.level];
}
