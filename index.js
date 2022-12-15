const config = require('dotenv').config
const express = require("express");
const cors = require('cors');
var bodyParser = require('body-parser')
const userRoutes = require("./api/server/routes/UserRoutes");

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.use('/api/v1/users',userRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to this API.'
}));

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

module.exports = app;