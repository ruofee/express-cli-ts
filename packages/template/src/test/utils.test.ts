import {expect} from 'chai';
import {readDir} from '../utils';

console.log('🛩 单元测试: utils.ts');

describe('⭕️ readDir 读取文件夹', () => {
    it('读取存在的文件夹, 返回一个长度大于0的数组', () => {
        expect(readDir(__dirname, '../routes')).to.have.length.above(0);
    });
    it('读取不存在的文件夹, 返回一个空数组', () => {
        expect(readDir(__dirname, '../unexitdir')).to.be.empty;
    });
});
