const express = require ("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");

router.get("/signup",(req,res)=>{
    res.render("listings/users/signup.ejs");
});

router.post("/signup",wrapasync(async(req,res)=>{
    let{username,email,password}=req.body;
    let newUser = new User({email,username});
    const registerdUser= await User.register(newUser,password);
    console.log(registerdUser);
    req.flash("success","Welcome to wanderers");
    res.redirect("/listings");
}));

module.exports=router;