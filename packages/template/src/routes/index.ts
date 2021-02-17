import {Router} from 'express';
import {readDir} from '../utils';

export default (router: Router) => {
    const dir = readDir(__dirname, './');
    dir.forEach(async file => {
        if (file !== __filename) {
            const _file = await import(file);
            _file?.default(router);
        }
    });
};
