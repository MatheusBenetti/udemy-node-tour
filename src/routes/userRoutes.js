const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUsersById
);
router.patch('/update-me', authController.protect, userController.updateMe);
router.delete('/delete-me', authController.protect, userController.deleteMe);

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
