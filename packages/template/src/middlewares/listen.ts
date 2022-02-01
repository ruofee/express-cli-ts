/**
 * @file 开启服务
 */

import {Express} from 'express';
import context from '../plugins/context';
import pluginNames from '../plugins/pluginNames';
import getArgs from '../utils/getArgs';

const DEFAULT_PORT = 3000;
const args = getArgs();

const eaddrinusePorts: number[] = [];
let tryNum = 3;
let port = args.port
    ? Number(args.port)
    : process.env.npm_package_config_port
        ? Number(process.env.npm_package_config_port)
        : DEFAULT_PORT;

export default (app: Express) => {
    context.emit(pluginNames.beforeStart);
    const server = app.listen(port);
    server.on('listening', () => {
        context.emit(pluginNames.start);
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'http://ruofee.cn';
        console.log(`🚀 服务已开启~\n🌏 服务地址为: ${url}:${port}`);
    });

    server.on('error', err => {
        if ((err as any).code !== 'EADDRINUSE') {
            throw err;
        } else if (tryNum > 1) {
            eaddrinusePorts.push(port);
            port += 1;
            tryNum -= 1;
            server.listen(port);
        } else {
            console.error(`💥 端口已被占用, 请检查接口占用情况: ${eaddrinusePorts.join(', ')}`);
        }
    });
};