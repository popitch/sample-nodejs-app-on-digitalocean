const express = require('express');
const router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//       res.send('respond with a resource');
//     res.render('index', { title: 'Express' });
// });

router.all('*', randomPage);

function randomPage(req, res) {
    res.render('table', {
        title: 'Xyi',
    });
}

module.exports = router;
