const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const app = express();

// configure cors
app.use(cors(
    origin= 'http://localhost:3000',
    credentials =true
));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });   

app.use(morgan('combined', { stream: accessLogStream }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({ extended: true })
);

require("./app/config/dbConnection");


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Library Management System." });
});

require("./app/routes/student.routes")(app);
require("./app/routes/book.routes")(app);

module.exports = app;
