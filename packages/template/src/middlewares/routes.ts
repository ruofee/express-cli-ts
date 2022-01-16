/**
 * @file 注册路由
 */

import express, {Express} from 'express';
import getArgs from '../utils/getArgs';
import routes from '../routes';
const router = express.Router();

const DEFAULT_PREFIX = '/api';
const prefix = getArgs().prefix || process.env.npm_package_config_prefix || DEFAULT_PREFIX;

export default (app: Express) => {
    app.use(prefix, router);
    routes(router);
};
