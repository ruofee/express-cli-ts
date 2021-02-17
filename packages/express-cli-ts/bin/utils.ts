import {readdirSync, lstatSync, statSync, mkdir, writeFile} from 'fs';
import {resolve} from 'path';
import downloadGitRepo from 'download-git-repo';

export const readDir = (path: string, ignoreFiles?: string[]): string[] => {
    let result: string[] = [];
    if (!lstatSync(path).isFile()) {
        try {
            const files = readdirSync(path);
            files.forEach(file => {
                if (ignoreFiles && ignoreFiles.includes(file)) {
                    return;
                }
                result = result.concat(readDir(resolve(path, file)));
            });
        }
        catch(err) {
            console.error(err.message);
        }
    }
    else {
        result.push(path);
    }
    return result;
};

export const isFileExist = (path: string, file: string): boolean => {
    const dirs = readdirSync(path);
    for (let dir of dirs) {
        const isDir = statSync(dir).isDirectory();
        if (isDir && dir === file) {
            return true;
        }
    }
    return false;
};

export const download = (path: string, saveAsPath: string) => {
    return new Promise((res, rej) => {
        downloadGitRepo(path, saveAsPath, {clone: false}, (err: Error) => {
            if (err) {
                return rej(err);
            }
            res(saveAsPath);
        });
    });
};

export const writeFileRecursive = (filename: string, data: any) => {
    return new Promise((res, rej) => {
        const dirPath = filename.substring(0, filename.lastIndexOf('/'));
        mkdir(dirPath, {recursive: true}, err => {
            if (err) {
                rej(err);
            }
            else {
                writeFile(filename, data, err => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res(true);
                    }
                });
            }
        });
    });
};
