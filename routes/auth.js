const express = require('express');
const { body } = require('express-validator');
const {register,login,getLogout, loginPage, registerPage} = require('../controllers/auth')
const router = express.Router();

// Validation  for user registration
const validateRegistration = [
  body('email').trim().isEmail().withMessage('Email is required'),
  body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
];

// Validation  for user login
const validateLogin = [
  body('email').trim().isEmail().withMessage('Email is required'),
  body('password').trim().isLength({ min: 5 }).withMessage('Password is required'),
];


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/register',validateRegistration,register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',validateLogin,login )

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the user
 */
router.get('/logout', getLogout);

router.get("/login",loginPage)
router.get("/",loginPage)
router.get("/register",registerPage)

module.exports = router;