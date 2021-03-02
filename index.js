const express=require('express')
const app=express()
const usersingup=require('./Routes/UserSingup')
const driverSignup=require('./Routes/DriverSingup')
const Location=require('./Routes/Coordinates')
const buses=require('./Routes/buses')
const cors=require('cors')
const PORT=5000

app.use(express.json())
app.use(cors())
app.use((express.urlencoded({extended:false})))
app.use('/user',usersingup)
app.use('/driver',driverSignup)
app.use('/location',Location)
app.use('/bus',buses)
app.listen(PORT,'192.168.1.102',()=>{
    console.log(`Server Running at Port ${PORT}`)
    
})








