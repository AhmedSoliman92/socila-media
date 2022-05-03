const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3500;

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}` );
})