import knex from 'knex'

import { Message } from '../interfaces/chat'
import dbConfig from '../config/db.sqllite3'

export const messageGet = async (): Promise<Array<Message>> => {
  const conn = knex(dbConfig())
  let data = new Array<Message>()

  try {
    data = await conn.from('messages')
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }

  return data
}

export const messageInsert = async (message: Message) => {
  const conn = knex(dbConfig())

  try {
    await conn('messages').insert(message)
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }
}
