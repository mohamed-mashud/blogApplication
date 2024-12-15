const request = require("supertest");
const createServer = require("../utils/server"); 
const app = createServer();
const { Posts } = require("../db.js"); 
jest.mock("../db.js", () => ({
    Posts: {
        create: jest.fn(),
        sendStatus: jest.fn(),  
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

describe("Post Handlers", () => {
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc1MWRiYTVkOWJjNGQ2YTg5ZGQ1YjMyIiwiaWF0IjoxNzM0MDE5MTc2fQ.l6XcGYgwLRUvA88KofDWaHORlwpFGZIOO0iW2Q1N_mg"; 

    describe("POST /posts", () => {
        it("should create a post successfully", async () => {
            const postData = {
                user_id: "user123",
                title: "Test Post",
                content: "This is a test post",
            };
            const mockPost = { _id: "post123", ...postData };

            Posts.create.mockResolvedValue(mockPost);

            const response = await request(app)
                .post("/posts")
                .set("Authorization", `Bearer ${mockToken}`) 
                .send(postData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                msg: "Post created successfully",
                PostId: "post123",
            });
            expect(Posts.create).toHaveBeenCalledWith({
                title: postData.title,
                content: postData.content,
                author_id: postData.user_id,
            });
        });

        it("should handle database errors", async () => {
            Posts.create.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post("/posts")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({
                    user_id: "user123",
                    title: "Test Post",
                    content: "This is a test post",
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Error in database" });
        });
    });

    describe("GET /posts", () => {
        it("should retrieve all posts", async () => {
            const mockPosts = [
                { _id: "post1", title: "Title1", content: "Content1" },
                { _id: "post2", title: "Title2", content: "Content2" },
            ];

            Posts.find.mockResolvedValue(mockPosts);

            const response = await request(app)
                .get("/posts")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ posts: mockPosts });
            expect(Posts.find).toHaveBeenCalled();
        });

        it("should handle database errors", async () => {
            Posts.find.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .get("/posts")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Error in database at get method of posts",
            });
        });
    });

    describe("GET /posts/:id", () => {
        it("should retrieve a post by ID", async () => {
            const mockPost = { _id: "123", title: "Test Title", content: "Test Content" };

            Posts.findOne.mockResolvedValue(mockPost);

            const response = await request(app)
                .get("/posts/123")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ post: mockPost });
            expect(Posts.findOne).toHaveBeenCalled();
        });

        it("should return 404 if post not found", async () => {
            Posts.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get("/posts/post123")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: "Post Not found",  
            });
        });
    });

    describe("PUT /posts/:id", () => {
        it("should update a post successfully", async () => {
            const mockPost = { _id: "post123", title: "Old Title", content: "Old Content" };
            Posts.findOne.mockResolvedValue(mockPost);
            Posts.updateOne.mockResolvedValue({});

            const response = await request(app)
                .put("/posts/post123")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ title: "New Title", content: "New Content" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ msg: "Post updated successfully" });
            expect(Posts.updateOne).toHaveBeenCalledWith(
                { _id: "post123" },
                { $set: { title: "New Title", content: "New Content" } }
            );
        });

        it("should return 400 if post not found", async () => {
            Posts.findOne.mockResolvedValue(null);

            const response = await request(app)
                .put("/posts/post123")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ title: "New Title", content: "New Content" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "Post doesnt Exist"
            });
        });
    });

    describe("DELETE /posts/:id", () => {
        it("should delete a post successfully", async () => {
            Posts.findById.mockResolvedValue({ _id: "post123" });
            Posts.deleteOne.mockResolvedValue({});

            const response = await request(app)
                .delete("/posts/post123")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ msg: "post deleled successfully" });
            expect(Posts.deleteOne).toHaveBeenCalledWith({ _id: "post123" });
        });

        it("should return 500 if post does not exist", async () => {
            Posts.findById.mockResolvedValue(null);

            const response = await request(app)
                .delete("/posts/post123")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ msg: "Post doesnt exist" });
        });
    });
});