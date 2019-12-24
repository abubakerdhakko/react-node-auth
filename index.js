const express = require('express');
const app = express();
var cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')

// cors
app.use(cors())

// env file
dotenv.config();
// conect db

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('conected to db'));
// import Routes

app.use(express.json());
// routes middleware
app.use('/api/user', authRoutes);

app.use('/api/posts', postRoutes);

app.listen(3000, () => console.log('server running'));