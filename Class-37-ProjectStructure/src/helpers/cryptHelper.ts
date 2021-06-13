import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = 'JLF_S1e50u4mNWRIqCc7rPK01lwM5fr3'
const iv = crypto.randomBytes(16)

export const encrypt = text => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

export const decrypt = hash => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

  return decrpyted.toString()
}
