const Router=require('express').Router()
const VerifyLogin=require('../PrivateRoutes/Verifylogin')
const poll=require('../database')
Router.post('/Availablebuses',async(req,res)=>{
    let {startlocation,endlocation}=req.body
    console.log(startlocation,endlocation)
    // let busstops=await poll.query('SELECT * FROM bus_stops')
    // busstops=busstops.rows.map((stop)=>{
    //     return stop.stop_name

    // })
    let buses=await poll.query('SELECT * FROM buses')
    buses=buses.rows
    let Availablebuses=[]
    for(let i=0;i<buses.length;i++){
        let bus=buses[i].bus_number
        let busstops=buses[i].stops
        let busstopnames=[]
        for(let j=0;j<busstops.length;j++){
            let stop_name=await poll.query(`select stop_name from bus_stops where unique_id=${busstops[j]}`)
            busstopnames.push(stop_name.rows[0].stop_name)
        }
      
       if(busstopnames.indexOf(startlocation)!=-1 && busstopnames.indexOf(endlocation)!=-1 ){
         
           let Availablebus=await poll.query(`select * from driversignupdetails where busnumber='${bus}' and status='driving'`)
           console.log(Availablebus.rows)
           Availablebuses.push(...Availablebus.rows)
       }


    }
    res.status(200).json({
        message:"Buses",
        Availablebuses

      })
    
    })
Router.get('/busstops',async (req,res)=>{
    try{
        const Data=await poll.query('SELECT * FROM bus_stops')
        res.status(200).json({
            AllLocations:Data.rows
        })
    }
    catch(error){
        res.status(400).json({
            message:error
         })
    }

})

Router.get('/',async(req,res)=>{
    const Bus=await poll.query(` select bus_number from buses`)
    res.status(200).json({
        message:"Buses",
        Buses:Bus.rows
      })
})

Router.get('/:busno',async(req,res)=>{
    const {busno}=req.params
    const Bus=await poll.query(` select*from buses where bus_number='${busno}'`)
    let bus_details=Bus.rows[0]
    let stops=[]
    for(let i=0;i<bus_details.stops.length;i++){
        // console.log(stop)
        let stop_details=await poll.query(`select*from bus_stops where unique_id=${bus_details.stops[i]}`)
        console.log(stop_details.rows[0])
        stops.push({
            stop_name:stop_details.rows[0].stop_name,
            stop_coordinates:stop_details.rows[0].coordinates
        })
    }

  
    res.status(200).json({
        message:"Businfo",
        Buses:{
            bus_number:bus_details.bus_number,
            stops
        }
      })
})

Router.get('/place/:place',async (req,res)=>{
    try{
    const {place}=req.params
    console.log(place)
    const Data=await poll.query('SELECT * FROM bus_stops WHERE stop_name=$1',[place])
    if(!Data) throw "Location Not found"
    res.status(200).json({
        localtionDetails:Data.rows[0]
    })
    }
    catch(error){
        res.status(400).json({
           message:error
        })
    }
    
})

module.exports=Router