const express = require('express');
const router = express.Router();


router.get('/', (req,res)=> {
    res.send('Here\'s auth page');
})

module.exports = router