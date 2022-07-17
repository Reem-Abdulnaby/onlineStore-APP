const mongoose=require('mongoose')
const bcryptjs=require('bcryptjs')
const jwt =require('jsonwebtoken')


const adminSchema=mongoose.Schema({
  email:{
        type:String,
        trim:true,
    require:true
    },
    password:{
        type:String,
        trim:true,
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
    }]
})
adminSchema.methods.generateToken=async function(){
    const admin=this
    const token=jwt.sign({_id:admin._id},process.env.JWT_SECRET)
    admin.token.user.token.concat(token)
    awaitadmin.save()
    return token
}
adminSchema.pre('save',async function(){
    const admin=this
    if(admin.isModified('password'))
    {
        admin.password=await bcryptjs.hash(admin.password,8)
    }
})
adminSchema.statics.Login=async function(email,pass){
const admin=await Admin.findOne({email})
if(!admin){
    throw new Error('password or email is wrong!')
}
const isMatch=bcryptjs.compare(pass,admin.password)
if(!isMatch)
throw new Error('password or email is wrong')
return admin
}

const Admin=mongoose.model('Admin',adminSchema)
module.experts=Admin