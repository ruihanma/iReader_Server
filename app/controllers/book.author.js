let mongoose = require('mongoose');
let Author = mongoose.model('BookAuthor');

let _ = require('underscore');
let fs = require('fs');
let path = require('path');

// - 书 - 分类 - 保存
exports.update = function (req, res) {
    console.log('book author req : ', req.body);
    // console.log('book author req file : ', req.file);
    // console.log('book author req files : ', req.files);
    // console.log('book author background : ', req.background);
    // console.log('book author icon : ', req.icon);
    // console.log('book author req : ', req.yes);


    // console.log('save req', req.poster);

    let id = req.body.id;
    let _author_tmp = req.body;
    let _author;

    if (req.body.background) {
        _author_tmp.background = req.body.background
    }
    if(req.body.icon) {
        _author_tmp.icon = req.body.icon
    }

    if (id) {
        Author.findById(id, function (err, author) {
            if (err) {
                console.log(err);
                return res.send({
                    status: 500,
                    message: 'Author Update Failed',
                    content: err
                });
            }

            _author = _.extend(author, _author_tmp);
            _author.save(function (err, author) {
                if (err) {
                    console.log(err);
                    return res.send({
                        status: 500,
                        message: 'Author Update Failed',
                        content: err
                    });
                }

                return res.send({
                    status: 200,
                    message: author.title + ' Update Success',
                    content: author
                });
            })
        })
    }
    else {
        let author = new Author(_author_tmp);

        author.save(function (err, author) {
            if (err) {
                console.log(err);

                return res.send({
                    status: 500,
                    message: 'Author Saved Failed',
                    content: err
                });
            }
            return res.send({
                status: 200,
                message: author.name + ' Saved Success',
                content: author
            });
        })
    }
};

// - 书 - 分类 - 列表
exports.list = function (req, res) {
    Author.fetch(function (err, content) {
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
            content
        });
    })
};

// - 书 - 分类 - 删除
exports.del = function (req, res) {

    var id = req.query.id;
    if (id) {
        Author.remove({_id: id}, function (err, author) {
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