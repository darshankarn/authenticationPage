/*
//const http = require("http");

import http from "http"

//const gfname = require("./feature");

//import gfname from "./feature.js" // in this case we can import with any name 
//import { gfname2, gfname3} from "./feature.js"; // but in this case we have to import the veriable with same name  as we export it

//import gfname,{ gfname2, gfname3 } from "./feature.js"

import * as myObj from "./feature.js";
import { generateLovePresentage } from "./feature.js";

import fs from "fs"

const home = fs.readFileSync("./index.html");

//console.log(gfname);
//console.log(gfname2);
//console.log(gfname3);

console.log(myObj);

console.log(myObj.default);
console.log(myObj.gfname2);
console.log(myObj.gfname3);

const server = http.createServer((req,res) => {
    if(req.url === '/'){
        
        /*fs.readFile("./index.html", (err, data) => {
            res.end(data);
        })*/ /*

        res.end(home);

    }else if(req.url === '/about'){

        res.end(`<h1>${generateLovePresentage()}</h1>`);

    }else if(req.url === '/contact'){

        res.end("<h1>contact page</h1>");

    }else{

        res.end("<h1>Page Not Found</h1>");

    }
});

server.listen(5000,()=>{
    console.log("server listening on port");
})

*/

// express js

import  express  from "express";
import path from "path";

import mongoose from "mongoose";

import cookieParser from "cookie-parser";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

const app = express();

//connect to database

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "Users",
}).then((c)=>{ console.log("database connected");}).catch((err)=>{ console.log(err);});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const userData = mongoose.model("userData",userSchema);

//all the middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.set("view engine", "ejs");

/* --------------------------------
app.get("/", isAuthenticated, (req,res) =>{
    //res.send(" Hi Welcome ");
    //res.sendStatus(400);
    /*res.json({
        success: true,
        products: [],
    });*
    //res.status(404).send("mere marzi");

    //const pathLocation = path.resolve();

    //res.sendFile(path.join(pathLocation,"index.html"));

    //res.render("index");

    // for authentication

    //console.log(req.cookies.token);

   // const token = req.cookies.token;

   // if(token){
     //   res.render("logout");
    //}else{
    //    res.render("login");
    //}

    res.render("logout");

}); -------------------------*/

/*
app.get("/succes", (req, res) =>{
    res.render("success");
});*/

//const database = [];

/*
app.post("/", async(req, res) =>{
    //console.log(req.body);
    //database.push({username: req.body.name, email: req.body.email});

    //const userData = {name: req.body.name, email: req.body.email};
    //await message.create(userData);

    //res.render("success");

    const{name, email} = req.body;
    await message.create({name,email});

    res.redirect("/succes");
}); */


/*
app.get("/users", (req,res)=>{
    res.json({
        database,
    });
}); */

/*
app.get("/add", async(req,res)=>{
    await message.create({name: "darshan", email: "sample@gmail.com"})
    res.send("Done");
});*/





//login logout page

const isAuthenticated = async(req, res, next) => {

    const { token } = req.cookies;

    if(token){

        const decode = jwt.verify(token , "dafdnoinfoewfsvrfeffv");

        req.user = await userData.findById(decode._id);

        next();
    }else{
        res.redirect("/login");
    }

}; 

app.get("/", isAuthenticated,(req, res)=>{
    
    res.render("logout", { name: req.user.name});
});

app.get("/login",(req, res)=>{
    res.render("login");
});

app.get("/register",(req, res)=>{
    res.render("register");
});

app.post("/login",async(req, res)=>{

    const{email, password} = req.body;

    const user = await userData.findOne({email});

    if(!user){
        return res.redirect("/register");
    }

    const Ismatch = await bcrypt.compare(password, user.password);
    if(!Ismatch) {
        return res.render("login",{email,message : "Incorrect Password"});
    }
    const token = jwt.sign({_id: user._id}, "dafdnoinfoewfsvrfeffv");
    res.cookie("token",token,{
        httpOnly: true,
        expires: new Date(Date.now() + 60*1000),
    });

    res.redirect("/");
});

app.post("/register",async(req, res) =>{

    const{name, email, password} = req.body;

    const user = await userData.findOne({email});
    if(user){
        return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    //save in database
    const User = await userData.create({
        name,
        email,
        password : hashedPassword});

    const token = jwt.sign({_id: User._id}, "dafdnoinfoewfsvrfeffv");
    res.cookie("token",token,{
        httpOnly: true,
        expires: new Date(Date.now() + 60*1000),
    });

    res.redirect("/");
});

app.get("/logout",(req, res) =>{
    res.cookie("token", null,{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});

app.listen(5000,()=>{
    console.log("Server is working");
});
