import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db

export async function openDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    })
  }
  return db
}
