/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */
// 用于打包某一个包
const fs = require('fs')
const execa = require("execa")// 开启子进程，最终还是用rollup打包



// 最终还是要靠rollup打包，build.js承担了自动化的任务，例如参数的配置，文件名字的输入
// 还是需要依赖于rollup.js
async function build(target) {  // rollup -c --environment TARGET:shared
    await execa("rollup", ['-c', '--environment', `TARGET:${target}`],
        { stdio: "inherit" }  //子进程打包的东西共享给父进程
    )
}
