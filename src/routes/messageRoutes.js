const express = require('express')
const router = express.Router();
const MessageModel = require('../models/MessageModel')



router.get('/',async(req,res)=>{
   res.json('hello there')
})

router.post('/',async(req,res)=>{
   console.log('--',req)
   console.log(req.body)
   const {chatId, senderId, text} = req.body
   const message = new MessageModel({
      chatId,
      senderId,
      text
   });
   try{
      const result = await message.save();
      res.status(200).json(result)
   }
   catch(error)
   {
    res.status(500).json(error)
   }
})

router.get('/:chatId', async(req,res)=>{
    const {chatId} = req.params
    try{
        const result = await MessageModel.find({chatId})
        res.status(200).json(result)
    } catch(error)
    {
     res.status(500).json(error)
    }
});

module.exports = router;