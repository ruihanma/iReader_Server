const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const BookCategorySchema = new Schema({
    // 名称
    title: {
        type: String,
        unique: true
    },
    intro: String,
    sort: {
        type: Number,
        default: 100
    },
    // 是否开放
    available: {
        type: Boolean,
        default: false
    },
    // 视觉
    // - 背景图
    background: String,
    // - 图标
    icon: String,
    // - 视频
    video: String,

    // 关联项目
    projects: [{type: ObjectId, ref: 'Project'}],

    // 元数据
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
BookCategorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next()
});

BookCategorySchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports = BookCategorySchema;