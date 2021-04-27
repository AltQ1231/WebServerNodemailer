exports.execute = function (res) {
    console.log("execute");
    // var cmd = `cd /d "${packagePath}" && yarn build`;
    // exec(cmd, function (error, stdout, stderr) {
    //     if (error) {
    //         console.log("打包错误", error);
    //         global.isPackaged = false;
    //         res.send({
    //             resCode: 10,
    //             // url: "http://localhost:5000"
    //             url: "打包错误",
    //         });
    //     } else {
    //         console.log("打包成功", global.isPackaged, stderr);
    //         copyFolder(packagePath + "/dist", toPath + "/dist");
    //         res.send({
    //             resCode: 200,
    //             url: "http://localhost:5000",
    //             // url: "正在打包。。。"
    //         });
    //     }
    // });
};

exports.copyFolder = function (from, to) {
    console.log("copyFolder");
    // // 复制文件夹到指定目录
    // let files = [];
    // if (fs.existsSync(to)) {
    //     // 文件是否存在 如果不存在则创建
    //     files = fs.readdirSync(from);
    //     files.forEach(function (file, index) {
    //         var targetPath = from + "/" + file;
    //         var toPath = to + "/" + file;
    //         if (fs.statSync(targetPath).isDirectory()) {
    //             // 复制文件夹
    //             copyFolder(targetPath, toPath);
    //         } else {
    //             // 拷贝文件
    //             fs.copyFileSync(targetPath, toPath);
    //         }
    //     });
    //     global.isPackaged = true;
    // } else {
    //     fs.mkdirSync(to);
    //     copyFolder(from, to);
    // }
};
