#!/usr/bin/env node

const inquirer = require('inquirer');
const ejs = require('ejs');
const path = require('path');
const {readDir, writeFileRecursive} = require('../utils');
const {exec} = require('child_process');

async function start() {
    const filesMap = {
        axios: {
            name: '网络请求库(axios)',
            files: ['./src/utils/http.ts']
        },
        routes: {
            name: '路由(Express.Router)',
            files: [
                './src/middlewares/routes.ts',
                './src/middlewares/bodyParser.ts',
                './src/routes'
            ]
        },
        winston: {
            name: '日志(winston)',
            files: [
                './src/middlewares/log.ts',
                './src/middlewares/errorLog.ts'
            ]
        },
        unitTest: {
            name: '单元测试(mocha + chai)',
            files: ['./src/test']
        }
    };
    let configFiles = [];
    const configsChoices = Object.keys(filesMap).map(key => {
        const config = filesMap[key];
        configFiles = configFiles.concat(config.files);
        return {key: config.name, value: key};
    })
    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '项目名叫什么?',
            default: 'express-ts-project',
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
            choices: configsChoices
        },
    ]);
    try {
        const templatePath = path.resolve(__dirname, '../template');
        const files = readDir(__dirname, '../template', [], ['node_modules', 'build', 'log']);
        let copyFiles = files;
        if (!result.isDefaultConfig) {
            const configs = result.configs || [];
            let _files = [];
            configs.forEach(config => {
                _files = _files.concat(filesMap[config].files);
            });
            copyFiles = files.filter(file => {
                for (let configFile of configFiles) {
                    let _configFile = path.resolve(templatePath, configFile);
                    if (file === _configFile) {
                        return _files.includes(configFile);
                    }
                }
                return true;
            });
        }
        try {
            await Promise.all(copyFiles.map(file => {
                return new Promise((resolve, reject) => {
                    ejs.renderFile(file, {
                        ...result,
                        configs: result.configs || []
                    })
                        .then(data => {
                            const filename = file.replace(/^.*express-ts\/template/, `../${result.projectName}`);
                            writeFileRecursive(__dirname, filename, data).then(resolve, reject);
                        }, reject);
                });
            }));
            console.log('⛽️ 项目创建成功');
            console.log('🏃 正在安装依赖');
            exec(`cd ../${result.projectName} && yarn`, err => {
                if (err) {
                    console.error('😭 项目创建失败', err);
                }
                console.log(`🙆 项目创建完成, 执行命令启动项目: cd ../${result.projectName} && yarn dev`);
            });
        }
        catch(err) {
            console.error('😭 项目创建失败', err);
        }
    }
    catch(err) {
        throw err;
    }
}

start();
