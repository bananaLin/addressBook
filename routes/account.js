/*var express = require('express'),
    router = express.Router(),
    account = require('../model/account.js');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addAccount', account.addAccount);
router.get('/login', account.login);

module.exports = router;*/
exports.setRequestUrl = function(app){
    account = require('../model/account.js');

    app.get('/account/addAccount', account.addAccount);
    app.get('/account/login', account.login);
}
