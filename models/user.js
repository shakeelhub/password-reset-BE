const mongoose=require('mongoose');

//Schema for user contents
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    resettoken:{
        type:String
    }
})

module.exports=mongoose.model('User',userSchema)
