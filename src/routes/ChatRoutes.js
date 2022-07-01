const express =  require('express')
const router = express.Router()
const ChatModel = require('../models/ChatModel')

router.post("/", async(req,res)=>{

    const chat = await ChatModel.findOne(
        {
            members: {$all: [req.body.senderId, req.body.receiverId]}
        }
    )
    if(chat){
        res.json("this chat is allready there")
    }
    else{    

    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    });

    try{
        const result = await newChat.save();
        res.json(result)

    }catch(error){
        res.status(500).json(error)
    }
  }
})
// userChats
router.get('/:userId', async (req,res)=>{
   try{
    const result = await ChatModel.find({
         members: {$in: [req.params.userId]}
        })
        res.json(result)
   }catch(error){
    res.status(500).json(error)
    }
})

// findChat
router.get("/find/:firstId/:secondId", async (req,res)=>{
    try{
        const chat = await ChatModel.findOne(
            {
                members: {$all: [req.params.firstId, req.params.secondId]}
            }
        )
        res.json(chat)
       }catch(error){
        res.status(500).json(error)
        }
} )

module.exports =  router

