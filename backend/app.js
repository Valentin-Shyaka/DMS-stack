const express = require("express");
const cors = require("cors");

const app = express();

// configure cors
app.use(cors(
    origin= 'http://localhost:3000',
    credentials =true
));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({ extended: true })
);

require("./app/config/dbConnection");


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Laptop Tracking Management System." });
});

require("./app/routes/admin.routes")(app);
require("./app/routes/laptop.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/laptopEmployee.routes")(app);

module.exports = app;
