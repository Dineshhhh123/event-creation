require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require('mongoose');
const routes = require('./src/routes/routes');

app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});
app.use('/', routes);
mongoose.connect(
    process.env.MONGODB_URI,
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connected")
    }
);
