let mongoose = require("mongoose");
let Book = mongoose.model("Book");
let BookAuthor = mongoose.model("BookAuthor");
let BookCategory = mongoose.model("BookCategory");

const { ArrDiff } = require("../utils");

let _ = require("underscore");
let fs = require("fs");
let path = require("path");

// - 书 - 分类 - 保存
exports.update = async function(req, res) {
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
  let bookPrev = {};

  if (id) {
    await Book.findById(id, function(err, bookFound) {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "Book Update Failed",
          content: err
        });
      }
      bookPrev = {
        categories: bookFound["categories"],
        authors: bookFound["authors"]
      };
      _book = _.extend(bookFound, _book_tmp);
      _book.save(function(err, bookSaved) {
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
          BookCategory,
          "books",
          bookSaved,
          bookPrev,
          "categories"
        );
        // 处理作者
        handleChildrenImplant(
          BookAuthor,
          "books",
          bookSaved,
          bookPrev,
          "authors"
        );

        return res.send({
          status: 200,
          message: bookSaved.title + " Update Success",
          content: bookSaved
        });
      });
    });
  } else {
    let book = new Book(_book_tmp);
    bookPrev = {
      categories: [],
      authors: []
    };
    book.save(function(err, bookSaved) {
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
        BookCategory,
        "books",
        bookSaved,
        bookPrev,
        "categories"
      );
      // 处理作者
      handleChildrenImplant(
        BookAuthor,
        "books",
        bookSaved,
        bookPrev,
        "authors"
      );

      return res.send({
        status: 200,
        message: book.title + " Saved Success",
        content: book
      });
    });
  }
};

// 处理子字段存储
async function handleChildrenImplant(
  Model,
  ModelKey,
  newValue,
  preValue,
  ValueKey
) {
  // console.log("handleChildrenImplant newValue", newValue);
  // console.log("handleChildrenImplant preValue", preValue);

  /*
   * Model     需要更新的 Model
   * ModelKey  需要更新的 Model 的字段
   * newValue  已经存储的 Value
   * preValue  之前的 Value
   * ValueKey  存储后需要处理的字段
   */
  // 处理分类
  // 比较之前的数据与新数据
  // 如果新数据比之前的长或者等于
  let changed = await ArrDiff(preValue[ValueKey], newValue[ValueKey]); // 获取之前与之后区别的数组

  if (changed && changed.length > 0) {
    // 如果有变化的id
    _.each(changed, (id, key) => {
      // 遍历发生变化的id
      Model.findById(id, (err, target) => {
        if (target) {
          // 找到目标
          // 判断id是否在里面
          if (target[ModelKey].indexOf(newValue._id) < 0) {
            // console.log("不在 PUSH");

            target[ModelKey].push(newValue);
            target.save(err => {
              if (err) console.log("save parent err : ", err);
            });
          } else {
            target[ModelKey].splice(target[ModelKey].indexOf(newValue._id), 1);
            // console.log("在里面 SPLICE");

            target.save(err => {
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
exports.del = async function(req, res) {
  var id = req.query.id;
  if (id) {
    await Book.remove({ _id: id }, function(err, book) {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "Delete Failed",
          content: err
        });
      }
      else{
        return res.send({
          status: 200,
          message: "Delete Success",
          content: ""
        });
      }
    });

    await BookCategory.update(
      { books: req.body._id },
      { $pull: { books: req.body._id } },
      function(err, response) {
        if (err) throw err;
      }
    );

    await BookAuthor.update(
      { books: req.body._id },
      { $pull: { books: req.body._id } },
      function(err, response) {
        if (err) throw err;
      }
    );

  } else {
    return res.send({
      status: 500,
      message: "Delete Failed! No ID was found",
      content: ""
    });
  }
};
