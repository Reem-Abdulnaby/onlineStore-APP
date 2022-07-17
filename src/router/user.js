const mongoose=require('mongoose')
const express=require('express')
const router=express.Router()
const User=require('../model/user')
const Product=require("../model/product")
const auth=require('../middelware/auth')
// user sign up
router.post('/signup',async(req,res)=>{
    try{
        const user=  new User(req.body)
          await user.generateToken()
      await  user.save()
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//user login
router.post('/user/login',async(req,res)=>{
    try{
        const user=await User.Login(req.body.email,req.body.password)
        await user.generateToken()
        await  user.save()

        res.status(200).send(user)
    }
   catch(e){
       res.status(500).send(e.message)
   }
})
//user get his profile
router.get('/user/profile',auth,async(req,res)=>{
    try{
        const user=req.user
        res.status(200).send(user)

    }
    catch(e){
        res.status(400).send(e)
    }
})
//user update his profile
router.patch('/user/updateprofile',auth,async(req,res)=>{
    try{
        const updates=Object.keys(req.body)
        updates.forEach(el=>{
            req.user[el]=req.body[el]
        })
        await req.user.save()
        res.status(200).send(req.user)


    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//user logout from acount
router.delete('/user/logout',auth,async(req,res)=>{
    try{
        req.user.token=req.user.token.filter(token=>{
            return token!=req.token
        })
      
        await req.user.save()
        res.status(200).send()

    }
    catch(e){
        res.status(400).send(e)
    }
})
//user logout from all
router.delete('/user/logoutall',auth,async(req,res)=>{
    try{
         req.user.token=[]
         await req.user.save()
         res.status(200).send()
    }
    catch(e){
        res.status(400).send(e)
    }
})
//add product to cart
router.post('/user/addtocart',auth,async(req,res)=>{
    try{
        const productID=req.body.productID
       
        const proNum=req.body.number
       
    const product= await Product.findById(productID)
    if(proNum>product.Avilable_number){
        throw new Error('not avilable')
     }
   //  const newObject = Object.assign({}, req.user.cart)
   
         const result= await req.user.cart.find(el=>{ return el.product==productID})
        
       
    
         if(!result){
        
          await req.user.cart.push({number:proNum,product:productID})
          
          
     
         const p=await Product.find({})
          const products= p.filter(el=>{return el.parCode==product.parCode})
          for(let i=0;i<products.length;i++){
              products[i].Avilable_number--
         
              await products[i].save()
          }
          product.Avilable_number--
          req.user.Nocart++
          await product.save()
          await req.user.save()
           
         
        
        
        res.status(200).send(req.user)
         }
         else{
         return    res.send('Already Exist')
         }
       
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
module.exports=router