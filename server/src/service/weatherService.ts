import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
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
    const query = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
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
    const data = await response.json();
    return data;
  }

  private parseCurrentWeather(response: any): Weather {
    const city = response.city.name;
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString();
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const tempF = Math.floor((response.list[0].main.temp - 273.15) * 9/5 + 32);
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();