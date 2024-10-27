const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.send('Backend for progress management app');
});

module.exports = router;
