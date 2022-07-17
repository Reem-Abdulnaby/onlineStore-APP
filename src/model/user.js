const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Product=require('./product')
//userschema(name,email,age(>10),phone,country,password(bcryptjs))
const userSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('Please enter valid email')
        }
    },
    age:{
        type:Number,
        require:true,
        validate(value){
            if(value<15)
            throw new Error('You are underage')
        }
    },
    country:{
        type:String,
        require:true,
        trim:true,
        minLength:3
    },
    phone:{
        type:String,
        trim:true,
      
    },
    password:{
        type:String,
        require:true,
        minLength:6,
        validate(value){
            let strongPass=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if(!strongPass.test(value))
            throw new Error('Passsword must contain capital charcter ,small charecter and  at least one special character and mumbers')
        }

    },
    token:[{
        type:String,
        require:true
    }],
 
    cart:[
        {
       product: {
            
        type:mongoose.Types.ObjectId,
        ref:Product
            
        
    },
    number:{
        type:Number

    }
}
],
    Nocart:{
      type:Number,
      default:0
    },
    rate:{
        type:Number,
        validate(value){
            if( !(value>=1 && value<=5) ){
                throw new Error("value must be betweeen 1-4") }
        }


    }

})
userSchema.methods.generateToken=async function(){
    const user =this
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
    user.token=user.token.concat(token)
    await user.save()
    return token
}

userSchema.pre('save',async function(){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcryptjs.hash(user.password,8)
    }
})

userSchema.statics.Login=async function(mail,pass){
    const user=await User.findOne({email:mail})
    if(!user)
        throw new Error('password or email is wrong!')
    
    const isMatch=await bcryptjs.compare(pass,user.password)
    if(!isMatch)
        throw new Error('password or email is wrong')
   return user 
}
const User=mongoose.model('Users',userSchema)
module.exports=User