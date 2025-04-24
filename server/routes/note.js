const express = require("express");
const db = require("../db/db.js");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/notes", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const notes = await db("notes").where({ user_id: decoded.userId });
    res.json(notes);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post(
  "/notes",
  bodyParser.urlencoded({ extended: true }),
  upload.none(),
  async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }
    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      const { title, content } = req.body;
      const note = { title, content, user_id: decoded.userId };
      const insertedNotes = await db("notes").insert(note).returning("*");
      console.log("Added note '" + title + "' with id " + insertedNotes[0].id);
      res.status(201).json(insertedNotes[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  bodyParser.urlencoded({ extended: true }),
  upload.none(),
  async (req, res) => {
    const token = req.cookies.token;
    const { id } = req.params;
    const { title, content } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }
    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      const notes = await db("notes")
        .where({ id: id, user_id: decoded.userId })
        .update({ title, content }, ["title", "content"]);
      if (notes.length != 0) {
        console.log("Updated note '" + title + "' with id " + id);
        res.status(201).send(notes);
      } else {
        res.status(404).json({ message: "Notes not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = (await db("notes").where({ id }))[0];
    const notes = await db("notes").where({ id }).del();
    if (notes) {
      res.status(204).send();
      console.log(
        "Deleted note '" + deletedNote.title + "' with id " + deletedNote.id
      );
    } else {
      res.status(404).json({ message: "Notes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/login",
  bodyParser.urlencoded({ extended: true }),
  upload.none(),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await db("users").where({ email: email }).first();
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        try {
          const userToken = jwt.sign({ userId: user.id }, "your_jwt_secret", {
            expiresIn: "1h",
          });
          res.cookie("token", userToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 3600000,
          });
          res.status(201).json({ message: "Log in successfull" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        console.log("Incorrect password");
      }
    } else {
      console.log("User doesn't exist");
    }
  }
);

router.post(
  "/signup",
  bodyParser.urlencoded({ extended: true }),
  upload.none(),
  async (req, res) => {
    const { email, password } = req.body;
    if (await db("users").where({ email: email }).first()) {
      console.log("User already exists");
    } else {
      try {
        const hashPassword = await bcrypt.hash(password, 10);
        const [user] = await db("users")
          .insert({
            email: email,
            password: hashPassword,
          })
          .returning(["id"]);
        console.log("Added user '" + email + "'");
        const userToken = jwt.sign({ userId: user.id }, "your_jwt_secret", {
          expiresIn: "1h",
        });
        res.cookie("token", userToken, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 3600000,
        });
        res.status(201).json({ message: "Sign up successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

router.get("/checkAuth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
