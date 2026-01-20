const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Blog = require('./blog');

const app = express();

// Middleware
app.use(cors()); // Critical for the frontend to talk to the backend
app.use(express.json());

// Corrected connection block
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Connection Error:', err));
    
// GET all blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new blog
app.post('/blogs', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    });
    try {
        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: "Validation Error: Title and Body are required" });
    }
});

// DELETE a blog
app.delete('/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(3000, () => console.log(`Server running on port 3000`));