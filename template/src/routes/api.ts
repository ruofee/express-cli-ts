import {Router} from 'express';

export default (router: Router) => {
    router.get('/data', (req, res) => {
        res.send('测试...');
    });
};
