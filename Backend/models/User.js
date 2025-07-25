import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    role:{
        type:String,
        enum:['admin',"user"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    verifyOtp:{
        type: String,
        default:''
    },
      verifyOtpExpireAt:{
        type: Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean, 
        default:false
    },
    resetOtp:{
  type:String,
  default: ''
    },
     resetOtpExpireAt:{
  type:Number,
  default: 0
    },
    bio:{
        type:String,
    }
})


const userModel= mongoose.models.user ||  mongoose.model('users',userSchema);


export default userModel;
