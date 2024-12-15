const PORT          = process.env.PORT || 3000;
const dotenv        = require("dotenv")
dotenv.config()

const createServer = require("./utils/server")
const app = createServer();

app.listen(PORT, () =>  {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;