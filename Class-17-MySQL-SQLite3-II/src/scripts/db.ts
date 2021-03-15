import { unlink } from 'fs'
import knex from 'knex'

import mySqlConfig from '../config/db.mysql'
import sqLite3Config from '../config/db.sqllite3'

const dbName = 'jlf_coder_backend'

const createSchema = async (config, isSqLite) => {
  console.log(config.client)
  let conn = knex(config)

  try {
    console.log(' db creation')

    if (isSqLite) {
      unlink(config.connection.filename, err => {})
    } else {
      await conn.raw(`DROP DATABASE IF EXISTS ${dbName}`)
      await conn.raw(`CREATE DATABASE ${dbName}`)
    }
    conn.destroy()

    config.connection.database = dbName
    conn = knex(config)

    console.log(' tables creation')

    await conn.schema.createTable('messages', table => {
      table.increments('id')
      table.string('user')
      table.string('text')
      table.string('date')
    })

    await conn.schema.createTable('products', table => {
      table.increments('id')
      table.string('title')
      table.integer('price')
      table.string('thumbnail')
    })

    conn.destroy()
  } catch (ex) {
    console.error(ex)
    conn.destroy()
  }
}

createSchema(sqLite3Config(), true)
createSchema(mySqlConfig(false), false)
