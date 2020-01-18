'use strict';

// 测试exsperDoOrNot模块

let exsperDoOrNot = require('./exsperDoOrNot');

// console输入输出
let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    try {
        let ask = line;
        if (ask.substring(0, 1) === "!" || ask.substring(0, 1) === "！") { // 我的nodejs v12运行startWith报错
            try {
                let replyString = exsperDoOrNot.Reply(ask.trim());
                if (replyString === "") console.log("do nothing");
                else console.log(replyString);
            }
            catch (ex) {
                console.log(ex);
            }
        } else {
            console.log("do nothing");
        }
    }
    catch (ex) {
        console.log(ex);
    }
});
rl.on('close', function () {
    process.exit();
});


