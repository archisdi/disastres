const router = require('express').Router();
const BmkgController = require('../controllers/bmkg_controller');

router.post('/earthquake/callback', BmkgController.callback);
router.post('/earthquake/last', BmkgController.checkLast);
router.post('/earthquake/latest', BmkgController.checkLatest);

module.exports = router;
