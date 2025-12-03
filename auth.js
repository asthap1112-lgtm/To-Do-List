const express = require("express");
const bcrypt = require("bcryptjs");
const book = require("../models/user"); 
const jwt = require ("jsonwebtoken");
const router = express.Router();


router.post("/add-book", async (req, res) => {
    try {
        const { name, author, year, genre } = req.body;
    
        if (!name || !author) {
            return res.status(400).json({ msg: "Please enter  required fields" });
        }
        const existingBook = await book.findOne({ name});
        if (existingBook) {
            return res.status(400).json({ msg: "Book already exists" });
        }   
        const newBook = new book({
            name,
            author,
            year,   
            genre
        });
        await newBook.save();
        res.status(201).json({ msg: "Book added successfully", book: newBook });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    router.post("/addbook", async (req, res) => {
        res.send(" API workings");
});
});
    router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPass
        });

        await newUser.save();
        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY", {
            expiresIn: "1h"
        });

        res.json({ message: "Login successful", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;