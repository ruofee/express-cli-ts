/**
 * @file 注册路由
 */

import express, {Express} from 'express';
import routes from '../routes';
const router = express.Router();

export default (app: Express) => {
    const prefix = process.env.npm_package_config_prefix || '/api';
    app.use(prefix, router);
    routes(router);
};
