const {readdirSync, lstatSync, mkdir, writeFile} = require('fs');
const {resolve} = require('path');

const readDir = (dirname, dirPath, result = [], ignoreDirs = []) => {
    const _dirPath = resolve(dirname, dirPath);
    let dir = [];
    try {
        dir = readdirSync(_dirPath)
    }
    catch(err) {
        console.error(err.message);
    }
    dir.forEach(filename => {
        const _filename = resolve(_dirPath, filename);
        if (ignoreDirs.includes(filename)) {
            return;
        }
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

exports.readDir = readDir;

exports.writeFileRecursive = (dirname, filename, data) => {
    return new Promise((res, rej) => {
        const dirPath = filename.substring(0, filename.lastIndexOf('/'));
        mkdir(dirPath, {recursive: true}, err => {
            if (err) {
                rej(err);
            }
            else {
                writeFile(resolve(dirname, `../${filename}`), data, err => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                });
            }
        });
    });
};