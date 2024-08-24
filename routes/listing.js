const express = require ("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema} = require ("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
     let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(404,errMsg);
    }else{
       next();
    }
 }


//1) Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
 }));

//3)new rout which can add new data
router.get("/new",(req,res)=>{
   
    res.render("listings/new.ejs");
 });

// 2)show rout (return the data of perticular id)
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing not exists!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
 }));
 //route after 3 4)create route  form add kelyavr pudh data madhe add kasa honar.middleware for price shoild be a number
 router.post("/", validateListing,
    wrapAsync(async (req, res,next) => {
       const newListing = new Listing(req.body.listing);
       await newListing.save();
       req.flash("success","New Listing Created!");
        res.redirect("/listings");
    })
 );
 //5) Edit route
 router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing not exists!");
      res.redirect("/listings");
    }
     req.flash("success","Listing Edited!");
     res.render("listings/edit.ejs",{listing});
  }));
 
  //6) update route
  router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing Updated!");
     res.redirect(`/listings/${id}`);
 
  }));
  //7) delete route
  router.delete("/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success"," Listing Deleted!");
        res.redirect("/listings");
  }));
 
  module.exports=router;
  