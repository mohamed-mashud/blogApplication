const express       = require("express");
const bodyParser    = require("body-parser")
const mainRouter    = require("./routes/index");
const app           = express();
const PORT          = process.env.PORT || 5050;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * version control, which helps in making changes with
 * the application when converting to a new domain
 * or any major changes in the development 
 * the url thus needs to be added with the additional api/v1
 * at the starting 
 * eg :
 *      https:localhost:5050/api/v1/{posts or comments}/{post_id or comment_id}
 */
app.use("/api/v1", mainRouter);

app.listen(PORT, () =>  {
    console.log(`Server is running on port ${PORT}`);
})