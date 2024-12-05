const express = require("express");
const postRouter = express.Router();
const {Posts} = require("../db")
const {authMiddleware} = require("../middleware")
postRouter.use(authMiddleware);
/**
 * READ THIISSSS
 * before moving onto the parameters in this code
 * it is already routed from the base router thus 
 * the urls doesnt include the path "/posts"
 * as it already routed
 */


/**
 *- Create Post: `POST /posts`
  - Read Posts: `GET /posts`
  - Read Single Post: `GET /posts/:id`
  - Update Post: `PUT /posts/:id`
  - Delete Post: `DELETE /posts/:id`
 */

/**
 * todo: 
 *      check for author_id before making the post to the database
 */

/**
 * requires user_id, title, content
 */
postRouter.post("/", async (req, res)=> {
    const user_id = req.body.user_id;
    const title = req.body.title;
    const content = req.body.content;

    if(user_id === undefined || title === undefined || content === undefined) {
        return res.status(400).send("input all the required data, also in json format");
    }
    try {
        const currPost = await Posts.create({
            title,
            content,
            author_id: user_id
        });
        return res.json({
            msg : "Post updated successfully",
            PostId : currPost._id
        })
    } catch (error) {
        return res.status(500).send("Error in database");   
    }
});

/**
 * both the get methods with id and not id doesnt require any parameters
 */
postRouter.get("/", async (req, res)=> {
    try {
        return res.json({
            posts : await Posts.find()
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send("Error in database at get method of posts");   
    }
});

postRouter.get("/:id", async (req, res)=> {
    const author_id = req.params.id;
    try {
        const post = await Posts.findOne({
            author_id
        })
        return res.json({
            post
        });
    } catch (error) {
        return res.status(500).send("Error in database");   
    }
});

/**
 * For updating post with _id (ie)  the post id
 * pass the title and content that needs to be modified
 */
postRouter.put("/:id", async (req, res)=> {
    const postId = req.params.id;
    const post = await Posts.findOne({
        _id: postId
    })

    if(!post)
        return res.status(400).send("Either the post doesnt exist or the author doesnt made any posts")
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
});


postRouter.delete("/:id", async (req, res)=> {
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
});

module.exports = postRouter;