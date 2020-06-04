const express = require('express');
const app = express();
const winston = require('winston');
const routerState = require('./src/routes/routeStates.js');
const controllerState = require('./src/controller/controllerStates.js');

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  //prettier-ignore
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: './Logs/API.log'})
  ],
  format: combine(label({ label: 'api' }), timestamp(), myFormat),
});

app.use(express.json());
app.use('/state', routerState);

app.listen(3000, async () => {
  logger.info('listerning at port 3000...');
  try {
    await controllerState.init();
  } catch (error) {
    logger.error(error);
  }
});
