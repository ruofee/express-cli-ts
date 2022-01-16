import {renderFile} from 'ejs';
import chalk from 'chalk';
import {resolve} from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import {isFileExist, downloadTemplate, readDir, writeFileRecursive, execPromise, tryCatch} from './utils';
import {readFileSync} from 'fs';

const DEFAULT_OPTIONS = { dev: false };

const choices = [
    {name: '网络请求库(axios)', value: 'axios'},
    {name: '路由(Express.Router)', value: 'routes'},
    {name: '日志(winston)', value: 'log'},
    {name: '单元测试(mocha + chai)', value: 'unitTest'},
    {name: '静态文件服务器(Express.static)', value: 'static'}
];

const defaultChoices = choices.map(choice => choice.value);

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
            choices
        },
    ]);
};

export default async (projectName: string, { dev } = DEFAULT_OPTIONS) => {
    const path = process.cwd();

    if (isFileExist(path, projectName)) {
        console.log(chalk.red(`🥊 文件夹(${projectName})已经存在`));
    }
    else {
        const answers = await answer(projectName);
        const saveAsPath = resolve(process.cwd(), './express-cli-ts-template');
        const loadingDownload = ora('正在下载模板').start();

        await tryCatch(async () => {
            if (dev) {
                const templatePath = resolve(process.cwd(), '../template');
                await execPromise(`cp -r ${templatePath} ${saveAsPath}`);
            }
            else {
                await downloadTemplate('ruofee/express-cli-ts#main', saveAsPath, process.cwd());
            }

            loadingDownload.succeed('下载完成');
        }, () => {
            loadingDownload.fail('模板下载失败');
        })();

        let fileMap: {[key: string]: string} = {};

        await tryCatch(() => {
            fileMap = JSON.parse(readFileSync(resolve(saveAsPath, './fileMap.json'), 'utf-8'));
        })();

        let configFiles: string[] = [];

        Object.keys(fileMap).forEach(key => {
            configFiles = configFiles.concat(fileMap[key]);
        });

        const files = readDir(saveAsPath, ['fileMap.json']);
        let copyFiles = files;

        if (!answers.isDefaultConfig) {
            const configs: string[] = answers.configs || [];
            let _files: string[] = [];
            configs.forEach(config => {
                _files = _files.concat(fileMap[config]);
            });
            copyFiles = files.filter(file => {
                for (let configFile of configFiles) {
                    const _configFile = resolve(saveAsPath, configFile);
                    const reg = new RegExp('^' + _configFile);
                    if (reg.test(file)) {
                        return _files.includes(configFile);
                    }
                }
                return true;
            });
        }

        const loadingRender = ora('正在编译模板').start();

        await tryCatch(async () => {
            await Promise.all(copyFiles.map(file => {
                return new Promise(async (res, rej) => {
                    await tryCatch(async () => {
                        const data = await (renderFile as any)(file, {
                            ...answers,
                            configs: answers.isDefaultConfig ? defaultChoices : (answers.configs || [])
                        });
                        const filename = file.replace(new RegExp('express-cli-ts-template'), projectName);
                        await writeFileRecursive(filename, data);
                        res(true);
                    }, rej)();
                });
            }));

            loadingRender.succeed('模板编译成功');
            const loadingPackages = ora('正在安装依赖').start();

            await execPromise(dev ? `rm -rf ${saveAsPath} && cd ${projectName}` : `rm -rf ${saveAsPath} && cd ${projectName} && yarn`);

            loadingPackages.succeed('安装依赖成功');
            console.log(chalk.green('执行以下命令启动项目'));
            console.log(chalk.green(`cd ${projectName} && yarn dev`));
        }, err => {
            loadingRender.fail('模板编译失败');
            console.error(err);
        })();
    }
};