// 路由
// 引入控制器

const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const express = require("express");
const router = express.Router();

// 插件multer
const {FileUpload} = require("../app/utils");

// 中间件
const {FileSave} = require('../app/utils');

const BookCategory = require("../app/controllers/book.category");
const BookAuthor = require("../app/controllers/book.author");
const Book = require("../app/controllers/book");

const ProjectCategory = require("../app/controllers/project.category");


// 书 - 作者 - 列表
router.get("/api/book/list", Book.list);
// 书 - 作者 - 保存
router.post(
  "/api/book/update",
  FileUpload.fields([
    {name: "thumbnail", maxCount: 1}
  ]),
  FileSave,
  Book.update
);
// 书 - 作者 - 删除
router.delete("/api/book/del", Book.del);

// 书 - 作者 - 列表
router.get("/api/book/author/list", BookAuthor.list);
// 书 - 作者 - 保存
router.post(
  "/api/book/author/update",
  FileUpload.fields([
    {name: "avatar", maxCount: 1}
  ]),
  FileSave,
  BookAuthor.update
);
// 书 - 作者 - 删除
router.delete("/api/book/author/del", BookAuthor.del);

// 书 - 分类 - 列表
router.get("/api/book/category/list", BookCategory.list);
// 书 - 分类 - 保存
router.post(
  "/api/book/category/update",
  FileUpload.fields([
    {name: "icon", maxCount: 1},
    {name: "background", maxCount: 1}
  ]),
  FileSave,
  BookCategory.update
);
// 书 - 分类 - 删除
router.delete("/api/book/category/del", BookCategory.del);


// 项目 - 分类 - 列表
router.get("/api/project/category/list", ProjectCategory.list);
// 项目 - 分类 - 保存
router.post("/api/project/category/update", FileUpload.fields([{name: "icon", maxCount: 1}, {
  name: "background",
  maxCount: 1
}]), FileSave, ProjectCategory.update);
// 项目 - 分类 - 删除
router.delete("/api/project/category/del", ProjectCategory.del);


module.exports = router;
