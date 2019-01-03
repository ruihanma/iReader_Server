// 加载express模块
const express = require('express');
// 解析一个中间件请求体在你处理的req.body
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const busboy = require('connect-busboy');
// 创建一个新的中间件函数来服务于给定根目录下的文件
const serveStatic = require('serve-static');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// 本地数据读取
const fs = require('fs');
// 预先跑通所有的modal
const models_path = __dirname + '/app/models';
let walk = function (path) {
  fs
    .readdirSync(path)
    .forEach(function (file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      } else if (stat.isDirectory()) {
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

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCrossDomain);

// 数据库相关 ////////////////////////////////
// 引入mongoose 连接数据库

const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/ireader';
mongoose.connect(dbUrl);
mongoose.Promise = require('bluebird');


// 视图相关 ////////////////////////////////
// 设置视图的根目录
app.set('views', './app/views')
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


// 开发时查看问题 //////////////////////////////
const morgan = require('morgan');
const logger = morgan('dev');
app.locals.moment = require('moment');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 区分环境
if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(logger);
  app.locals.pretty = true;
  mongoose.set('debug', true);
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// 监听端口号
app.listen(port);
console.log('iReader Server start on port ' + port);