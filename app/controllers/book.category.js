let mongoose = require('mongoose');
let Category = mongoose.model('BookCategory');

let _ = require('underscore');
let fs = require('fs');
let path = require('path');

// - 书 - 分类 - 保存
exports.update = function (req, res) {
    console.log('book category req : ', req.body);
    console.log('book category req files : ', req.files);
    console.log('book category req file : ', req.file);


    // console.log('save req', req.poster);

    // let id = req.body.category._id;
    // let _category_tmp = req.body.category;
    // let _category;

    // if (req.poster) {
    //     _category_tmp.cover = req.poster
    // }

    // if(req.icon) {
    //     _category_tmp.icon = req.icon

    // }

    // if (id) {
    //     Category.findById(id, function (err, category) {
    //         if (err) {
    //             console.log(err);
    //             return res.send({
    //                 status: 500,
    //                 message: 'Category Update Failed',
    //                 content: err
    //             });
    //         }

    //         _category = _.extend(category, _category_tmp);
    //         _category.save(function (err, category) {
    //             if (err) {
    //                 console.log(err);
    //                 return res.send({
    //                     status: 500,
    //                     message: 'Category Update Failed',
    //                     content: err
    //                 });
    //             }

    //             return res.send({
    //                 status: 200,
    //                 message: category.name + ' Update Success',
    //                 content: category
    //             });
    //         })
    //     })
    // }
    // else {
    //     let category = new Category(_category_tmp);

    //     category.save(function (err, category) {
    //         if (err) {
    //             console.log(err);

    //             return res.send({
    //                 status: 500,
    //                 message: 'Category Saved Failed',
    //                 content: err
    //             });
    //         }
    //         console.log('serve category', category);
    //         return res.send({
    //             status: 200,
    //             message: category.name + ' Saved Success',
    //             content: category
    //         });
    //     })
    // }
};

// - 书 - 分类 - 列表
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

// - 书 - 分类 - 删除
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