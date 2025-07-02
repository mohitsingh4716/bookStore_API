
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { signupInput, signinInput } = require("../validation/authValidation");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    console.log("Register attempt:", { email: body.email, name: body.name });

    const { success, error } = signupInput.safeParse(body);

    if (!success) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.errors,
      });
    }

  
    const users = await readJSON("users.json");

    // Check if user already exists
    const existingUser = users.find(user => user.email === body.email);
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);


    const newUser = {
      id: uuidv4(),
      email: body.email,
      password: hashedPassword,
      name: body.name,
      // createdAt: new Date().toISOString(),
    };

    // Add user to array and save
    users.push(newUser);
    await writeJSON("users.json", users);

   
    const token= jwt.sign({userId: newUser.id}, `${process.env.JWT_SECRET}`);

    res.status(201).json({
      jwt: token,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    console.log("Login attempt:", { email: body.email });

    const { success, error } = signinInput.safeParse(body);

    if (!success) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.errors,
      });
    }

    
    const users = await readJSON("users.json");


    const user = users.find(u => u.email === body.email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, `${process.env.JWT_SECRET}`);

    res.json({
      jwt: token,
      message: "User signed in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error signing in user:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;