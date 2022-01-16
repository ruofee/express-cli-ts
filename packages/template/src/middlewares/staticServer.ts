import express, {Express} from 'express';
import path from 'path';
import getArgs from '../utils/getArgs';

function getFilePath(staticDir: string) {
  return path.resolve(__dirname, '../../', staticDir);
}

const DEFAULT_STATIC_DIR = './static';

const staticDir = getArgs().static
  ? getFilePath(getArgs().static)
  : process.env.npm_package_config_static
    ? getFilePath(process.env.npm_package_config_static)
    : getFilePath(DEFAULT_STATIC_DIR);

export default (app: Express) => {
  app.use(express.static(staticDir));
};
