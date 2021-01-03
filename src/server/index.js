const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes/hospitalRoutes'); //importing route

// Initialize express & bodyParser.
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: true }));

let port = process.env.PORT || 3001;

// Register routes.
routes(app);

// Listen on port.
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
