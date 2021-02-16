import {Express} from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';

export default (app: Express) => {
    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: './src/log/error.log'
            })
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        )
    }));
};
