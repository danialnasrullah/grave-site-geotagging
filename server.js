const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grave-sites', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Grave Site Schema
const graveSiteSchema = new mongoose.Schema({
  name: String,
  description: String,
  dateOfBirth: Date,
  dateOfDeath: Date,
  coordinates: {
    lat: Number,
    lng: Number
  },
  imageUrl: String,
  profession: String
});

const GraveSite = mongoose.model('GraveSite', graveSiteSchema);

// API Routes
app.get('/api/grave-sites', async (req, res) => {
  try {
    const graveSites = await GraveSite.find();
    res.json(graveSites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/grave-sites', async (req, res) => {
  try {
    const graveSite = new GraveSite(req.body);
    const savedGraveSite = await graveSite.save();
    res.status(201).json(savedGraveSite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 