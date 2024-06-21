// Backend (Node.js)
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");d
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cors = require("cors");
const app = express();
// app.use(cors());

const bodyParser = require("body-parser");
const { log } = require("util");
app.use(bodyParser.json());

//middlewear
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1]; // Remove 'Bearer ' prefix
  console.log(token);

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    req.username = decoded.username;
    next();
  });
}

// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://haripriyaharidas221:b4bnXmj1vszEV2p0@cluster0.mtnr9ft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Define a schema for user authentication data
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profileImage: String,
  name: String,
  followers: Number,
});

// Define a schema for images
const imagesSchema = new mongoose.Schema({
  username: String,
  src: String,
  text: String,
  name: String,
  likes: Number,
});

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);
// const images =mongoose.model('images',imagesSchema)// Create a model based on the schema
const Image = mongoose.model("Image", imagesSchema);

// Serve Bootstrap CSS file
app.use("/css", express.static(path.join(__dirname, "homes.css")));
app.use(express.json());
app.use(express.static("logins"));
// Use the middleware for all API routes

// Serve the login form
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/logins/logins.html");
});

// Example protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", username: req.username });
});

app.get("/css/bootstrap.css", (req, res) => {
  res.sendFile(path.join(__dirname, "homes.css"), {
    headers: {
      "Content-Type": "text/css",
    },
  });
});

app.get("/api/users/:username/profileImage", verifyToken, async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user in the database by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the profile image URL
    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Error fetching profile image" });
  }
});

app.get("/sort/mypost", verifyToken, async (req, res) => {
  try {
    // Extract the username from req.username, which is set by the verifyToken middleware
    const username = req.username;

    // Fetch sorted images with the extracted username
    const images = await Image.find({ username }).sort({ username: 1 }).exec();

    // Send the sorted images data to the frontend
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Error getting data" });
  }
});

app.get("/sort", verifyToken, async (req, res) => {
  try {
    // Fetch all images
    const images = await Image.find().sort({ likes: -1 }).exec();
    // Fetch all users
    const users = await User.find().sort({ followers: -1 }).exec();

    // Send the sorted images and users data to the frontend
    res.status(200).json({ images, users });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Error getting data" });
  }
});

app.get("/images", verifyToken, async (req, res) => {
  try {
    const images = await Image.find().exec();
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error loading images:", error);
    res.status(500).json({ message: "Error loading images" });
  }
});

// User registration
app.post("/api/users", verifyToken, async (req, res) => {
  try {
    const usersData = req.body;
    for (let i = 0; i < usersData.length; i++) {
      const { username, password, profileImage, name, followers } =
        usersData[i];

      // Hash the password before saving to the database
      console.log(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashedPassword,
        profileImage: profileImage, // Save the profile image URL to the database
        name: name,
        followers: followers,
      });
      await newUser.save();
    }
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/images", verifyToken, async (req, res) => {
  try {
    const imagesData = req.body;
    for (let i = 0; i < imagesData.length; i++) {
      const { username, src, text, name, likes } = imagesData[i];
      const newImg = new Image({
        username: username,
        src: src,
        text: text,
        name: name,
        likes: likes,
      });
      await newImg.save();
    }
    res.status(201).json({ message: "Images registered successfully" });
  } catch (error) {
    console.error("Error registering images:", error);
    res.status(500).json({ message: "Error registering images" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    // Check if the user exists in the Mongoose model
    const user = await User.findOne({ username: username });
    console.log(user);
    if (user) {
      // User exists, authenticate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Generate JWT token for authentication
        const token = jwt.sign({ username: user.username }, "secretkey");
        res.json({ message: "Authentication successful", token });
        // res.redirect('homes.html');
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).send("Server error: " + err.message);
  }
});

app.post("/addcontent", async (req, res) => {
  try {
    const { src, text, name, likes, username } = req.body;

    // Create a new content document
    const newContent = new Image({
      src,
      text,
      name,
      likes,
      username,
    });

    // Save the new content to the database
    await newContent.save();

    res.status(201).json({ message: "Content added successfully" });
  } catch (error) {
    console.error("Error adding content:", error);
    res.status(500).json({ message: "Failed to add content" });
  }
});

// PUT endpoint to update an image by ID
app.put("/images/edit", async (req, res) => {
  const { id, src, text, name, likes, username } = req.body;

  try {
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { src, text, name, likes, username },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res
      .status(200)
      .json({ message: "Image updated successfully", image: updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/images/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    console.log(imageId);

    // Find the image in the database by its _id
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the image document from the database
    await Image.findByIdAndDelete(imageId);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Error deleting image" });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
