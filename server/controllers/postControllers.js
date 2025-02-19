const Post=require('../models/postModel')
const User=require('../models/userModel')
const path=require('path')
const fs=require('fs')
const {v4:uuid}=require('uuid')
const HttpError=require('../models/errorModel')


//create a  post
const createPost=async(req,res,next) => {
    try {
        let {title,category,description}=req.body;
        if(!title || !category || !description || !req.files){
            return next(new HttpError("Fill in all fields and choose thumbnail.",422))
        }
        const {thumbnail}=req.files;
        if(thumbnail.size > 2000000){
            return next(new HttpError("Thumbnail too big.File should be less than 2mb."))
        }
        let fileName=thumbnail.name;
        let spillitedfileName=fileName.split('.')
        let newFileName=spillitedfileName[0]+uuid()+"."+spillitedfileName[spillitedfileName.length-1]
        thumbnail.mv(path.join(__dirname,'..','/uploads',newFileName),async(err) => {
            if(err){
                return next(new HttpError(err))
            }else{
                const newPost=await Post.create({title,category,description,thumbnail:newFileName,creator:req.user.id})
                if(!newPost){
                    return next(new HttpError("Post couldn't be created.",422))
                }

                const currentUser=await User.findById(req.user.id);
                const userPostCount=currentUser.posts+1;
                await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})

                res.status(201).json(newPost)


            }
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}


// get all posts
const getPosts=async(req,res,next) => {
    try {
        const posts =await Post.find().sort({updatedAt:-1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//get one post
//GET : api/posts/:id
const getPost=async(req,res,next) => {
    try {
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post){
            return next(new HttpError("Post not found.",404))
        }
        req.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//get post by category
//GET : api/posts/categories/category
const getCatPosts=async(req,res,next) => {
    try {
        const {category}=req.params;
        const catPosts=await Post.find({category}).sort({createdAt:-1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//get auther post
//GET: api/posts/users/:id
const getUserPosts=async(req,res,next) => {
    try {
        const {id}=req.params;
        const posts=await Post.find({creator:id}).sort({createdAt:-1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//edit post
//PATCH : api/posts/:id
const editPost=async(req,res,next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId=req.params.id;
        let {title,category,description}=req.body;

        if(!title || !category || description.length < 12){
            return next(new HttpError("Fill in all fields.",422))
        }
        const oldPost=await Post.findById(postId);
        if(req.user.id==oldPost.creator){
        if(!req.files){
            updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})
        }else{
            // const oldPost=await Post.findById(postId);
            fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async(err) =>{
                if(err){
                    return next(new HttpError(err))
                }
            })
            const {thumbnail}=req.files;
            if(thumbnail.size > 2000000){
                return next(new HttpError("thumbnail too big.should be less than 2mb "))
            }
            fileName=thumbnail.name;
            let spillitedfileName=fileName.split('.')
            newFileName=spillitedfileName[0]+uuid()+"."+spillitedfileName[spillitedfileName.length-1]
            thumbnail.mv(path.join(__dirname,'..','uploads',newFileName),async(err) =>{
                if(err){
                    return next(new HttpError(err))
                } 
            })
            updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFileName},{new:true})
        }
        }
        if(!updatedPost){
            return next(new HttpError("couldn't update post.",400))
        }

        res.status(200).json(updatedPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//delete post
// DELETE : api/posts/:id
const deletePost=async(req,res,next) => {
    try {
        const postId=req.params.id;
        if(!postId){
            return next(new HttpError("Post Unavailable.",400))
        }
        const post =await Post.findById(postId);
        const fileName=post?.thumbnail;
        if(req.user.id==post.creator){
        fs.unlink(path.join(__dirname,'..','uploads',fileName),async (err) =>{
            if(err){
                return next(new HttpError(err))
            }else{
                await Post.findByIdAndDelete(postId);
                const currentUser=await User.findById(req.user.id);
                const userPostCount=currentUser?.posts-1;
                await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})

                res.json(`Post ${postId} deleted successfully.`)
            }
        })
    }else{
        return next(new HttpError("Postcouldnot deleted. ",403))
    }
        
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports={createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost}