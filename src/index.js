const express       = require("express");
const mainRouter    = require("./routes/index");
const app           = express();
const PORT          = process.env.PORT || 3000;
const dotenv        = require("dotenv")
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRouter);

app.listen(PORT, () =>  {
    console.log(`Server is running on port ${PORT}`);
})