const express = require("express");
const postRouter = express.Router();
const {authMiddleware} = require("../middleware");
const { getAllPostsHandler, 
        getPostById, 
        updatePostById, 
        deletePostById, 
        createPost } = require("../handlers/posts");
postRouter.use(authMiddleware);

/**
 *- Create Post: `POST /posts`
  - Read Posts: `GET /posts`
  - Read Single Post: `GET /posts/:id`
  - Update Post: `PUT /posts/:id`
  - Delete Post: `DELETE /posts/:id`
 */

/**
 * requires user_id, title, content
 * eg : 
 * url: http://localhost:3000/posts/
 * {
 *  "title": "title of the post",
 *  "content": "content of the post",
 *  "user_id" : "user id from mongoDB"
 * }
 */
postRouter.post("/", createPost);

/**
 * both the get methods with id and not id doesnt require any req.body
 *  url: http://localhost:3000/posts/
 */
postRouter.get("/", getAllPostsHandler);

// url: http://localhost:3000/posts/{posts_id}
postRouter.get("/:id", getPostById);

/**
 * For updating post with _id (ie)  the post id
 * pass the title and content that needs to be modified
 *  url: http://localhost:3000/posts/{posts_id}
 *  eg : 
 *  {
 *      "title" : "title that needs to change",
 *      "content" : "content which needs to be modified"
 *  }
*/
postRouter.put("/:id", updatePostById);


//url: http://localhost:3000/posts/{posts_id}
postRouter.delete("/:id", deletePostById);

module.exports = postRouter;