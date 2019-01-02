const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const BookSchema = new Schema({
  // 名称
  title: {
    type: String,
  },
  // 介绍
  intro: String,
  // 排序
  sort: {
    type: Number,
    default: 100
  },
  // 是否开启
  available: {
    type: Boolean,
    default: false
  },

  // 价格
  price: {
    type: Number,
    default: 0
  },
  // 定金
  earnest: {
    type: Number,
    default: 0
  },

  // 时长（最小单位：分钟）
  period:{
    type: Number,
    default: 1
  },
  // 时段
  periods: {
    type: Schema.Types.Mixed
  },

  // 视觉
  // - 封面
  thumbnail: String,
  // - 图标
  icon: String,
  // - 相册
  album: Array,
  // - 视频
  videos: Array,

  // 关联教师
  teachers: [{type: ObjectId, ref: 'Teachers'}],
  // 分类
  categories: [{type: ObjectId, ref: 'ProjectCategory'}],

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
  //
  if(this.isModified("categories")){
    console.log("save this.categories", this.categories);
  }

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
      // .populate("authors")
      // .populate("categories")
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