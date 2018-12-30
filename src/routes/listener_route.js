const router = require('express').Router();
const ListenerController = require('../controllers/listener_controller');

router.post('/', ListenerController.retrieve);

module.exports = router;
