const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb+srv://YgtkXpwBqwzz0lQi:YgtkXpwBqwzz0lQi@cluster0.mzdl5vy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define a schema for a single value
const valueSchema = new mongoose.Schema({
  value: String
});

// Create a Value model based on the schema
const Value = mongoose.model('Value', valueSchema);

app.use(express.json());

// Route to receive a value in Postman and save it to MongoDB
app.post('/value', async (req, res) => {
  const { value } = req.body;
  try {
    const newValue = new Value({ value });
    await newValue.save();
    res.send('Value added to database');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to retrieve the latest value from MongoDB
app.get('/value', async (req, res) => {
  try {
    const latestValue = await Value.findOne().sort({ _id: -1 }).limit(1);
    res.json(latestValue);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
