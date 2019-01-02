// 项目 分类
let mongoose = require('mongoose');
let Category = mongoose.model('ProjectCategory');

let _ = require('underscore');
let fs = require('fs');
let path = require('path');

// - 项目 - 分类 - 保存
exports.update = function (req, res) {
    console.log('project category req : ', req.body);

    // console.log('save req', req.poster);
    // 赋值id
    let id = req.body.id;
    let _category_tmp = req.body;
    let _category;

    if (req.body.background) {
        _category_tmp.background = req.body.background
    }
    if(req.body.icon) {
        _category_tmp.icon = req.body.icon
    }

    if (id) {
        Category.findById(id, function (err, category) {
            if (err) {
                console.log(err);
                return res.send({
                    status: 500,
                    message: 'Category Update Failed',
                    content: err
                });
            }

            _category = _.extend(category, _category_tmp);
            _category.save(function (err, category) {
                if (err) {
                    console.log(err);
                    return res.send({
                        status: 500,
                        message: 'Category Update Failed',
                        content: err
                    });
                }

                return res.send({
                    status: 200,
                    message: category.title + ' Update Success',
                    content: category
                });
            })
        })
    }
    else {
        let category = new Category(_category_tmp);

        category.save(function (err, category) {
            if (err) {
                console.log(err);

                return res.send({
                    status: 500,
                    message: 'Category Saved Failed',
                    content: err
                });
            }
            return res.send({
                status: 200,
                message: category.title + ' Saved Success',
                content: category
            });
        })
    }
};

// - 项目 - 分类 - 列表
exports.list = function (req, res) {
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err);

            return res.send({
                status: 500,
                message: 'Categories Fetched Failed',
                content: err
            });
        }

        return res.send({
            status: 200,
            message: 'Categories Fetched Success',
            content: categories
        });
    })
};

// - 项目 - 分类 - 删除
exports.del = function (req, res) {

    var id = req.query.id;
    if (id) {
        Category.remove({_id: id}, function (err, category) {
            if (err) {
                console.log(err);
                return res.send({
                    status: 500,
                    message: 'Delete Failed',
                    content: err
                });
            } else {
                return res.send({
                    status: 200,
                    message: 'Delete Success',
                    content: ''
                });
            }
        });
    }
};