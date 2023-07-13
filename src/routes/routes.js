const express = require('express');
const router  = express.Router();

const eventController = require('../controllers/controller');
const { authenticateUser , authorizeAdmin } = require('../middleware/authMiddleware')

router.post('/api/users/register',eventController.register);
router.post('/api/users/adregister',eventController.adregister);
router.post('/api/users/login',eventController.login);
router.post('/api/users/adlogin',eventController.adlogin);
router.post('/api/events',authorizeAdmin,eventController.create);
router.post('/api/events/book',authenticateUser,eventController.booking);
router.post('/api/events/cancel',authenticateUser,eventController.cancel);
router.get('/api/events',authenticateUser,eventController.getAll);
router.get('/api/events/all',eventController.findAll);
router.get('/api/events/nearby',eventController.nearby);
router.get('/api/events/participants',eventController.participants);



module.exports = router;