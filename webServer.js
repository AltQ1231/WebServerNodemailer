// node 全局变量
// global.serviceEmailAddress = "altq1231@163.com";
// global.servicePass = "ZCANBDURWMKBQNAP";
global.serviceEmailAddress = "2783956045@qq.com";
global.servicePass = "zshfnkoxosyfdhbh";

const nodemailer = require("nodemailer");
const moment = require("moment");
const crypto = require("crypto");
//导入express框架
const express = require("express");

//创建web服务
const app = express();
//监听端口

//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "x-requested-with");
    res.header("Access-Control-Allow-Methods", "*");
    // res.header('Access-Control-Allow-Credentials', true)
    // res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method.toLowerCase() == "options") res.sendStatus(200);
    //让options尝试请求快速结束
    else next();
});

// // 同步的。
// const buf = crypto.randomInt(99999, 1000000);
// console.log(`${buf.length} 位的随机数据: ${buf.toString("hex")}`);

const server = app.listen(5000, function () {
    console.log("Express app server listening on port %d", server.address().port);
});

app.get("/getCaptcha", (req, res) => {
    console.log("server", req.query);

    sendMailFunc(req.query.emailAddress, (result) => {
        if (result.isSend) {
            console.log(111, result);
            //将结果返回给客户端
            res.send({
                resCode: 200,
                data: result,
            });
        } else {
            console.log(222, result);
            //将结果返回给客户端
            res.send({
                resCode: 500,
                data: result,
            });
        }
    });
});

function sendMailFunc(customAddress, sendCaptchaInfo) {
    // 获取当前时间
    let sendTime = moment().format("MMMM Do YYYY, h:mm:ss a");

    const captchaNum = crypto.randomInt(99999, 1000000);

    let resultData = {
        isSend: false,
        msg: "邮件发送成功~",
        captcha: sendTime,
    };
    console.log(captchaNum, customAddress);
    nodemailer.createTestAccount((err, account) => {
        // 填入自己的账号和密码
        let transporter = nodemailer.createTransport({
            // host: "pp.qq.com",
            service: "qq",
            port: 465,
            secure: true, // 如果是 true 则port填写465, 如果 false 则可以填写其它端口号
            secureConnection: true, // 使用了 SSL
            auth: {
                user: global.serviceEmailAddress, // 发件人邮箱
                pass: global.servicePass, // 发件人密码(用自己的...)
            },
        });
        // 填写发件人, 收件人
        let mailOptions = {
            // 发件人地址
            from: global.serviceEmailAddress,
            // 收件人列表, 向163邮箱, gmail邮箱, qq邮箱各发一封
            to: customAddress,
            // to: "18270893653@163.com",
            // 邮件主题
            subject: "验证码",
            // 文字内容
            text: "发送附件内容",
            // html内容
            html: "<p>验证码: &nbsp;" + captchaNum + " </p>",
            // 附件内容 是一个列表, 第一个是目录下的pack.json文件, 第二是御坂美琴的头像, 第三是作者在拍的图片的zip包
            // attachments: [{
            //     filename: 'package.json',
            //     path: path.resolve(__dirname, 'package.json')
            // }, {
            //     filename: 'bilibili.jpg',
            //     path: path.resolve(__dirname, 'bilibili.jpg')
            // }, {
            //     filename: 'room.zip',
            //     path: path.resolve(__dirname, 'room.zip')
            // }],
        };

        // 发送邮件
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                resultData.isSend = false;
                resultData.msg = "邮件发送失败，请稍后再试";
                sendCaptchaInfo(resultData);
                return console.log(error);
            }
            resultData.isSend = true;
            sendCaptchaInfo(resultData);
        });
    });
}
