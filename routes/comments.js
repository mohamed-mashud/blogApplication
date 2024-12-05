const express = require("express");
const commentRouter = express.Router();
const {Posts, Comments} = require("../db")


/**
 * READ THIISSSS
 * before moving onto the parameters in this code
 * it is already routed from the base router thus 
 * the urls doesnt include the path "/comments"
 * as it already routed
 */

/**
 * 
  - Create Comment: `POST /comments`
  - Read Comments: `GET /comments?post_id={post_id}`
  - Read Single Comment: `GET /comments/{id}`
  - Update Comment: `PUT /comments/{id}`
  - Delete Comment: `DELETE /comments/{id}`
 */


/**
 * creates a comment only if a respective post exists
 * or else create a poost first
 */
commentRouter.post("/", async (req, res) => {
    const content = req.body.content;
    const author_id = req.body.author_id;
    const post_id = req.body.post_id;

    if(content == undefined || author_id == undefined || post_id == undefined)
        return res.status(400).send("needs content, author_id and post_id to make a comment")

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
})

/**
 * return comments in a particular post
 * post_id should be passed as query parameters such as
 * like this ==> /comments?post_id=tempPostID
 */
commentRouter.get("/", async (req, res) => {
    const post_id = req.query.post_id;
    const comments = await Comments.find({
        post_id
    });
    return res.json({
       comments 
    })
})

/**
 * get a single comment with comment id as 
 * parameter in the url
 */
commentRouter.get("/:id", async (req, res) => {
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
});

/**
 * For updating a comment
 * needs to pass content in the request body 
 * with comment id as parameter
 */
commentRouter.put("/:id", async (req, res) => {
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
});


/**
 * delete a particular comment using the comment_id
 */
commentRouter.delete("/:id", async (req, res) => {
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
});

module.exports = commentRouter;