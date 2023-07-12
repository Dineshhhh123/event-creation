const express = require('express');
const router  = express.Router();

const eventController = require('../controllers/controller');

router.post('/api/users/register',eventController.register);
router.post('/api/users/adregister',eventController.adregister);
router.post('/api/users/login',eventController.login);
router.post('/api/users/adlogin',eventController.adlogin);
router.post('/api/events',eventController.create);
router.post('/api/events/book',eventController.booking);
router.post('/api/events/cancel',eventController.cancel);
router.get('/api/events',eventController.getAll);
router.get('/api/events/nearby',eventController.nearby);
router.get('/api/events/participants',eventController.participants);



module.exports = router;