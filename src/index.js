
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const userRouter = require("./routes/user");
const bookRouter = require("./routes/books");

const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());



app.use("/api/v1/user", userRouter);
app.use("/api/v1/books", bookRouter);


app.get("/", (req, res) => {
  res.json({ message: "Bookstore API is running!" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});