const http = require("http");

const fs = require("fs");

http.createServer((req,res)=>{
    if(req.url != "/favicon.ico"){
        var path = "./src"+req.url;
        console.log(path);
        // 怎么读文件
        fs.readFile(path,(a,b)=>{
            // 第一个参数：表示报错信息
            // 第二个参数：读取成功后文件的数据
            console.log(a);
            if(a === null){
                res.write(b);
            }else{
                res.write("404");
            }
            res.end();
        })
    }
}).listen("82","127.0.0.3");