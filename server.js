require("dotenv").config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const path = require("path")

const app = express();

app.use(express.static(path.join(__dirname,'Frontend')))
app.use(bodyParser.urlencoded({extended:true}))

const URL_MONGODB = process.env.MONGODB_URL

mongoose.connect(URL_MONGODB)
.then(()=>{
    console.log(`Database connected successfully`); 
})
.catch((error)=>{
    console.log(`MongoDB Connection error: ${error}`);
})

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

const urlSchema = new mongoose.Schema({
    url : String,
})

const URL = mongoose.model('url', urlSchema)

app.post('/urlshortener', (req,res)=>{
   const {url} = req.body;
     if (!url) {
       return  res.send("URL required")
    }
   

 let shortUrl = url.toString().slice(0, url.toString().indexOf("/", 10)); 

    console.log(shortUrl);
 res.send(shortUrl);
    
})

const userSchema = new mongoose.Schema({
    username : String,
    email: String, 
    password : String
})

const User = mongoose.model('user', userSchema);

app.post('/login', async (req,res)=>{
    const userCreated = new User({
        username: req.body.username,
        email : req.body.email,
        password : req.body.password
    })

    await userCreated.save();
    res.send(`User created successfully`);
})

let port = process.env.PORT || 5454;

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
    
})