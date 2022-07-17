const express=require('express')
const router=express.Router()
const Product=require('../model/product')
const User=require('../model/user')
const Category=require('../model/category')
//add new product
router.post('/product/add/:name',async(req,res)=>{
  try{
       const catName=req.params.name
      const category=Category.find({name:catName})
      if(category){
      
      const product=new Product({...req.body,category:catName})
      
      const p = await Product.find({})
  
      const products=  p.filter(el=>{return el.parCode==req.body.parCode})
     
     
     
      if(products){
          for(let i=0;i<products.length;i++){
              products[i].Avilable_number=products.length+1
          
              await products[i].save()
          }
          
        product.Avilable_number=products.length+1
      }

      await product.save()
      res.status(200).send(product)
    }
    else{
      return res.status(404).send('unable to found category')
    }
    

  }
  catch(e){
      res.status(400).send(e.message)
  }
})
//get all product
router.get('/pro/getall',async(req,res)=>{
    try{
        const product=await Product.find({})
        res.status(200).send(product)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//update specific product by id
router.patch('/pro/update/:id',async(req,res)=>{
   try{
        const id=req.params.id
        const product= await Product.findByIdAndUpdate({_id:id},req.body,{         new:true,
        runValidators:true
       })
      if(!product){
       return  res.status(404).send('product is not found')
        }
       await product.save()
      res.status(200).send(product)

     }
     catch(e){
        res.status(400).send(e.message)
     }

})

//delete spicific product
router.delete('/pro/delete/:id',async(req,res)=>{
    try{
      const id=req.params.id
      const product= await Product.findByIdAndDelete({_id:id})
      const p =await Product.find({parCode:product.parCode})
      console.log(p)
      for(let i=0;i<p.length;i++){
          p[i].Avilable_number--
        //  console.log(p[i].Avilable_number)
          await p[i].save()
          
      }
       
        
      res.status(200).send()
    }
    catch(e){
        res.status(400).send(e)
    }
})
//search by product name
router.get('/pro/searchbyproduct/:name',async(req,res)=>{
    try{
       const proName=req.params.name
       const product=await Product.find({proName})
       if(!product){
           return res.status(404).send('unable to found')
       }
       res.status(200).send(product)
    }
    catch(e){
        res.status(400).send(e)
    }
})
module.exports=router