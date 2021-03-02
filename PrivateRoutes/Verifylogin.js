const jwt=require('jsonwebtoken')
require('dotenv').config()
const pool=require('../database')

async function UserVerifyLogin(req,res,next){
    let token=req.header('auth');
    try{
         if(!token) throw "Token not found"
         console.log(token)
         const Data=jwt.verify(token,process.env.JWT_KEY)
         console.log("Keyyy",Data)
         const userFind=await pool.query('SELECT * FROM usersignupDetails WHERE unqiue_id=$1',[Data.id])
         if(!userFind) throw "UserNot Found"
        req.userData=userFind.rows[0]
      next()
    }

    catch(error){
        res.json({
            message:error,
            error:"Token Not Provided "
        })
    }
    
}
async function DriverVerifyLogin(req,res,next){
    let token=req.header('auth');
    try{
        
        console.log(token)
         if(!token) throw "Token not found"
        
         const Data=jwt.verify(token,process.env.JWT_KEY)
         console.log("Keyyy",Data)
         const userFind=await pool.query('SELECT * FROM driversignupDetails WHERE unqiue_id=$1',[Data.id])
         if(!userFind) throw "UserNot Found"
         console.log(userFind)
        req.driverData=userFind.rows[0]
      next()
    }

    catch(error){
        res.json({
            message:error,
            error:"Token Not Provided "
        })
    }
    
}

module.exports={UserVerifyLogin,DriverVerifyLogin}