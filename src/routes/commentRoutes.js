const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');



router.post('/new', (req, res) => {
    console.log(req.body)
    const newComment = new Comment({
        content: req.body.text,
        user: req.body.userId,
        post: req.body.postId,
        });
        newComment.save()
            .then(post => {
                res.status(201).json({ message: 'Comment add successfully' });
            })  
            .catch(err => {
                res.status(500).json({ message: 'Error creating comment' });
            });
});




module.exports = router;