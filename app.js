require('dotenv').config()

const express=require("express");
const bodyparser=require("body-parser");
const  mongoose  = require("mongoose");
const encrypt=require('mongoose-encryption');
// const alert=require("alert");
const cors=require('cors');
const app=express();
app.use(cors());
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));
mongoose.connect("mongodb+srv://achyuta22:G6un2EdLQsyEAL9t@cluster0.4119uaq.mongodb.net/usersdata")
const dataschema=new mongoose.Schema({
    username:String,
    emailid:String,
    password:String
})
const secret=process.env.secret;
dataschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});
const userdata= mongoose.model("user",dataschema);
app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
})
app.get("/signuphtml",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})
app.post("/signup",function(req,res){
    uname=req.body.username;
    email=req.body.emailid;
    pass=req.body.password;
    const data=userdata({
        username:uname,
    emailid:email,
    password:pass
    })
    userdata.findOne({emailid:email}).then((user)=>{
     if (user){
    //   function alertuser(){
    //    alert("email already in use")
    //   }
    // alertuser();
    // alert("email alerady in use");
    res.render('error',{emailid:email})

  }
        else{
    data.save().then((data)=>{
      if(data){
        console.log("data saved");
        res.redirect("/signup"); 
      }
      else{
        console.log("error");
      }
    });}
    
})})
app.get("/signup",function(req,res){
  res.render('data',{process:"successfully signedup"});
})
let password="";
app.post("/signin",function(req,res){
    email=req.body.emailid;
    pass=req.body.password;
  userdata.findOne({emailid:email}).then((user)=>{
    if (user){
         password=user.password;
        //  console.log(password);
         if(pass==password){
            res.redirect("/signin");
          }
        else{
            res.send("unsuccessful"); 
        }
       
    }
  })
  
});

app.get("/signinhtml",function(req,res){
    res.sendFile(__dirname+"/signin.html");
})
app.get("/signin",function(req,res){
  res.render('data',{process:"successfully signedin"});
})
app.listen(3000,function(req,res){
    console.log("server 3000 started");
})

