let mongoose = require("mongoose");
let Book = mongoose.model("Book");
let BookAuthor = mongoose.model("BookAuthor");
let BookCategory = mongoose.model("BookCategory");

let _ = require("underscore");
let fs = require("fs");
let path = require("path");

// - 书 - 分类 - 保存
exports.update = function(req, res) {
  console.log("book req : ", req.body);
  // console.log('book book req file : ', req.file);
  // console.log('book book req files : ', req.files);
  // console.log('book book background : ', req.background);
  // console.log('book book icon : ', req.icon);
  // console.log('book book req : ', req.yes);

  // console.log('save req', req.poster);

  let id = req.body.id;
  let _book_tmp = req.body;
  let _book;

  if (req.body.thumbnail) {
    _book_tmp.thumbnail = req.body.thumbnail;
  }

  if (id) {
    Book.findById(id, function(err, book) {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "Book Update Failed",
          content: err
        });
      }

      _book = _.extend(book, _book_tmp);
      _book.save(function(err, book) {
        if (err) {
          console.log(err);
          return res.send({
            status: 500,
            message: "Book Update Failed",
            content: err
          });
        }

        // 处理分类
        handleChildrenImplant(
          _book_tmp["categories"],
          BookCategory,
          "books",
          book
        );
        // 处理作者
        handleChildrenImplant(
          _book_tmp["authors"],
          BookAuthor,
          "books",
          book
        );

        return res.send({
          status: 200,
          message: book.title + " Update Success",
          content: book
        });
      });
    });
  } else {
    let book = new Book(_book_tmp);

    book.save(function(err, book) {
      if (err) {
        console.log(err);

        return res.send({
          status: 500,
          message: "Book Saved Failed",
          content: err
        });
      }
      console.log("book save", book);
      // 处理分类
      handleChildrenImplant(
        _book_tmp["categories"],
        BookCategory,
        "books",
        book
      );
      // 处理作者
      handleChildrenImplant(_book_tmp["authors"], BookAuthor, "authors", book);

      return res.send({
        status: 200,
        message: book.title + " Saved Success",
        content: book
      });
    });
  }
};

// 处理子字段存储
function handleChildrenImplant(children, Model, variable, child) {
//   console.log("handleChildrenImplant", children, Model, variable, child);

  // 处理分类
  if (Array.isArray(children) && children.length > 0) {
    _.each(children, (id, key) => {
      Model.findById(id, (err, parent) => {
        // console.log("parent", parent);
        if (err) console.log("find parent err : ", err);
        if (parent) {
          if(parent[variable].indexOf(child._id) < 0){
            parent[variable].push(child);
            parent.save(err => {
              if (err) console.log("save parent err : ", err);
            });
          }
        }
      });
    });
  }
}

// - 书 - 分类 - 列表
exports.list = function(req, res) {
  Book.fetch(function(err, content) {
    if (err) {
      console.log(err);

      return res.send({
        status: 500,
        message: "Books Fetched Failed",
        content: err
      });
    }

    return res.send({
      status: 200,
      message: "Books Fetched Success",
      content
    });
  });
};

// - 书 - 分类 - 删除
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Book.remove({ _id: id }, function(err, book) {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "Delete Failed",
          content: err
        });
      } else {
        return res.send({
          status: 200,
          message: "Delete Success",
          content: ""
        });
      }
    });
  }
};
