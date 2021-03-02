const Pool=require('pg').Pool
require('dotenv').config()
const database=new Pool({
    user:process.env.DB_USER,

    host:process.env.DB_HOST,

    port:process.env.DB_PORT,

    password:process.env.DB_PASSWORD,

    database:process.env.DB_DATABASE
})
database.on('connect',()=>{
    console.log("Connected to db")
})
module.exports=database