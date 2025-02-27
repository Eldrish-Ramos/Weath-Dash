import dotenv from 'dotenv';
import express from 'express';
import weatherRoutes from './routes/api/weatherRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());

// Import the routes
import routes from './routes/index.js';



const PORT = process.env.PORT || 3001;

// Serve static files of entire client dist folder
app.use(express.static('client/dist'));

// Implement middleware for parsing JSON and urlencoded form data
app.use('/api/weather', weatherRoutes);

// Implement middleware to connect the routes
app.use('/api', routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
