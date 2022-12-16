const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUsers);

router
    .route('/:id')
    .get(userController.getUsersById)
    .patch(userController.updateUsers)
    .delete(userController.deleteUsers);

module.exports = router;
