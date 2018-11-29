const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const BookSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  title_en: {
    type: String,
    unique: true
  },
  intro: String,
  intro_en: String,
  sort: {
    type: Number,
    default: 100
  },
  open: {
    type: Boolean,
    default: false
  },
  r18: {
    type: Boolean,
    default: false
  },
  thumbnail: String,
  chapters: [{type: ObjectId, ref: 'Chapter'}],
  author: [{type: ObjectId, ref: 'Author'}],
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
BookSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
});

BookSchema.statics = {
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

module.exports = BookSchema;