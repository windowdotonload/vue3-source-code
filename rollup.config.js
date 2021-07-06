/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */

// console.log(process.env.TARGET)

// 根据环境变量中的TARGET 获取对应模块中的package.json


const path = require('path')
const json = require("@rollup/plugin-json")
import { nodeResolve } from '@rollup/plugin-node-resolve';
// const resolveNode = require("@rollup/plugin-node-resolve")
const ts = require("rollup-plugin-typescript2")

const packagesDir = path.resolve(__dirname, 'packages') //找到packages
// packageDir --- 打包的基准目录
const packageDir = path.resolve(packagesDir, process.env.TARGET)    //找到具体某个模块 如：D:\MYCODE_Project\vue3-source\packages\reaactiviety 
const name = path.basename(packageDir)
console.log('this is name in rollup.js------- v', name)
// 针对的是packageDir这个模块
const resolve = (p) => path.resolve(packageDir, p)
// 拿到package.json这个文件
const pkg = require(resolve('package.json'))
const options = pkg.buildOptions

// 做一个映射，根据formats格式确定需要打包的内容
const outputConfig = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife' //立即执行函数
    }
}

function createOptions(format, output) {
    output.name = options.name
    output.sourcemap = true

    return {
        input: resolve(`src/index.ts`),
        output,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            nodeResolve(),
        ]
    }
}
// rollup 最终需要导出配置
export default options.formats.map(item => createOptions(item, outputConfig[item]))



