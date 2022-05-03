const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId:{
        type:String,
        required: true
    },
    desc:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    },
    image:{
        type: String
    }
    
},{timestamps: true})


module.exports = mongoose.model('Post', postSchema);