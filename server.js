const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/library")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  genre: String
});

const Book = mongoose.model("Book", bookSchema);

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


app.post("/books", async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json({ message: "Book added", book: newBook });
});


app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

app.put("/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Book updated", updatedBook });
});


app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});


app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.get("/",(req,res)=>{
    res.send("Library API is running")
});
app.use(express.json());
app.use("/api/books", require("./routes/auth"));
