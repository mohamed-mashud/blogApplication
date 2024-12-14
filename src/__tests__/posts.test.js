const mongoose = require("mongoose");
const { getAllPostsHandler } = require("../handlers/posts")
require("dotenv").config

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB__URL);
})

afterEach(async () => {
    await mongoose.connection.close();
})

describe("GET /posts", () => {
    it("should return a list of posts", () => {
        
    })
})