require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const dbConnection = require("./config/db");
dbConnection();

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`server is listening on ${port}`);
})