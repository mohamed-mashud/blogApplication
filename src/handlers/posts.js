const { Posts } = require("../db.js")

const createPost = async (req, res)=> {
    const user_id = req.body.user_id;
    const title = req.body.title;
    const content = req.body.content;
    
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
        return res.status(500).send("Error in database");   
    }
};

const getAllPostsHandler = async (res)=> {
    try {
        const posts = await Posts.find();
        return res.json({
            posts
        })
    } catch(error) {
        // console.error("Error in fetching posts: ", error);
        return res.status(500).send("Error in database at get method of posts");   
    }
}

const getPostById = async (req, res)=> {
    const _id = req.params.id;
    try {
        const post = await Posts.findById({_id})
        return res.json({
            post
        });
    } catch (error) {
        return res.status(500).send("Error in database");   
    }
};

const updatePostById = async (req, res)=> {
    const postId = req.params.id;
    const post = await Posts.findOne({
        _id: postId
    })
    
    if(!post)
        return res.send(400).send("Either the post doesnt exist or the author doesnt made any posts")
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

const deletePostById = async (req, res)=> {
    const postExists = await Posts.findById({
        _id: req.params.id
    });
    if(!postExists)
        return res.status(400).json({
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
    createPost,
    getAllPostsHandler,
    getPostById,
    updatePostById,
    deletePostById
}