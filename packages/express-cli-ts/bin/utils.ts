import {readdirSync, lstatSync, statSync, mkdir, writeFile} from 'fs';
import {resolve} from 'path';
import {exec} from 'child_process';
import downloadGitRepo from 'download-git-repo';
import chalk from 'chalk';

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
            console.error((err as Error).message || err);
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

export const downloadTemplate = (path: string, saveAsPath: string, dirPath: string) => {
    return new Promise((res, rej) => {
        downloadGitRepo(path, saveAsPath, {clone: false}, (err: Error) => {
            if (err) {
                return rej(err);
            }

            const templatePath = resolve(saveAsPath, './packages/template');
            const cachePath = resolve(dirPath, './cache_template');

            tryCatch(async () => {
                await execPromise(`cp -rf ${templatePath} ${cachePath}`);
                await execPromise(`rm -rf ${saveAsPath} && mv ${cachePath} ${saveAsPath}`);
                res(saveAsPath);
            }, rej)();
        });
    });
};

export const writeFileRecursive = (filename: string, data: string) => {
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

export const execPromise = (bash: string): Promise<string> => {
    console.log(`\n${chalk.blue(bash)}`);
    return new Promise((res, rej) => {
        exec(bash, (err, stdout) => {
            if (err) {
                rej(err);
            }
            else {
                res(stdout);
            }
        });
    });
}

export const tryCatch = (fn: (...params: unknown[]) => unknown, errorCallback?: (err: unknown) => void) => {
    return async (...args: unknown[]) => {
        try {
            return await fn(args);
        }
        catch(err) {
            errorCallback && errorCallback(err);
        }
    };
};
