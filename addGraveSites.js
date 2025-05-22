const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

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

const graveSites = [
  {
    name: "Naseem Begum",
    coordinates: {
      lat: 31.54858650571382,
      lng: 74.3075781
    },
    dateOfBirth: new Date("1936-02-24"),
    dateOfDeath: new Date("1971-09-29"),
    profession: "Musician"
  },
  {
    name: "Feroz Nizami",
    coordinates: {
      lat: 31.548583763599748,
      lng: 74.30744822324195
    },
    dateOfBirth: new Date("1910-11-01"),
    dateOfDeath: new Date("1975-11-15"),
    profession: "Musician"
  },
  {
    name: "Zahida Parveen",
    coordinates: {
      lat: 31.548500,
      lng: 74.307400
    },
    dateOfDeath: new Date("1975-05-07"),
    profession: "Musician"
  },
  {
    name: "Sahibzada Sikamdar Shaheen",
    coordinates: {
      lat: 31.549024619858127,
      lng: 74.30680663673671
    },
    profession: "Actor"
  },
  {
    name: "Nargis urf Nago",
    coordinates: {
      lat: 31.548716051157832,
      lng: 74.3065370520771
    },
    dateOfDeath: new Date("1972-01-05"),
    profession: "Actress"
  },
  {
    name: "Malkah Farah Aijaz urf Nadira",
    coordinates: {
      lat: 31.548724620299115,
      lng: 74.30646480974727
    },
    dateOfBirth: new Date("1968-11-22"),
    dateOfDeath: new Date("1995-08-06"),
    profession: "Actress and Dancer"
  },
  {
    name: "Nawab Zulfiqat Ali Khan",
    coordinates: {
      lat: 31.548183764226895,
      lng: 74.30708793673666
    },
    dateOfBirth: new Date("1922-11-22"),
    dateOfDeath: new Date("2009-08-15"),
    profession: "Politician"
  }
];

async function addGraveSites() {
  try {
    // Clear existing entries
    await GraveSite.deleteMany({});
    
    // Add new entries
    const result = await GraveSite.insertMany(graveSites);
    console.log('Successfully added grave sites:', result);
  } catch (error) {
    console.error('Error adding grave sites:', error);
  } finally {
    mongoose.connection.close();
  }
}

addGraveSites(); 