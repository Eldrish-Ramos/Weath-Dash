import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const city = req.body.cityName;
  console.log('Request body:', req.body);
  console.log('Received city:', city); // Add logging here
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }
  try {
    const weather = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city); // Save city to search history
    return res.json(weather);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City deleted from history' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;