//  * Import npm Modules
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// * Import
import corsMiddleware from './middleware/cors';

const rfs = require('rotating-file-stream'); // don't work with babel import

// * Init
const app = express(); // * Express server
dotenv.config(); // * env variables
const stream = rfs.createStream('logs/file.log', { // * Log stream
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip' // compress rotated files
});

// * Parse
app.use(express.urlencoded()); // * FormData
app.use(express.json()); // * Json

// * Enable Cors
app.use(corsMiddleware);

// * Enable request/response logger
app.use(morgan('combined', { stream: stream })); // * set up log middleware

// * Set protection headers
app.use(helmet());

app.get('/', (req, res) => {
  res.status(200).send('Hallow world');
});

// * Start server
app.listen(process.env.PORT ?? 8080);
