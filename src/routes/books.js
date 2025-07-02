
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const { createBookInput, updateBookInput } = require("../validation/bookValidation");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


router.get("/", async (req, res) => {
  try {
    const books = await readJSON("books.json");
    res.json({
      books,
      total: books.length,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await readJSON("books.json");
    
    const book = books.find(b => b.id === id);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const body = req.body;
    
    const { success, error } = createBookInput.safeParse(body);
    
    if (!success) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.errors,
      });
    }

    const books = await readJSON("books.json");

    const newBook = {
      id: uuidv4(),
      title: body.title,
      author: body.author,
      genre: body.genre,
      publishedYear: body.publishedYear,
      userId: req.user.id,
      // createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString(),
    };

    books.push(newBook);
    await writeJSON("books.json", books);

    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const { success, error } = updateBookInput.safeParse(body);
    
    if (!success) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.errors,
      });
    }

    const books = await readJSON("books.json");
    const bookIndex = books.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = books[bookIndex];
    

    if (book.userId !== req.user.id) {
      return res.status(403).json({ 
        error: "Access denied. You can only update books you created." 
      });
    }


    const updatedBook = {
      ...book,
      ...body,
    };

    books[bookIndex] = updatedBook;
    await writeJSON("books.json", books);

    res.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await readJSON("books.json");
    
    const bookIndex = books.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = books[bookIndex];
    
    // Check if user owns the book
    if (book.userId !== req.user.id) {
      return res.status(403).json({ 
        error: "Access denied. You can only delete books you created." 
      });
    }

    books.splice(bookIndex, 1);
    await writeJSON("books.json", books);

    res.json({
      message: "Book deleted successfully",
      deletedBook: book,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
