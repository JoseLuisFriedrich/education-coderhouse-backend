import knex from 'knex'

import { IMessage } from '../interfaces/chat'
import dbConfig from '../config/db.sqllite3'

export const messageGet = async (): Promise<Array<IMessage>> => {
  const conn = knex(dbConfig())
  let data = new Array<IMessage>()

  try {
    data = await conn.from('messages')
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }

  return data
}

export const messageInsert = async (message: IMessage) => {
  const conn = knex(dbConfig())

  try {
    await conn('messages').insert(message)
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }
}
