import {renderFile} from 'ejs';
import chalk from 'chalk';
import {resolve} from 'path';
import inquirer from 'inquirer';
import {isFileExist, download, readDir, writeFileRecursive} from './utils';
import { exec } from 'child_process';

const answer = (projectName: string) => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '项目名叫什么?',
            default: projectName,
            filter: answer => answer.toLowerCase()
        },
        {
            type: 'confirm',
            name: 'isDefaultConfig',
            message: '是否使用默认配置',
            default: true
        },
        {
            when: answers => !answers.isDefaultConfig,
            type: 'checkbox',
            name: 'configs',
            message: '选择需要的配置',
            choices: [
                {name: '网络请求库(axios)', value: 'axios'},
                {name: '路由(Express.Router)', value: 'routes'},
                {name: '日志(winston)', value: 'log'},
                {name: '单元测试(mocha + chai)', value: 'unitTest'},
            ]
        },
    ]);
};

export default async (projectName: string) => {
    const path = process.cwd();
    if (isFileExist(path, projectName)) {
        console.log(chalk.red(`🥊 文件夹(${projectName})已经存在`));
    }
    else {
        const answers = await answer(projectName);
        const downloadPath = './express-cli-ts-template';
        const saveAsPath = resolve(process.cwd(), downloadPath);
        try {
            await download('ruofee/express-cli-ts#main', saveAsPath);
            console.log(chalk.green('💪 成功下载模板'));
            // const fileMap = (await import(resolve(saveAsPath, './packages/template/fileMap.js'))).default;
            const fileMap: {[key: string]: string[]} = {
                axios: ['./src/utils/http.ts'],
                routes: [
                    './src/middlewares/routes.ts',
                    './src/middlewares/bodyParser.ts',
                    './src/routes'
                ],
                winston: [
                    './src/middlewares/log.ts',
                    './src/middlewares/errorLog.ts'
                ],
                unitTest: ['./src/test']
            };
            let configFiles: string[] = [];
            Object.keys((fileMap as {[key: string]: string[]})).forEach(key => {
                configFiles = configFiles.concat(fileMap[key]);
            });
            const files = readDir(resolve(saveAsPath, './packages/template'));
            let copyFiles = files;
            if (!answers.isDefaultConfig) {
                const configs: string[] = answers.configs || [];
                let _files: string[] = [];
                configs.forEach(config => {
                    _files = _files.concat(fileMap[config]);
                });
                copyFiles = files.filter(file => {
                    for (let configFile of configFiles) {
                        let _configFile = resolve(saveAsPath, configFile);
                        if (file === _configFile) {
                            return _files.includes(configFile);
                        }
                    }
                    return true;
                });
            }
            await Promise.all(copyFiles.map(file => {
                return new Promise((resolve, reject) => {
                    (renderFile as any)(file, {
                        ...answers,
                        configs: answers.configs || []
                    })
                        .then((data: string) => {
                            const filename = file.replace(new RegExp('express-cli-ts-template/packages/template'), projectName);
                            writeFileRecursive(filename, data).then(resolve, reject);
                        }, reject);
                });
            }));
            exec(`rm -rf ${downloadPath}`);
            console.log(chalk.green('⚙ 项目创建成功'));
        }
        catch(err) {
            console.log(err);
        }
    }
};