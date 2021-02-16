/**
 * @file 开启服务
 */

import {Express} from 'express';

const PORT: number = process.argv.slice(2)?.[0]
    ? Number(process.argv.slice(2)?.[0])
    : process.env.npm_package_config_port
        ? Number(process.env.npm_package_config_port)
        : 3000;

export default (app: Express) => {
    app.listen(PORT, () => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'http://ruofee.cn';
        console.log(`🚀 服务已开启~\n🌏 服务地址为: ${url}:${PORT}`);
    });
};