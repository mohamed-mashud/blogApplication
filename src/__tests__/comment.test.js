const request = require("supertest");
const createServer = require("../utils/server");
const app = createServer();
const { Posts, Comments } = require("../db.js"); 

jest.mock("../db.js", () => ({
    Posts: {
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
    },
    Comments: {
        create: jest.fn(),
        sendStatus: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

describe("Comment Handlers", () => {
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc1MWRiYTVkOWJjNGQ2YTg5ZGQ1YjMyIiwiaWF0IjoxNzM0MDE5MTc2fQ.l6XcGYgwLRUvA88KofDWaHORlwpFGZIOO0iW2Q1N_mg";  

    describe("POST /comments", () => {
        it("should create a comment successfully if post exists", async () => {
            // random post_id
            const post_id = "MongoDBIdOnlySuport24Len";
            const commentData = { content: "Test comment", author_id: "user123", post_id };
    
            Posts.findOne.mockResolvedValue({ _id: post_id }); 
            Comments.create.mockResolvedValue({ _id: "comment123", ...commentData }); 
    
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${mockToken}`)
                .send(commentData);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                Message: "Comment created successfully",
                commentId: "comment123",
            });
            expect(Posts.findOne).toHaveBeenCalledWith({ _id: post_id });
            expect(Comments.create).toHaveBeenCalledWith(commentData);
        });
    
        it("should return 404 if post does not exist", async () => {
            //randome post_id
            const post_id = "MongoDBIdOnlySuport24Len";
    
            Posts.findOne.mockResolvedValue(null); 
    
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({
                    content: "Test comment",
                    author_id: "user123",
                    post_id,
                });
    
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                Message: "Post doesnt exist",
            });
            expect(Posts.findOne).toHaveBeenCalledWith({ _id: post_id });
            expect(Comments.create).not.toHaveBeenCalled();
        });
    
        it("should return 500 if database errors, when creating comments", async () => {
            // rand post_id
            const post_id = "MongoDBIdOnlySuport24Len";
            const commentData = { content: "Test comment", author_id: "user123", post_id };
    
            Posts.findOne.mockResolvedValue({ _id: post_id }); 
            Comments.create.mockRejectedValue(new Error("Database error")); 
    
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${mockToken}`)
                .send(commentData);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: "Database error",
                Message: "Error in db",
            });
            expect(Posts.findOne).toHaveBeenCalledWith({ _id: post_id });
            expect(Comments.create).toHaveBeenCalledWith(commentData);
        });
    });

    describe("GET /comments", () => {
        it("should return all comments for a valid post", async () => {
            const mockPostId = "MongoDBIdOnlySuport24Len";
            const mockComments = [
                { _id: "MongoDBIdOnlySuport24Len", content: "Great post!", author_id: "user123" },
                { _id: "MongoDBIdOnlySuport24Len", content: "Thanks for sharing!", author_id: "user456" },
            ];
    
            Posts.findOne.mockResolvedValue({ _id: mockPostId });
            Comments.find.mockResolvedValue(mockComments);
    
            const response = await request(app)
                .get("/comments")
                .query({ post_id: mockPostId })
                .set("Authorization", `Bearer ${mockToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                comments: mockComments,
            });
            expect(Posts.findOne).toHaveBeenCalledWith({ _id: mockPostId });
            expect(Comments.find).toHaveBeenCalledWith({ post_id: mockPostId });
        });
        it("should return 404 if the post does not exist", async () => {
            const mockPostId = "MongoDBIdOnlySuport24Len";
    
            Posts.findOne.mockResolvedValue(null);
    
            const response = await request(app)
                .get("/comments")
                .query({ post_id: mockPostId })
                .set("Authorization", `Bearer ${mockToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                Message: "Post doesnt exist",
            });
            expect(Posts.findOne).toHaveBeenCalledWith({ _id: mockPostId });
            expect(Comments.find).not.toHaveBeenCalled();
        });
    });

    describe("GET /comments/:id", () => {
        it("should retrieve a comment by ID", async () => {
            // rand comment id
            const comment_id = "MongoDBIdOnlySuport24Len";
            const mockComment = { _id: comment_id, content: "Test comment", post_id: "post123" };

            Comments.findOne.mockResolvedValue(mockComment);

            const response = await request(app)
                .get(`/comments/${comment_id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ comment: mockComment });
        });

        it("should return 404 if the comment does not exist", async () => {
            Comments.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get("/comments/invalid_comment")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Comment does not exist" });
        });
    });

    describe("PUT /comments/:id", () => {
        it("should update a comment successfully", async () => {
            const comment_id = "MongoDBIdOnlySuport24Len";
            const content = "Updated content";

            Comments.findById.mockResolvedValue({ _id: comment_id });
            Comments.updateOne.mockResolvedValue({});

            const response = await request(app)
                .put(`/comments/${comment_id}`)
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ content });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Comment updated successfully",
                updatedCommentId: comment_id,
            });
            expect(Comments.updateOne).toHaveBeenCalledWith(
                { _id: comment_id },
                { $set: { content } }
            );
        });

        it("should return 404 if a comment didnt exists", async () => {
            Comments.findById.mockResolvedValue(null);

            const response = await request(app)
                .put("/comments/invalid_comment")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ content: "Updated content" });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                Message: "Comment doesnt exist",
            });
        });
    });

    describe("DELETE /comments/:id", () => {
        it("should delete a comment successfully", async () => {
            const comment_id = "MongoDBIdOnlySuport24Len";

            Comments.findById.mockResolvedValue({ _id: comment_id });
            Comments.deleteOne.mockResolvedValue({});

            const response = await request(app)
                .delete(`/comments/${comment_id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Comment deleted successfully" });
            expect(Comments.deleteOne).toHaveBeenCalledWith({ _id: comment_id });
        });

        it("should return 404 if the comment does not exist", async () => {
            Comments.findById.mockResolvedValue(null);

            const response = await request(app)
                .delete("/comments/MongoDBIdOnlySuport24Len")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Comment does not exist" });
        });

        it("should return 500 if there is a database error during deletion", async () => {
            const comment_id = "MongoDBIdOnlySuport24Len";

            Comments.findById.mockResolvedValue({ _id: comment_id });
            Comments.deleteOne.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .delete(`/comments/${comment_id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500); 
            expect(response.body).toEqual({
                message: "Error in db while deleting comment",
            });
        });
    });
});