import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRoutes from './routes/api/weatherRoutes.js';
import routes from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);
app.use('/api', routes);

// Serve static files from the client directory
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

// Fallback to index.html for any other requests (for SPA)
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
