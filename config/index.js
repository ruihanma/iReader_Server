"use strict";   

const path = require("path");

// 文件存放base目录 绝对路径
module.exports.FILE_UPLOAD_URL_BASE = path.join(__dirname, "../public/uploads");
// 文件存放base目录 相对对路径
module.exports.FILE_UPLOAD_URL_BASE_REL = "/uploads";



