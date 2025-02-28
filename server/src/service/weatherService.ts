import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  cityName: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    cityName: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

class WeatherService {
  baseURL: string;
  apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL!;
    this.apiKey = process.env.API_KEY!;

    if (!this.baseURL) {
      throw new Error('API_BASE_URL is not defined in the environment variables');
    }

    if (!this.apiKey) {
      throw new Error('API_KEY is not defined in the environment variables');
    }
  }

  private async fetchLocationData(city: string): Promise<Coordinates> {
    const query = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.apiKey}`;
    console.log('Geocode Query:', query); // Add logging here
    const response = await fetch(query);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Location not found');
    }
    console.log('Destructuring Location Data:', data); // Add logging here
    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    console.log('Weather Query:', query); // Add logging here
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Weather Data:', data); // Add logging here
    return data;
  }

  private parseCurrentWeather(response: any): Weather {
    const cityName = response.city.name;
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString();
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const tempF = Math.floor((response.list[0].main.temp - 273.15) * 9/5 + 32);
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    return new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity);
  }

  private parseForecast(response: any): Weather[] {
    const seenDates = new Set<string>();
    const dailyForecasts: Weather[] = [];

    response.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!seenDates.has(date)) {
        seenDates.add(date);
        const icon = forecast.weather[0].icon;
        const iconDescription = forecast.weather[0].description;
        const tempF = Math.floor((forecast.main.temp - 273.15) * 9/5 + 32);
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;
        dailyForecasts.push(new Weather(response.city.name, date, icon, iconDescription, tempF, windSpeed, humidity));
      }
    });

    console.log('Daily Forecasts:', dailyForecasts); // Add logging here

    return dailyForecasts.slice(0, 5);
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.parseForecast(weatherData);
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();