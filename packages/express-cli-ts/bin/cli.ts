#!/usr/bin/env node

import {Command} from 'commander';
import chalk from 'chalk';
import init from './init';
const jsonFile = require('../package.json');
const program = new Command();

program
    .version(jsonFile.version)
    .usage('<command> [项目名称]')
    .command('init <project_name>')
    .description('创建新项目')
    .action((project_name) => {
        if (!project_name) {
            console.log(chalk.red('🥊 请使用正确格式: express@cli init <project_name>'));
            program.help(); 
        }
        else {
            init(project_name);
        }
    });
program.parse(process.argv);
