const mongoose =  require("mongoose");

const ChatSchima = mongoose.Schema({
    members: {
        type: Array,
    },
},
{
  timestamps: true,
}
);

const ChatModel = mongoose.model("Chat", ChatSchima)
module.exports = ChatModel;