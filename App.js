// 加载express模块
const express = require('express');
// 解析一个中间件请求体在你处理的req.body
const bodyParser = require('body-parser');
// 创建一个新的中间件函数来服务于给定根目录下的文件
const serveStatic = require('serve-static');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// 本地数据读取
const fs = require('fs');
// 预先跑通所有的modal
const models_path = __dirname + '/app/models';
let walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
};
walk(models_path);

// 指定端口号
// - process为全局变量 用来获取环境中的变量
// - 可以通过 PORT=4000 node app 设置其他端口号
const port = process.env.PORT || 3001;


// 启动一个web服务 将示例赋给一个变量
const app = express();

// 数据库相关 ////////////////////////////////
// 引入mongoose 连接数据库
const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/ireader';
mongoose.connect(dbUrl);
mongoose.Promise = require('bluebird');

// 视图相关 ////////////////////////////////
// 设置视图的根目录
app.set('views', './app/views');
// 设置默认的模版引擎
app.set('view engine', 'ejs');
// 获取静态资源
app.use(serveStatic('public'));

// 数据相关 ////////////////////////////////
// 将表单内的数据进行格式化
app.use(bodyParser.urlencoded({
    extended: true
}));
// 将返回的数据json化
app.use(bodyParser.json({limit: '20mb'}));
app.use(cookieParser());
app.use(session({
    secret: 'ireader',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));

// 路由相关 ////////////////////////////////
// 引入路由
const routes = require('./config/router.js');
app.use('/', routes);
// 错误处理
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 开发时查看问题 //////////////////////////////
const morgan = require('morgan');
const logger = morgan('dev');
app.locals.moment = require('moment');

// 区分环境
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger);
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// 监听端口号
app.listen(port);
console.log('Ama Server start on port ' + port);