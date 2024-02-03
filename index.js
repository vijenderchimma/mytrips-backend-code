const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcrypt")
const jwtToken = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json())

mongoose.connect("mongodb+srv://vijenderchimma424:Vijju%40213@vijjucluster.npg02lu.mongodb.net/mytrips")

const schema = new mongoose.Schema({
    state: String,
    district: String,
    name: String,
    url: String,
    img:String,
    description: String,
    territory: String
})

const templeModel = mongoose.model('temples',schema)
const waterfallsModel = mongoose.model('waterfalls',schema)
const trekkingModel = mongoose.model('trekking',schema)

app.get("/", async (req,res)=>{
    res.send("Hello My Name Is Vijender")
})

app.post('/temples',async (req,res)=>{
    const {name,state,district,url,img,description} = req.body
    try{
        const existingName = await templeModel.findOne({name})
        if(!existingName){
            const newTrip = new templeModel({
                name,state,district,url,img,description
            })
            await newTrip.save()
            res.status(201).send("trip posted Successfully")
        }
        else{
            res.status(400).send('Place Already Exists');
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
})

app.post('/waterfalls',async (req,res)=>{
    const {name,state,district,url,img,description} = req.body
    try{
        const existingName = await waterfallsModel.findOne({name})
        if(!existingName){
            const newTrip = new waterfallsModel({
                name,state,district,url,img,description
            })
            await newTrip.save()
            res.status(201).send("trip posted Successfully")
        }
        else{
            res.status(400).send('Place Already Exists');
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
})

app.post('/trekking',async (req,res)=>{
    const {name,state,district,url,img,description} = req.body
    try{
        const existingName = await trekkingModel.findOne({name})
        if(!existingName){
            const newTrip = new trekkingModel({
                name,state,district,url,img,description
            })
            await newTrip.save()
            res.status(201).send("trip posted Successfully")
        }
        else{
            res.status(400).send('Place Already Exists');
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
})

app.get('/gettemples', async (req,res)=>{
    try{
        const data = await templeModel.find()
        res.json(data)
    } catch(err){
        console.log(err)
        res.status(500).json({message: 'server err'})
    }
})



app.get('/waterfalls',async (req,res)=>{
    try{
        const data = await waterfallsModel.find()
        res.json(data)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'server err'})
    }
})



app.get('/trekking', async (req,res)=>{

    try{

        const data = await trekkingModel.find()
        res.json(data)

    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'server err'})
    }
})



const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email:String,
    number: Number,
    gender: String
})

const userModel = mongoose.model('users',userSchema)

app.post("/register", async (req,res)=>{
    const {username,password,email,number,gender} = req.body

    const hashedPassword = await bcrypt.hash(password,10);

    try{

        const existingUser = await userModel.findOne({email})

        if (!existingUser){
            const newUser = new userModel({
                username,
                password: hashedPassword,
                email,
                number,
                gender
            })
            await newUser.save()
            res.status(201).send("User Registered Successfully")
        }
        else{
            res.status(400).send('Email Already Exists');
        }
    }
    catch(err){
        console.error("Error registering user:", err)
        res.status(500).send(err)
    }

})



app.post("/login", async (req,res)=>{
    const {email,password} = req.body
    try {
        const existingUser = await userModel.findOne({email})

        if (!existingUser){
            res.status(400).send("Invalid User")
        }
        else{
            const isPasswordMatched = await bcrypt.compare(password,existingUser.password)

            if (isPasswordMatched){

                const payload = {
                    id : existingUser._id
                }
                const token = jwtToken.sign(payload,"jwt_token")
                res.status(200).send({token, message: "Login Success"})
            }
            else{
                res.status(400).send("Invalid Password")
            }
        }
    }
    catch(err){
        console.error('Error during login:', error);
    res.status(500).send('Internal server error');
    }
})


app.listen(3001, () => {
    console.log('server is running\n http://localhost:3001')
})