import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import { openDb } from './models/db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Init DB and create table if needed
async function init() {
  const db = await openDb()
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    tel TEXT NOT NULL,
    password TEXT NOT NULL
  )`)
}
init()

app.use('/api', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
})
