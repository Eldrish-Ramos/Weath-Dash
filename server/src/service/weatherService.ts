//Using the 5-day weather forecast API, you'll notice 
// that you'll need to pass in coordinates instead of just a city name. 
// Using the OpenWeatherMap APIs, how could we retrieve geographical 
// coordinates given a city name?
// How could we make the OpenWeather API calls server-side, 
// parse the data, and then send the parsed data client-side?
//example of a proper query given our BASE_URL
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=18171d41bb4163345f5885844befc0e2
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  temperature: number;
  description: string;

  constructor(temperature: number, description: string) {
    this.temperature = temperature;
    this.description = description;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL!;
    this.apiKey = process.env.API_KEY!;
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
    const temperature = response.list[0].main.temp;
    const description = response.list[0].weather[0].description;
    return new Weather(temperature, description);
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();