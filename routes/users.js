const express = require('express');
const router = express.Router();


router.get('/', (req,res)=> {
    res.send('Here\'s users page');
})

module.exports = router