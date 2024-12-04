const express = require("express");
const router = express.Router();
const postRouter = require("./posts.js");
const commentRouter = require("./comments.js");
const jwt = require("jsonwebtoken")
const {Users} = require("../db.js")
const dotenv = require("dotenv")
dotenv.config();

router.use("/posts", postRouter)
router.use("/comments", commentRouter)

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email    = req.body.email;
    const isUserAlreadyExists = await Users.findOne({username});
    if (isUserAlreadyExists) 
        return res.status(400).send({message: "User already exists"});
    
    const user = await Users.create({
        username,
        password,
        email
    });

    const user_id = user._id;
    const token = jwt.sign({
        user_id
    },  process.env.JWT_SECRET)
    
    res.json({
        msg: "User registered successfully",
        token
    })
});


router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const user = await Users.findOne({
        username
    });
    
    if(!user)
        return res.status(400).send("User doesnt exist, register to use")
    if(user.password !== password)
        return res.status(400).send("Password doesnt match with email")

    const userId = user._id;
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET)

    res.json({
        msg: "User logged in",
        token
    })
})

module.exports = router;