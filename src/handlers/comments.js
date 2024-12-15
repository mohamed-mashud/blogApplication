const {Posts, Comments} = require("../db.js")

const postCommentHandler = async (req, res) => {
    const content = req.body.content;
    const author_id = req.body.author_id;
    const post_id = req.body.post_id;

    const postExists = await Posts.find({post_id})
    if(!postExists)
        return res.status(400).send("check post_id // comment can only be created, if a post exists");

    try {
        const createdComment = await Comments.create({
            content,
            author_id,
            post_id
        });
        return res.json({
            Message: "Comment created successfully",
            commentId : createdComment._id
        })
    } catch (error) {
        return res.json({
            error: error.message,
            Message: "Error in db"
        })
    }
};

const getAllCommentsInAPostHandler = async (req, res) => {
    const post_id = req.query.post_id;
    const comments = await Comments.find({
        post_id
    });
    return res.json({
       comments 
    })
};

const getCommentByIdHandler = async (req, res) => {
    const comment_id = req.params.id;
    const commentExists = await Comments.findOne({
       _id: comment_id
    });
    
    if(!commentExists)
        return res.json({
            message: "Comment does not exist"
        })
    return res.json({
        comment: commentExists
    })
};

const updateCommentByIdHandler = async (req, res) => {
    const comment_id = req.params.id;
    const contentToBeUpdated = req.body.content;
    const commentExists = await Comments.findById({
        _id : comment_id
    });

    if(!commentExists || contentToBeUpdated === undefined)
        return res.json({
            message: "Comment does not exist // pass content as req body"
        })
    try {
        await Comments.updateOne({
                _id: comment_id
            }, {
                $set: {
                    content: contentToBeUpdated 
                }
        })
        return res.json({
            message: "Comment updated successfully",
            updatedCommentId : comment_id
        })
    } catch (error) {
        return res.status(500).send("Error in db");
    }
};

const deleteCommentByIdHandler = async (req, res) => {
    const comment_id = req.params.id;
    const commentExists = await Comments.findById({
        _id: comment_id
    });
    
    if(!commentExists)
        return res.json({
            message: "Comment does not exist"
        })
    
    try {
        await Comments.deleteOne({
            _id : comment_id
        });    
        return res.json({
            message: "Comment deleted successfully"
        })
    } catch (error) {
        return res.json({
            message: "Error in db while deleting comment"
        })
    }
};

module.exports = {
    postCommentHandler,
    getAllCommentsInAPostHandler,
    getCommentByIdHandler,
    updateCommentByIdHandler,
    deleteCommentByIdHandler
}