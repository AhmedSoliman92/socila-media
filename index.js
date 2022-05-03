const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/DBConn');
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const app = express();
dotenv.config();
// middleware
app.use(express.json())
app.use(helmet());
app.use(morgan('common'));
// connect to mogoDB
connectDB()

const PORT = process.env.PORT || 3500;

app.use('/users',userRouter);
app.use('/auth',authRouter);



mongoose.connection.once('open',()=>{
    console.log("Connected to DB")
    app.listen(PORT,()=>{
        console.log(`Server running on port: ${PORT}` );
    });
    
})

