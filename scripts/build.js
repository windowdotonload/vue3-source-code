/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */
// 目录下的所有包打包
const fs = require('fs')
const execa = require("execa")// 开启子进程，最终还是用rollup打包

const targets = fs.readdirSync('packages').filter(f => {
    // fs.statSync()方法用于返回有关给定文件路径的信息。返回的fs.Stat对象具有多个字段和方法，以获取有关文件的更多详细信息。
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false
    }
    return true
})


// 最终还是要靠rollup打包，build.js承担了自动化的任务，例如参数的配置，文件名字的输入
// 还是需要依赖于rollup.js
async function build(target) {  // rollup -c --environment TARGET:shared
    await execa("rollup", ['-c', '--environment', `TARGET:${target}`],
        { stdio: "inherit" }  //子进程打包的东西共享给父进程
    )
}

function runParallel(targets, build) {
    const res = []
    for (const item of targets) {
        const p = build(item)
        res.push(p)
    }

    return Promise.all(res)
}

runParallel(targets, build)