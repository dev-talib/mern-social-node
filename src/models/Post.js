const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    media: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    likes: {
        type: Array,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
  
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', PostSchema);