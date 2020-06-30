//  * Import npm Modules
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// * Import
import corsMiddleware from './middleware/cors';
import db from './core/db';
import error404 from './controllers/404Error';
import error from './middleware/error';

import userRouter from './routes/user';

const rfs = require('rotating-file-stream'); // don't work with babel import

// * Init
const app = express(); // * Express server
dotenv.config(); // * env variables
const stream = rfs.createStream('logs/file.log', { // * Log stream
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip' // not compress rotated files
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

// * Urser Routes
app.use('/user', userRouter);

// * 404 Middleware
app.all(error404);

//* Error handling middleware
app.use(error);

// * Start server
db.initDb('main')
  .then(() => {
    app.listen(process.env.PORT ?? 8080);
  })
  .catch(err => console.log('error:', err));
