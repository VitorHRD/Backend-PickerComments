
require('dotenv').config();

const express = require('express')
const NodeRoutes = require('./Routes/NodeRoutes')
const app = express()
const PORT = process.env.PORT || 3000


app.use('/', NodeRoutes)

app.listen(PORT , ()=>{console.log("servidor rodando na porta " + PORT)})