import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { openDb } from '../models/db.js'

export const registerUser = async (req, res) => {
  const { nom, prenom, email, tel, password } = req.body
  if (!nom || !prenom || !email || !tel || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
  }

  try {
    const db = await openDb()
    const row = await db.get('SELECT * FROM users WHERE email = ?', email)
    if (row) {
      return res.status(409).json({ message: 'Utilisateur déjà enregistré.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.run(
      'INSERT INTO users (nom, prenom, email, tel, password) VALUES (?, ?, ?, ?, ?)',
      nom, prenom, email, tel, hashedPassword
    )

    return res.status(201).json({ message: 'Inscription réussie.', userId: result.lastID })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur.' })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' })
  }

  try {
    const db = await openDb()
    const user = await db.get('SELECT * FROM users WHERE email = ?', email)
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({ message: 'Connexion réussie.', token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur.' })
  }
}
