const Router=require('express').Router()
const bcrypt=require('bcrypt')
const { Pool } = require('pg')
const poll=require('../database')
 const jwt=require('jsonwebtoken')
require('dotenv').config()

Router.get('/all',async(req,res)=>{
  const Allusers=await poll.query('SELECT * FROM usersignupdetails')
  res.status(200).json({
    message:"AllUsers Data",
    TotalUsers:Allusers.rows,
    NumberOfUsers:Allusers.rowCount
  })
})
Router.get('/:id',async(req,res)=>{
  const {id}=req.params
  const SingleUser=await poll.query("SELECT * FROM usersignupdetails where unqiue_id=$1",[id])
  res.status(200).json({
    message:"single Userinfo",
    singleUser:SingleUser.rows[0]
  })
})
Router.get('/signup',(req,res)=>{
    res.status(200).json({
        message:"Ok sucess Pradeep"
    })
})
Router.post('/signup',async(req,res)=>{
    try{
    const {username,email,password}=req.body
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
        throw 'invalid email!';
    }
    if(!email.length || !password.length || !username){ //0 - false any - true
        throw 'Please enter email and password !';
    }
    const hashPassword=bcrypt.hashSync(password,10)
    if(!hashPassword) throw "Not converted"
    console.log(username,email,hashPassword)

      const Data=await poll.query('INSERT INTO usersignupDetails(username,email,password) VALUES ($1,$2,$3) RETURNING *',[username,email,hashPassword])

      if(!Data) throw "Data Not inserted in db"
    //   const token =jwt.sign({username:username,email:email},process.env.JWT_KEY)
    //   console.log(token)
    //   if(!token ) throw "Token not generated"
      res.json({
          message:"Sucess Express ",
          info:Data
      })
      console.log("Sucess.......")
    // console.log(bcrypt.compareSync("Pradeep@465",hashPasword))
      }
   catch(error){
                  res.status(404).json({
                      message:"error",
                      info:error
                  })
        }
})
Router.post('/signin',async(req,res)=>{
  try{
      const {email,password}=req.body
      console.log("credits",email,password)
      const userInfo=await poll.query('SELECT * FROM usersignupDetails where email=$1',[email])
      if(!userInfo) throw "Data Not found"
      console.log(userInfo.rows[0])
      const checkPassword=bcrypt.compareSync(password,userInfo.rows[0].password)
      // console.log("Hello",checkPassword)
      if(!checkPassword) throw "Password incorrect"

      const token =jwt.sign({email:email,username:userInfo.rows[0].username, role:"user", id:userInfo.rows[0].unqiue_id},process.env.JWT_KEY)

      //  console.log("Token",token)
      if(!token ) throw "Token not generated"
      res.status(200).json({
        message:"Signin Sucess",
        token:token
      })
  }  catch(error){
      res.json({
        message:"Signin problem"
      })
  }

      
})
module.exports=Router