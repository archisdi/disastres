const router = require('express').Router();
const BmkgController = require('../controllers/bmkg_controller');

router.post('/earthquake/callback', BmkgController.callback);
router.get('/earthquake/last', BmkgController.last);
router.get('/earthquake/latest', BmkgController.latest);
router.get('/earthquake/felt', BmkgController.felt);

module.exports = router;
