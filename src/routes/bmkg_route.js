const router = require('express').Router();
const BmkgController = require('../controllers/bmkg_controller');
const EarthquakeRequest = require('../middlewares/request-validator/earthquake_request');

router.get('/earthquake', EarthquakeRequest('list'), BmkgController.list);

router.post('/earthquake/callback', BmkgController.callback);
router.get('/earthquake/last', BmkgController.last);
router.get('/earthquake/latest', BmkgController.latest);
router.get('/earthquake/felt', BmkgController.felt);


module.exports = router;
