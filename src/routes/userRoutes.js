const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/all/:id',async(req,res)=>{
    const keyword = req.query.search
      ? {
          $or: [
              {username: { $regex: req.query.search, $options: "i"}},
              {email: {$regex: req.query.search, $options: "i"}},
          ],
      }
      :{};

    const users = await User.find(keyword)
    users.forEach((user,i)=>{
        // console.log(`user ${i}`,user.followers);
        if(user.followers.length > 0){
            user.followers.forEach((follower,j)=>{
                    // isfollowing =  follower._id.toString() === '62af876054cb8928aa2c491c'
                    if(follower._id.toString() === req.params.id.toString()){
                        user.isFollowing = true;
                        console.log('---------uff',user)
                    }    
            })
            }
    })
    res.json(users)
});

// random index users
router.get('/random/:id',async(req,res)=>{
    console.log(req.params.id)
    const users = await User.aggregate([
        { $sample: { size: 3 } },
    ])
    users.forEach((user,i)=>{
        // console.log(`user ${i}`,user.followers);
        if(user.followers.length > 0){
            user.followers.forEach((follower,j)=>{
                    // isfollowing =  follower._id.toString() === '62af876054cb8928aa2c491c'
                    if(follower._id.toString() === req.params.id.toString()){
                        user.isFollowing = true;

                    }    
            })
            }
    })
   
    res.send(users); 
}
);

router.put('/update/:id', (req, res, next) => {
    console.log(req.body)
    const user = new User({
      _id: req.params.id,
      bio: req.body.bio,
      profession: req.body.profession,
      profilePicture: req.body.url,
      address: req.body.address,
    });
    User.updateOne({_id: req.params.id}, user).then(
      () => {
        res.status(201).json({
          message: 'User detail updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });


router.get('/:id', async (req,res)=>{
    console.log('jjncnjdncjncjnjcndjcjcnjcjcjn')
    User.findById(req.params.id)
    .populate('followers').populate('following')
    .then((user)=>{
        res.json(user)
    })
    .catch(err=>res.send(err))
});

router.get('/:id/posts',(req,res)=>{
    User.findById(req.params.id)
    .populate('posts')
    .then((user)=>{
        res.json(user.posts)
    })
    .catch(err=>res.send(err))
})


router.get('/chats', async (req,res)=>{
     res.send('hello')
});

// follow a user can not follow himself and if allready following
router.post('/:id/follow', async (req,res)=>{
    console.log('hit')
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    console.log(user,currentUser)
    if(req.body.userId === req.params.id){
        res.status(400).json({message:'You can not follow yourself'})
    }else{
        var isfollowing = false;
        const followingUsers = await User.find({_id: {$in: currentUser.following}});
        if(followingUsers.length > 0){
            console.log(followingUsers.length)
          for(let i = 0; i < followingUsers.length; i++){
              const target = followingUsers[i]._id;
              isfollowing =  target.toString() === req.params.id.toString()
              if(isfollowing){
                 break;
              }
           } 
        }

        if(isfollowing){
            res.status(400).json({message:'You are already following this user'})
        }
         else{  
            console.log('following')
            user.followers.push(currentUser._id);
            user.save();
            currentUser.following.push(user._id);
            currentUser.save();
            res.status(200).json({message:'You are now following this user'})
        }
    }
}
);
   
// unfollow a user can not unfollow himself and if not following
router.put('/:id/unfollow', async (req,res)=>{
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    console.log(user,currentUser)
    if(user._id.toString() === currentUser._id.toString()){
        res.status(400).json({message:'You can not unfollow yourself'})
    }else{
        var isfollowing = false;
        const followingUsers = await User.find({_id: {$in: currentUser.following}});
        if(followingUsers.length > 0){
            console.log(followingUsers.length)
          for(let i = 0; i < followingUsers.length; i++){
              const target = followingUsers[i]._id;
              isfollowing =  target.toString() === req.params.id.toString()
              if(isfollowing){
                 break;
              }
           } 
        }
        if(isfollowing){
            user.followers.pull(currentUser._id);
            user.save();
            currentUser.following.pull(user._id);
            currentUser.save();
            res.status(200).json({message:'You are no longer following this user'})
        }
        else{
           res.status(400).json({message:'You are not following this user'})
        }
    }
}
);



// delete a user
router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.send('User has been deleted')
    }
    ).catch(err=>res.send(err))
});

// delete all users
router.delete('/all',(req,res)=>{
    User.deleteMany()
    .then(()=>{
        res.send('All users have been deleted')
    }
    ).catch(err=>res.send(err))
});


module.exports = router;
