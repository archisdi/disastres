const router = require('express').Router();
const BmkgController = require('../controllers/bmkg_controller');

router.post('/earthquake/callback', BmkgController.callback);
router.get('/earthquake/last', BmkgController.checkLast);
router.get('/earthquake/latest', BmkgController.checkLatest);

module.exports = router;
