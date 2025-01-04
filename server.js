const express = require('express');
const cors = require('cors');
const connectToDb = require('./db');
const dotenv = require('dotenv').config()
const router = require('./routes/routes');


const app = express();
app.use(express.json());
app.use(cors());

connectToDb();
  
app.use(router);

app.listen(process.env.port , ()=>{
    console.log(` Server Started on port ${process.env.port}`)
});