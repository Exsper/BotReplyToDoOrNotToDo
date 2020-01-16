'use strict';


// console输入输出
var readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    var replyStringArr = Reply(line);
    var replyStringArr = Reply(line);
    if ((replyStringArr[0] == "") && (replyStringArr[1] == "")) return;
    console.log(replyStringArr);
});
rl.on('close', function () {
    process.exit();
});



/**
 * 寻找s1的末尾和s2的开头的重复部分
 * @param {string} s1
 * @param {string} s2
 * @return {int} 重复部分在s1的起始点 
 */
function LookForTheSame(s1, s2) {
    var s1length = s1.length;
    var s2length = s2.length;
    var start = -1;
    var possibleStart = [];
    //var possibleLength = [];

    if ((s1length <= 0) || (s2length <= 0)) return -1;

    for (var i = 0; i < s1length; ++i) {
        if (s1[i] == s2[0]) start = i; // 找到相同点，开始核对
        for (var j = 1; j < s2length; ++j) {
            if (i + j >= s1.length) { // s1到句末，核对结束
                possibleStart.push(start);
                //possibleLength.push(j);
                break;
            }
            else if (s1[i + j] != s2[j]) { // 核对中出现不同字符，不是重复部分
                break;
            }
        }
        // s2到句末，s1没到句末，不是重复部分
    }
    //一般直接取重复最长的（第一个）就行了
    if (possibleStart.length <= 0) return -1;
    else return possibleStart[0];
}





/**
 * 根据含“不”的选择性询问生成对应回复
 * @param {string} s 接受的消息
 * @return {[string, string]} [回复1, 回复2]
 */
function Reply(s) {
    var prefix = s.substring(0, 1);
    // 排除非！开头的消息
    if (!(prefix == "!" || prefix == "！")) return ["", ""];
    // 排除不含“不”的消息
    if (s.indexOf("不") < 0) return ["", ""];
    // 排除含有“不不”的消息（应该不是询问选择的）
    if (s.indexOf("不不") >= 0) return ["", ""];
    // 排除过长和过短消息
    if (s.length > 30 || s.length < 4) return ["", ""];

    var ask = s.substring(1);
    var asklength = ask.length;

    // 获取所有“不”的位置
    var arrOr = [];
    for (let i = 0; i < asklength; ++i) {
        if (ask[i] == "不") arrOr.push(i);
    }
    // 删除头尾的“不”
    if (arrOr[0] == 0) arrOr = arrOr.slice(1);
    if (arrOr[arrOr.length] == 0) arrOr.pop();
    // 分析所有按“不”拆分情况，找出“不”两边有相同字符串的情况
    var possibleNot = [];
    var possibleStart = [];
    var possibleLength = [];
    for (let i = 0; i < arrOr.length; ++i) {
        let s1 = ask.substring(0, arrOr[i]);
        let s2 = ask.substring(arrOr[i] + 1, ask.length);
        let start = LookForTheSame(s1, s2);
        if (start < 0) continue;
        else {
            possibleNot.push(arrOr[i]);
            possibleStart.push(start);
            possibleLength.push(arrOr[i] - start);
        }
    }
    if (possibleNot.length <= 0) return ["", ""];
    // 极端情况： aaabbb不bbbccc不bbbcccddd
    // 一般取最长的那个，如果都一样长那就取最后一个好了
    var indexOfMax = 0;
    var tempMax = possibleLength[0];
    for (let i = 1; i < possibleLength.length; ++i) {
        if (possibleLength[i] > tempMax) {
            tempMax = possibleLength[i];
            indexOfMax = i;
        }
    }

    var doStart = possibleStart[indexOfMax];
    var notIndex = possibleNot[indexOfMax];
    var doLength = possibleLength[indexOfMax];
    // 具体情况：
    // 今天晚上 [吃] 不 [吃] 饭 = 回答：[吃]饭/不[吃]饭
    // 今天晚上 [要] 不 [要] 吃饭 = 回答：[要]吃饭/不[要]吃饭
    // 今天晚上 [吃饭] 不 [吃饭] = 回答：[吃饭]/不[吃饭]
    var doString = ask.substring(doStart, notIndex);
    var endString = "";
    if (notIndex + doLength + 1 < asklength) endString = ask.substring(notIndex + doLength + 1);

    // 细节处理
    // 重复词开头为“！”视为恶意代码，不作回应
    var doStringPrefix = doString.substring(0, 1);
    if ((doStringPrefix == "!") || (doStringPrefix == "！")) return ["", ""];
    // 结束词包含疑问词/符号，取符号前的语句
    if (endString.length > 0) {
        var endStringRegex = /(.*?)(?=\?|？|!|！|,|，|\.|。|呢)+/;
        var matchResult = endString.match(endStringRegex);
        if (!!matchResult) {
            endString = matchResult[0];
        }
    }

    //输出
    var reply1 = doString + endString;
    var reply2 = "不" + doString + endString;
    return [reply1, reply2];
}
