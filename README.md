# Grave Site Geotagging Application

A web application for geotagging and managing grave site information, including details such as names, descriptions, dates, and images.

## Features

- Interactive map display of grave sites
- Add new grave sites with detailed information
- View grave site details including images
- Responsive design for mobile and desktop
- List view of all grave sites

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd grave-site-geotagging
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/grave-sites
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. The main page displays a map and a list of grave sites
2. Click "Add New Grave" to open the form for adding a new grave site
3. Fill in the required information:
   - Name
   - Description
   - Date of Birth
   - Date of Death
   - Coordinates (latitude and longitude)
   - Image URL (optional)
4. Click "Add Grave Site" to save the information
5. The new grave site will appear on both the map and in the list

## Development

- Backend API runs on `http://localhost:5000`
- Frontend development server runs on `http://localhost:3000`
- The application uses MongoDB for data storage
- React and Leaflet for the frontend interface

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 