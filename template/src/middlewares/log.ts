import {Express} from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';

export default (app: Express) => {
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: './src/log/data.log'
            })
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
};
