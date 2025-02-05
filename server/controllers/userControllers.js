const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const fs=require('fs')
const path=require('path')
const {v4:uuid}=require('uuid')


// registr amnew user
// POST : api/users/register
// UNPROTECTED

const HttpError=require("../models/errorModel")

const registerUser = async(req,res,next) => {
    try {
        const {name, email, password, password2}=req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill in all field." ,422))
        }

        const newEmail=email.toLowerCase()

        const emailExists=await User.findOne({email:newEmail})
        if(emailExists){
            return next(new HttpError("Email already exists.",422))
        }

        if((password.trim()).length <6){
            return next(new HttpError("Password should be at least 6 characters,",422))
        }

        if(password != password2){
            return next(new HttpError("Password do not match.",422))
        }

        const salt =await bcrypt.genSalt(10)
        const hashedPas=await bcrypt.hash(password,salt);
        const newUser=await User.create({name,email:newEmail,password:hashedPas})
        res.status(201).json(`NewUser ${newUser.email} registered.`)


    } catch (error) {
        return next(new HttpError("User registration failed,", 422))
    }
}

// logina register  user
// POST : api/users/login
// UNPROTECTED
const loginUser = async(req,res,next) => {
    try {
        const {email, password}=req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all fields.",422))
        }
        const newEmail=email.toLowerCase();

        const user=await User.findOne({email:newEmail})
        if(!user){
            return next(new HttpError("Invalid credentials,",422))
        }
        const comparePass=await bcrypt.compare(password,user.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials.",422))
        }

        const {_id:id,name}=user;
        const token=jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.status(200).json({token,id,name})
    } catch (error) {
        return next(new HttpError("Login failed.Please check you credentials.",422))
    }
}


// User profile
// POST : api/users/:id
//ROTECTED
const getUser = async(req,res,next) => {
    try {
        const {id}=req.params;
        const user=await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not found.",404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}


// change user avatar
// POST : api/users/change-avatar
//ROTECTED
const ChangeAvatar = async(req,res,next) => {
    try {
        if(!req.files.avatar){
            return next(new HttpError("Please choose an image.",422))
        }
        const user =await User.findById(req.user.id)
        if(user.avatar){
            fs.unlink(path.join(__dirname,'..','uploads',user.avatar),(err) => {
                if(err){
                    return next(new HttpError(err))
                }
            })
        }
        const {avatar}=req.files;
        if(avatar.size>500000){
            return next(new HttpError("Profile picture too big.file should be less than 500kb"),422)
        }
        let fileName;
        fileName=avatar.name;
        let spillitedfileName=fileName.split('.')
        let newFileName=spillitedfileName[0]=uuid()+'.'+spillitedfileName[spillitedfileName.length-1]
        avatar.mv(path.join(__dirname,'..','uploads',newFileName),async(err) =>{
            if(err){
                return next(new HttpError(err))
            }

            const updatedAvatar=await User.findByIdAndUpdate(req.user.id,{avatar:newFileName},{new:true})
            if(!updatedAvatar){
                return next(new HttpError("Avatar couldn't be change.",422))
            }
            res.status(200).json(updatedAvatar)
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}


// edit user details
// POST : api/users/edit-user
//ROTECTED
const editUser = async(req,res,next) => {
    try {
        const {name,email,currentPassword,newPassword,ConfirmNewPassword}=req.body;
        if(!name || !email || !currentPassword || !newPassword ){
            return next(new HttpError("Fill in all fields.",422))
        }
        const user=await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found.",403))
        }

        const emailExists=await User.findOne({email});
        if(emailExists && (emailExists._id != req.user.id)){
            return next(new HttpError("Email already exists.",422))
        }
        const validUserPassword= await bcrypt.compare(currentPassword,user.password);
        if(!validUserPassword){
            return next(new HttpError("Invalid current password.",422))
        }
        if(newPassword !== ConfirmNewPassword){
            return next(new HttpError("New passwords do not match.",422))
        }

        const salt=await bcrypt.genSalt(10)
        const Hash=await bcrypt.hash(newPassword,salt);

        const newInfo=await User.findByIdAndUpdate(req.user.id,{name,email,password:Hash},{new:true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// get authors
// POST : api/users/authors
//UNROTECTED
const getAuthors = async(req,res,next) => {
    try {
        const authors=await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {registerUser, loginUser, getUser,ChangeAvatar,editUser,getAuthors}