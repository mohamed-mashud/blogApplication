const express = require("express");
const commentRouter = express.Router();
const { authMiddleware } = require("../middleware");
const { postCommentHandler, 
        getAllCommentsInAPostHandler,
        getCommentByIdHandler, 
        updateCommentByIdHandler, 
        deleteCommentByIdHandler } = require("../handlers/comments");
commentRouter.use(authMiddleware);


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
 * url: http://localhost:3000/comments/
 * eg : {
 *      "post_id" : "",
 *      "content" : "comments content",
 *      "author_id" : "user_id from login / register endpoints"
 *  }
 */
commentRouter.post("/", postCommentHandler);

/**
 * return comments in a particular post
 * post_id should be passed as query parameters such as
 * url: http://localhost:3000/comments?post_id={post_id}
 */
commentRouter.get("/", getAllCommentsInAPostHandler);

/**
 * get a single comment with comment id as 
 * parameter in the url
 * url: http://localhost:3000/comments/{comment_id}
 */
commentRouter.get("/:id", getCommentByIdHandler);

/**
 * For updating a comment
 * needs to pass content in the request body 
 * with comment id as parameter
 * url: http://localhost:3000/comments/{comment_id}
 * eg: {
 *  "content" : "updated comment"
 * }  
 */
commentRouter.put("/:id", updateCommentByIdHandler);


/**
 * delete a particular comment using the comment_id
 * url: http://localhost:3000/comments/{comment_id}
 * 
 */
commentRouter.delete("/:id", deleteCommentByIdHandler);

module.exports = commentRouter;