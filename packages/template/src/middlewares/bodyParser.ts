import {Express} from 'express';
import {json, urlencoded} from 'body-parser';

export default (app: Express) => {
    app.use(urlencoded({extended: false}));
    app.use(json());
};
