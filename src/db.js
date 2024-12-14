const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();


function connectToDatabase(url) {
    mongoose.connect(url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Database not connected" + err))
}
connectToDatabase(process.env.MONGODB_URL)


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique : true
    },
    email: {
        type: String,
        required: true // add validator function if u got time
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

const Users = mongoose.model("Users", userSchema);
const Posts = mongoose.model("Posts", postSchema);
const Comments = mongoose.model("Comments", commentSchema);

module.exports = {
    Users,
    Posts,
    Comments
}
