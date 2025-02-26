import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  WeatherService.getWeatherForCity(city)
    .then((weather) => {
      res.json(weather);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City deleted' });
  }
  catch (err) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
