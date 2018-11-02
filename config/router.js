// 路由
// 引入控制器

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: __dirname + '/public/uploads/' })

const BookCategory = require('../app/controllers/book.category');


// 书 - 分类 - 列表
router.get('/api/book/category/list', BookCategory.list);
// 书 - 分类 - 保存
router.post('/api/book/category/update', upload.single('background'), BookCategory.update);
// 书 - 分类 - 删除
router.delete('/api/book/category/del', BookCategory.del);


module.exports = router;