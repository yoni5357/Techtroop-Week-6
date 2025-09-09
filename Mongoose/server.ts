import dotenv from 'dotenv'
dotenv.config();

// Server setup
import express from 'express';
const server = express()
server.use(express.json());
import api from './routes/api';

// Mongoose setup
import mongoose from 'mongoose';
mongoose.connect(process.env.DB_CONNECTION).catch((err)=> console.log(err))

server.use('/', api)

const port = 4200
server.listen(port, function () {
    console.log(`Running on port ${port}`)
})