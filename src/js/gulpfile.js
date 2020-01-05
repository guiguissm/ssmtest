const gulp = require("gulp");
const connect = require("gulp-connect");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

const babel = require("gulp-babel");

const proxy = require("http-proxy-middleware");

// console.log(gulp);

// node的模块化方式
// exports暴露入口
// require()接收入口

// 这既是node暴露模块的方式，也是gulp最新支持的定义指令的方式
function abcFn(a){
    console.log("hahaha");
    a();
}
exports.abc = abcFn;


// 正在开发的版本：开发版，本地版：src
// 将要上线的版本：上线版，服务器版：server

// src()找文件
// pipe()管道方法，用来连缀执行下一个操作
// dest()转存到
// watch()开启监听
// parallel()批量执行，同时执行
// series()批量执行，按照顺序执行


// 1.将开发版的文件，转存到上线版中
function indexFn(){
    return gulp.src(["src/index.html"])
    .pipe(gulp.dest("server"))
    .pipe(connect.reload());
}
exports.index = indexFn;

// 2.当文件发生改变后，自动转存
function watchFn(){
    gulp.watch(["src/index.html"],indexFn)
}
exports.watch = watchFn;

// 3.开启服务器，处理文件，响应ajax
// gulp自身没有服务器功能
// 需要通过gulp的第三方插件：gulp-connect
function serverFn(){
    connect.server({
        root:"server",
        port:"83",
        // 4.浏览器自动刷新
        livereload:true,
        // 5.为了实现代理服务器
        middleware: function(connect, opt) {
            return [
                proxy('/abc',  {    //代理之后的名字
                    target: 'https://wanandroid.com/wxarticle', //要代理的地址
                    changeOrigin:true,
                    pathRewrite:{
                        '^/abc':''  //声明路径的重写规则，为代理之后的名字
                    }
                }),
                // proxy('/abc',  {    //代理之后的名字
                //     target: 'https://wanandroid.com/wxarticle', //要代理的地址
                //     changeOrigin:true,
                //     pathRewrite:{
                //         '^/abc':''  //声明路径的重写规则，为代理之后的名字
                //     }
                // })
            ]
        }
    })
}
exports.server = serverFn;

// 5.批量执行
exports.serverWatch = gulp.parallel(serverFn,watchFn);


// function t1(next){
//     console.log(1)
//     next()
// }
// function t2(next){
//     console.log(2)
//     next()
// }
// exports.a = gulp.series(t1,t2);
// exports.b = gulp.parallel(t1,t2);


// 多种路径的指令
function destFn(){
    return gulp.src(["src/**/*","!src/pass.txt"])
    .pipe(gulp.dest("server"))
}
exports.dest = destFn;

// 多个监听的指令
function f1(){console.log("f1")}
function f2(){console.log("f2")}
function f3(){console.log("f3")}
function watchAllFn(){
    gulp.watch(["src/index.html"],indexFn)
    gulp.watch(["src/index.html"],f1)
    gulp.watch(["src/index.html"],f2)
    gulp.watch(["src/index.html"],f3)
}
exports.watchAll = watchAllFn;

// gulp的插件：
    // gulp自身已经是一个基于node的第三方了
    // gulp的插件的使用，直接找使用文档

// 文件合并，压缩，改名
function hygFn(){
    return gulp.src("src/js/*.js")              //找文件
               .pipe(babel({
                    presets: ['@babel/env']
                }))
               .pipe(concat("index.js"))        //合并，并起名
               .pipe(gulp.dest("server/js"))    //转存到
               .pipe(uglify())                  //压缩
               .pipe(rename("index.min.js"))    //改新名字
               .pipe(gulp.dest("server/js"))    //转存到
}
exports.hyg = hygFn;


// gulp不能实现ES6转ES5
// babel是js编译器，将ES5+的版本，转成低版本的ES语法
// 先拿到babel对gulp的支持：gulp-babel的插件
// 拿到babel自身的配置信息和ES6转ES5的插件
// @babel/core
// @babel/preset-env
// ES6转ES5

function sTf(){
    return gulp.src("src/js/a.js")
    .pipe(babel({
            presets: ['@babel/env']
        }))
    .pipe(gulp.dest("server/js"))
}
exports.sTf = sTf;
