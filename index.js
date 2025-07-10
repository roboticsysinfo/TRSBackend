const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require('./routes/companyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const storyRoutes = require('./routes/storyRoutes');
const adminRoutes = require("./routes/adminRoutes");
const siteDetailsRoutes = require("./routes/siteDetailsRoutes");
const blogRoutes = require("./routes/blogRoutes");


const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // ✅ Use exact frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // ✅ This allows cookies to be sent
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL parameters parsing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

// ========= Routes=============
app.use("/api", userRoutes);
app.use('/api', companyRoutes);
app.use('/api', categoryRoutes);
app.use('/api', storyRoutes)
app.use('/api', adminRoutes)
app.use('/api', siteDetailsRoutes)
app.use('/api', blogRoutes)
// ========= Routes end=============

app.get('/', (req, res) => {
  res.send('Welcome, True Real Story')
});


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running successfully on ${port}`);
});