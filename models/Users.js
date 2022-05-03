const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        min:3,
        max:20,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        min:6,
    },
    profilePicture:{
        type: String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type: Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin: {
        type:Boolean,
        default:false
    },
},
{timestamps: true}
);

module.exports = mongoose.model("User",userSchema)