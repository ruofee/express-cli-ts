import {readdirSync, lstatSync} from 'fs';
import {resolve} from 'path';

/**
 * 遍历文件夹
 * @param dirPath 地址
 */
export const readDir = (dirname: string, dirPath: string, result: string[] = []): string[] => {
    const _dirPath = resolve(dirname, dirPath);
    let dir: string[] = [];
    try {
        dir = readdirSync(_dirPath)
    }
    catch(err) {
        console.error(err.message);
    }
    dir.forEach(filename => {
        const _filename = resolve(_dirPath, filename);
        if (lstatSync(_filename).isFile()) {
            result.push(_filename);
        }
        else {
            const _dirname = resolve(dirname, dirPath);
            readDir(_dirname, filename, result);
        }
    });
    return result;
};
