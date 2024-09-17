const express = require('express')

require('dotenv').config({ path: './.env' })
const app = express()
//const dbConnection = require('./db/dbConnection')

console.log("front: " + process.env.FRONT_URL)

const port = process.env.PORT

const routes = require('./api/endPoints')
const cors = require('cors');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.FRONT_URL],
    methods: ["GET", "POST", "DELETE"]
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})