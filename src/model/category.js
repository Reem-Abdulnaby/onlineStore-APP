const mongoose=require('mongoose')
const Product=require('./product')
const catSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    }

})
catSchema.virtual('products',{
    ref:'products',
    localField:'name',
    foreignField:'category'

})
 const Category=mongoose.model('category',catSchema)
 module.exports=Category
