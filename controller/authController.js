const User = require("../model/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {registerValidation,loginValidation} = require("../component/validation")
const registerController=async(req,res)=>{
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //check if email exists in db
    const emailExist= await User.findOne({email:req.body.email})
    if(emailExist){
        return res.status(400).send({error:"email already exists"})
    }
    //hashing
    const salt=await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(req.body.password, salt)
   //create new users
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password:hashedPassword
    })
    try {
        const saveUser = await user.save()
        return res.send({user:user._id})

    } catch (err) {
        return res.status(400).send({error:err})
    }
    return res.status(500).send("register error")
}
const loginController=async(req,res)=>{
      //validation
      const {error}=loginValidation(req.body)
      if (error) {
          return res.status(400).send(error.details[0].message)
      }
      //check email exists
      const user= await User.findOne({email:req.body.email})
      if(!user){
          return res.status(400).send({error:"email dose not exists"})
      }
      //check password
      console.log(user)
      const vaildPass =await bcrypt.compare(req.body.password,user.password)
      if(!vaildPass){
          return res.status(400).send({error:"Incorrect password"})
      }
      //Create token
   
      const exprieDate = new Date()
      exprieDate.setDate(exprieDate.getDate() + 14)
      console.log( exprieDate)
      const token =jwt.sign({_id:user.id,expire_date: exprieDate},process.env.TOKEN_SECRET)
      res.header('auth-token',token).send({token:token})
}
module.exports.registerController=registerController
module.exports.loginController=loginController