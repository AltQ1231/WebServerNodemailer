//端口号(本地5400)
const port = process.env.PORT || 5400;
// 本机IP地址
const os = require("os");
const networkInterfaces = os.networkInterfaces();
const host = networkInterfaces[Object.keys(networkInterfaces)[0]][1].address;

// 验证码全局变量
let tempCaptchaNum = null;

const captchaFunc = require("./route/captcha");

// 上传静态服务器地址
const staticPath = "./static";
const moment = require("moment");
let uploadFilename = '';

const express = require("express");
var exec = require("child_process").exec;

//导入fs框架
const fs = require("fs");
//导入path框架
const path = require("path");

//创建web服务
const app = express();

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

//静态资源托管 最终要访问http://localhost:5400/static/XXXXXXXXXXXXXX.webp（jpg）
app.use("/static", express.static(path.join(__dirname, staticPath)));

//1.引入中间件
var multer = require("multer"); //multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。
const storage = multer.diskStorage({
    //文件存储路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, staticPath));
    },
    //修改上传文件的名字
    //file 是个文件对象 ,fieldname对应在客户端的name属性
    //存储的文件需要自己加上文件的后缀，multer并不会自动添加
    //这里直接忽略文件的后缀.
    filename: function (req, file, cb) {
        //自定义设置文件的名字
        timestamp = new Date().getTime();
        let filenameArr = file.originalname.split('.');
        let mimetypename = filenameArr[filenameArr.length - 1];
        uploadFilename = 'upload-' + timestamp + '.' + mimetypename;
        cb(null, uploadFilename);
    },
});

//2.实例化multer(这个实例内部已经进行过封装)cls
let objMulter = multer({ storage: storage }); //dest: 指定 保存位置（存到服务器)

//3.安装中间件
app.use(objMulter.any()); //运行上传什么类型的文件  any就代表任意类型

//设置路由
app.get("/", function (req, res) {
    res.send("A express API Web Server");
});

// 登录
app.post("/login", (req, res) => {
    console.log("server", req.query);

    // if (Number(req.query.captcha) === Number(global.captchaNum)) {
    //将结果返回给客户端
    res.send({
        resCode: 200,
        data: {
            msg: `欢迎你`,
        },
    });
    // } else {
    //     //将结果返回给客户端
    //     res.send({
    //         resCode: 220,
    //         data: { msg: "验证码错误" },
    //     });
    // }
});


// 上传接口

app.post("/upInterface", (req, res) => {
    // res.sendStatus(200);

    console.log("上传", req.files);
    //将结果返回给客户端
    res.status(200).send({
        imageUrl: `http://${host}:${port}/${staticPath}/${uploadFilename}`,
    });
});

app.get("/checkPackage", (req, res) => {
    console.log("server checkPackage", global.isPackaged);

    if (global.isPackaged) {
        // //将地址返回给客户端
        res.send({
            resCode: 200,
            url: "http://localhost:5000",
        });
    } else {
        // //将地址返回给客户端
        res.send({
            resCode: 100,
            url: "打包出错，请重新上传",
        });
    }
});

// 发送邮件验证码
app.get("/sendEmailCaptcha", (req, res) => {
    // global.captchaNum = crypto.randomInt(99999, 1000000);
    console.log("server", req.query, global.captchaNum);
    //将结果返回给客户端
    // res.send({
    //     resCode: 200,
    //     data: {
    //         msg: "邮件发送成功~",
    //         sendTime: moment().format("YYYY-MM-DD hh:mm:ss"),
    //     },
    // });

    captchaFunc.sendMailFunc(req.query.emailAddress, (result) => {
        if (result.isSend) {
            console.log(111, result);
            tempCaptchaNum = result.captchaNum;
            //将结果返回给客户端
            res.send({
                resCode: 200,
                data: { msg: result.msg, sendTime: result.sendTime },
            });
        } else {
            console.log(222, result);
            //将结果返回给客户端
            res.send({
                resCode: 500,
                data: { msg: result.msg, sendTime: result.sendTime },
            });
        }
    });
});

// 验证验证码
app.get("/verificationCode", (req, res) => {
    console.log("server", req.query, tempCaptchaNum);

    if (Number(req.query.captcha) === Number(tempCaptchaNum)) {
        //将结果返回给客户端
        res.send({
            resCode: 200,
            data: {
                msg: `欢迎你 ${req.query.emailAddress}`,
                user: req.query.emailAddress,
            },
        });
    } else {
        //将结果返回给客户端
        res.send({
            resCode: 220,
            data: { msg: "验证码错误" },
        });
    }
});

//监听端口

const server = app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`or http://${host}:${port}`);
});
