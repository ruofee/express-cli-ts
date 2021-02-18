import {renderFile} from 'ejs';
import chalk from 'chalk';
import {resolve} from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import {isFileExist, download, readDir, writeFileRecursive} from './utils';
import {exec} from 'child_process';
import {readFileSync} from 'fs';

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
                {name: '日志(winston)', value: 'winston'},
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
        const loadingDownload = ora('正在下载模板').start();
        try {
            await download('ruofee/express-cli-ts#main', saveAsPath);
            loadingDownload.succeed('下载完成');
        }
        catch(err) {
            loadingDownload.fail('模板下载失败');
        }
        let fileMap: {[key: string]: string} = {};
        try {
            fileMap = JSON.parse(readFileSync(resolve(saveAsPath, './packages/template/fileMap.json'), 'utf-8'));
        }
        catch(err) {}
        let configFiles: string[] = [];
        Object.keys(fileMap).forEach(key => {
            configFiles = configFiles.concat(fileMap[key]);
        });
        const templatePath = resolve(saveAsPath, './packages/template');
        const files = readDir(templatePath, ['fileMap.json']);
        let copyFiles = files;
        if (!answers.isDefaultConfig) {
            const configs: string[] = answers.configs || [];
            let _files: string[] = [];
            configs.forEach(config => {
                _files = _files.concat(fileMap[config]);
            });
            copyFiles = files.filter(file => {
                for (let configFile of configFiles) {
                    let _configFile = resolve(templatePath, configFile);
                    if (file === _configFile) {
                        return _files.includes(configFile);
                    }
                }
                return true;
            });
        }
        const loadingRender = ora('正在编译模板').start();
        try {
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
            loadingRender.succeed('模板编译成功');
            const loadingPackages = ora('正在安装依赖').start();
            exec(`rm -rf ${downloadPath} && cd ${projectName} && yarn`);
            loadingPackages.succeed('安装依赖成功');
            console.log(chalk.green('执行以下命令启动项目'));
            console.log(chalk.green(`cd ${projectName} && yarn dev`));
            exec('yarn dev');
        }
        catch(err) {
            loadingRender.fail('模板编译失败');
            console.error(err);
        }
    }
};