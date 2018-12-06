const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const BookAuthorSchema = new Schema({
  // 本名
  name: {
    type: String
  },
  // 英文名
  name_en: {
    type: String
  },
  intro: String,
  intro_en: String,
  origin: String,
  sort: {
    type: Number,
    default: 100
  },
  gender: {
    type: Number,
    default: -1
  },
  open: {
    type: Boolean,
    default: false
  },
  avatar: String,
  books: [{type: ObjectId, ref: 'Book'}],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// const ObjectId = mongoose.Schema.Types.ObjectId
BookAuthorSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
});

BookAuthorSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
};

module.exports = BookAuthorSchema;