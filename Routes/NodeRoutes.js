
require('dotenv').config();
const express = require('express');
const router = express.Router();
const insta = require('../instagram/SetWinner')
const cors = require('cors')

router.use(cors())
router.post("/insta",express.json(), (req , res)=>{
    const link = req.body.link
    console.log(link)
    insta.start(link , process.env.EMAIL , process.env.PASSWORD ).then((winner)=>{ res.send(winner)})
})
module.exports = router