const express = require('express');
const router = express.Router();
const insta = require('../instagram/SetWinner')

router.get("/insta", (req , res)=>{
    const linkInsta = req.body.link
    insta.start().then(()=>{}).catch(()=>{res.status(401)})
})
module.exports = router