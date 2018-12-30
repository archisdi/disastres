const router = require('express').Router();
const BmkgController = require('../controllers/bmkg_controller');

router.post('/callback', BmkgController.checkLatest);

module.exports = router;
