const { z } = require("zod");

const createBookInput = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
});

const updateBookInput = z.object({
  title: z.string().min(1, "Title is required").optional(),
  author: z.string().min(1, "Author is required").optional(),
  genre: z.string().min(1, "Genre is required").optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
});

module.exports = { createBookInput, updateBookInput };