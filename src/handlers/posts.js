const { Posts } = require("../db.js")

const createPostHandler = async (req, res)=> {
    const user_id = req.body.user_id;    
    const title = req.body.title;
    const content = req.body.content;

    if(user_id.length !== 24)
        return res.status(400).json({
            Message: "user_id should be of len 24"
        })
    try {
        const currPost = await Posts.create({
            title,
            content,
            author_id: user_id
        });
        return res.json({
            msg : "Post created successfully",
            PostId : currPost._id
        })
    } catch (error) {
        return res.status(500).json({
            "message": "Error in database",
        });   
    }
};

const getAllPostsHandler = async (req, res)=> {
    try {
        const posts = await Posts.find();
        return res.json({
            posts
        })
    } catch(error) {
        return res.status(500).json({ message : "Error in database at get method of posts" });   
    }
}

const getPostByIdHandler = async (req, res)=> {
    const _id = req.params.id;
    if(_id.length !== 24)
        return res.status(404).send({Message: "Post doesnt exist"})
    try {
        const post = await Posts.findOne({_id});        
        if(!post)
            return res.status(404).json({
                message : "Post Not found"
            });
        return res.status(200).json({
            post
        });

    } catch (error) {
        return res.status(500).send("Error in database");   
    }
};

const updatePostByIdHandler = async (req, res)=> {
    const postId = req.params.id;
    if(postId.length !== 24)
        return res.status(404).send({Message: "Post doesnt exist"})
    const post = await Posts.findOne({
        _id: postId
    })
    
    if(!post)
        return res.status(400).json({
            message: "Post doesnt Exist"
        })
    try {
        await Posts.updateOne({
            _id : postId               
        }, {
            $set: {
                title: req.body.title,
                content: req.body.content
            }
        })
        return res.json({
            msg: "Post updated successfully"
        })
    } catch(error) {
        console.log(error);
        return res.status(500).send("Error in database");
    }
};

const deletePostByIdHandler = async (req, res)=> {
    const _id = req.params.id;
    if(_id.length !== 24)
        return res.status(404).send({Message: "Post doesnt exist"})
    const postExists = await Posts.findById({
        _id
    });
    if(!postExists)
        return res.status(500).json({
            msg : "Post doesnt exist"
        })
    else {
        try {
            await Posts.deleteOne({
                _id: req.params.id
            });
            return res.json({msg : "post deleled successfully"});
        } catch(error) {
            console.log(error);
            return res.status(500).send("Error in database");
        }
    }
};
module.exports = {
    createPostHandler,
    getAllPostsHandler,
    getPostByIdHandler,
    updatePostByIdHandler,
    deletePostByIdHandler
}