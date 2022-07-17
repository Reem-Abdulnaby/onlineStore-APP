const express=require('express')

const Category=require('../model/category')
const router=express.Router()


router.post('/cat/add',async(req,res)=>{
    try{
    const category= new Category(req.body)
    await category.save()
    res.status(200).send(category)
    }
    catch(e){
        res.status(400).send(e)
    }
})
//get all product in category
router.get('/cat/getallPro/:id',async(req,res)=>{
    try{
        const catID=req.params.id
        const category= await Category.findById(catID)
        await category.populate('products')

     res.status(200).send(category.products)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//get all categories
router.get('/cat/getall',async(req,res)=>{
    try{
        const category= await Category.find({})
        res.status(200).send(category)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//search by category name
router.get('/cat/searchbycat/:name',async(req,res)=>{
    try{
      const catName=req.params.name
      const category = await Category.findOne({name:catName})
      if(!category){
          return res.status(404).send('unable to found')
      }
      res.status(200).send(category)
    }
    catch(e){
        res.status(400).send(e)
    }

})
module.exports=router