const mongoose=require('mongoose')
const validator=require('validator')
const Category=require('./category')
const productSchema=mongoose.Schema({
    proName:{
        type:String,
        trim:true,
        required:true
    },
    parCode:{
       type:String,
       required:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
       maxLength:20
    },
    price:{
        type:Number,
        required:true
    },
    Avilable_number:{
        type:Number,
      default:1
    },
    image:{
        type:Buffer
    },
    category:{
        type:String,
        ref:Category
    }

})
const Product=mongoose.model('products', productSchema)
module.exports=Product
