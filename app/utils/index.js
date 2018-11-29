const path = require("path");
const _ = require("lodash");
const fs = require("fs");
const mkdirp = require("mkdirp");
const writefile = require("fs-writefile-promise");
// 配置信息
const {
  FILE_UPLOAD_URL_BASE,
  FILE_UPLOAD_URL_BASE_REL
} = require("../../config");

// 文件上传处理 ///////////////////////////////////////
// 插件
const multer = require("multer");
// - 磁盘存储引擎 (DiskStorage)
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, FILE_UPLOAD_URL_BASE);
//   },
//   filename: function(req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
//     );
//   }
// });

// - 内存存储引擎 (MemoryStorage) (file内含有buffer)
const storage = multer.memoryStorage();

// 文件上传中间件
exports.FileUpload = multer({storage: storage});
// 文件上传处理 End ///////////////////////////////////////

// 文件保存处理 ///////////////////////////////////////
// - 检查路径是否存在 不存在就创建
function checkUploadPath(uploadPath) {
  return new Promise((resolve, reject) => {
    fs.exists(uploadPath, function (exists) {
      if (!exists) {
        mkdirp(uploadPath, function (err) {
          if (err) {
            console.log("Error in folder creation");
            reject(false)
          }
          else {
            resolve(true)
          }
        });
      }
      else{
        resolve(true)

      }
    });
  })

}


// - 主方法
exports.FileSave = function (req, res, next) {
  //   console.log('req', req);
  if (req.files && _.isObject(req.files)) {
    // console.log('req.files', req.files);
    const files = Object.values(req.files);
    if (files.length) {
      // 处理 多个文件 同时上传
      console.log("处理 多个文件 同时上传");
      _.each(files, (file, i) => {
        _.each(file, (item, ii) => {
          // console.log("item", item);
          // 利用 fieldname 从body中获取 path
          if (_.has(req.body, item.fieldname + "Path")) {
            // 存放路径
            const PATH = req.body[item.fieldname + "Path"] + "/";
            // 绝对路径
            const PATH_FULL = FILE_UPLOAD_URL_BASE + PATH;
            // 相对路径
            const PATH_REL = FILE_UPLOAD_URL_BASE_REL + PATH;
            // 生成文件后缀
            const FORMAT = "." + item.mimetype.split("/")[1];
            // console.log('FORMAT', FORMAT);
            // 生成文件名称 替换/为_
            const NAME = PATH.replace(/\//gi, "_") + "_" + Date.now();

            // 判断路径是否存在 不存在就创建
            checkUploadPath(PATH_FULL).then(res=>{
              console.log('res', res);
              if(res){
                writefile(PATH_FULL + NAME + FORMAT, item.buffer).then(filename => {
                    console.log(filename); //=> '/tmp/foo'
                    req.body[item.fieldname] = PATH_REL + NAME + FORMAT;
                  })
                  .then(() => {
                    if (i === files.length - 1 && ii === file.length - 1) {
                      // console.log("i", i);
                      // console.log("ii", ii);
                      console.log("files 遍历完成");
                      next();
                    }
                  })
                  .catch(function (err) {
                    console.error(err);
                    return res.send({
                      status: 500,
                      message: err,
                    });
                  });
              }
              else{
                return res.send({
                  status: 500,
                  message: 'Create Image Fail',
                });
              }
            })


          } else {
            console.log("没有字段：", item.fieldname + "Path");
          }
        });
      });
    }
    else {
      next();
    }

  } else if (req.file && req.file.length) {
    // 处理 单个文件 上传
    next();
  }
};
// 文件保存处理 End ///////////////////////////////////////
