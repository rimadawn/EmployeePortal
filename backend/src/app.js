const express = require("express");
const flash = require('req-flash');
const session = require('express-session');
const path=require("path");
const app = express();
require("./db/conn");
const Register= require("./models/register");
const port = process.env.PORT || 3000;
const static_path= path.join(__dirname,"../public");
const template_path= path.join(__dirname,"../templates/views");

app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
    }));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path)

app.get("/", (req,res) => {
    var sessData = req.session;
    const user= sessData.user;
    if(user==null && user==undefined){
        res.render("index")
    }else{
        res.render('home', {
            name: user.name,
            email: user.email,
            phone: user.phone
         })
    }
});

app.get("/logout", (req,res) => {
    var sessData = req.session;
    sessData.user = null;
    res.redirect("/");
});

app.get("/profile", async(req,res) => {
 var sessData = req.session;
 const user= sessData.user;
 if(user==null && user==undefined){
    res.render("index")
}else{
    res.render('profile', {
        name: user.name,
        email: user.email,
        phone: user.phone
     })
}
});

app.get("/about", async(req,res) => {
    var sessData = req.session;
    const user= sessData.user;
    if(user==null && user==undefined){
       res.render("index")
   }else{
       res.render('about', {
           name: user.name,
           email: user.email,
           phone: user.phone
        })
   }
       
   });

app.post("/register", async (req,res) => {

    try {
        const user= await Register.findOne({email:req.body.email});

        if (user!=null){
            res.render('index', {
                info  :  "User already exist, please login"
             })
        }else{

        const pwd= req.body.password;
        const confirmPwd= req.body.confirmPassword;

        if(pwd===confirmPwd){

            const registerEmp= new Register({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                password: confirmPwd,
                confirmPassword:confirmPwd
            })            

           const registered= await registerEmp.save(
            function(err, data) {
                 console.error("error: ",err);
                 console.error("Data: ",data);
              }
           );


           res.render('index', {
            info  :  "Registration successful, please login"
         })

        }else{
            res.render('index', {
                info  :  "Password & Confirm Password mismatch"
             })
        }
     }
        
    } catch (error) {
        console.error("error: ",error);
        res.render('index', {
            info  :  "Bad request"
         })
    }
});


app.post("/login", async (req,res) => {

    try {
        const user= await Register.findOne({email:req.body.email});

        if (user!=null && user.password===req.body.password){
            var sessData = req.session;
            sessData.user = user;
            res.render('home', {
                name: user.name
             })
        }else{
            res.render('index', {
                info  :  "Invalid credentials"
             })
     }
        
    } catch (error) {
        console.error("error: ",error);
        res.render('index', {
            info  :  "Bad request"
         })
    }
});

app.post("/update", async (req,res) => {

    try {
        const user= await Register.updateOne({email:req.body.email},{

            $set:{
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
            }
        });

        const usr= await Register.findOne({email:req.body.email});

        var sessData = req.session;
        sessData.user = usr;

        res.render('profile', {
            msg:  "Update profile successful",
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
         })
    } catch (error) {
        console.error("error: ",error);
        res.render('profile', {
            info  :  "Bad request"
         })
    }
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

