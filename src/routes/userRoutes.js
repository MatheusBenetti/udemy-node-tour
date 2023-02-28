const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUsersById);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('admin'));

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
