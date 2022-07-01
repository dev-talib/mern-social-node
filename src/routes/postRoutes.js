const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

router.post('/new', (req, res) => {
    console.log(req.body)
    const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        media: req.body.media,
        user: req.body.user,
        category: req.body.category
        });
        newPost.save()
            .then(post => {
                res.status(201).json({ message: 'Post created successfully' });
            })  
            .catch(err => {
                res.status(500).json({ message: 'Error creating post' });
            });
});

router.get('/all', paginatedPosts(),(req, res) => {
    console.log('hit')
    res.json(res.paginatedResults);
});

router.get('/recent',(req,res)=>{
    Post.find().sort({_id:-1}).limit(4)
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting posts' });
        });
})

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    Post.findById(req.params.id)
        .populate('user')
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting post' });
        });
});

router.get('/user/:id', (req, res) => {
    Post.find({ user: req.params.id })
        .populate('user')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting posts' });
        });
});

router.put('/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error updating post' });
        });
});

router.delete('delete/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error deleting post' });
        });
}
);

router.delete('/delete_all/', (req, res) => {
    console.log('hit')
    Post.deleteMany( function(err){
        if(!err){
            res.send("Successfully deleted all Articles");
        }else{
            res.send(err);
        }
    });
});


router.get('/category/:slug', async (req, res) => {
    console.log(req.params.slug)
    const category = await Category.findOne({ slug: req.params.slug });
    console.log(category._id)

    Post.find({ category: category._id })
    .populate('user')
    .populate('category')
    .then((post)=>{
        res.json({post, category})
    }
    ).catch(err => {
        res.status(500).json({ message: 'Error getting posts' });
    })

  
});

// like unlike post
router.post('/likes', async(req,res)=>{
    const userId =  req.body.userId
    const postId = req.body.postId
   
    const post = await Post.findById(postId);
    let exist = false;
    post.likes.forEach((id,i)=>{
        if( id == userId){
           exist = true;
           console.log(id)
           post.likes.splice(i,1)
        }
    })
    
    console.log(exist)
    if(!exist){
        post.likes.push(userId);
        post.save()
        res.json(post)
    }else{
        post.save()
        res.json(post)
    }

    

})

function paginatedPosts() {
    return async (req, res, next) => {
      
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
  
      try {
        results.results = await Post.find()
          .sort({ _id: -1 })
          .populate('user')
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (e) {
        res.status(500).json({ message: "Error Occured" });
      }
    };
  }

module.exports = router;
