import express from 'express'
import { body } from 'express-validator'
import { registerUser, loginUser } from '../controllers/authController.js'
import validateInput from '../middlewares/validateInput.js'

const router = express.Router()

router.post('/register', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
], validateInput, registerUser)

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validateInput, loginUser)

export default router
