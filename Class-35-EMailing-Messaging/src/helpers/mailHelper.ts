import nodemailer from 'nodemailer'
import * as msc from '../helpers/miscHelper'

export const send = async text => {
  const transporter = nodemailer.createTransport({
    host: 'c1690738.ferozo.com',
    port: 465,
    secure: true,
    auth: {
      user: msc.arg(4, process.env.MAIL_USER),
      pass: msc.arg(5, process.env.MAIL_PASSWORD),
    },
  })

  await transporter.sendMail({
    from: 'Coderhouse <coderhouse@jlf.com.ar>',
    to: 'coderhouse@jlf.com.ar',
    subject: text,
    text: text,
    html: text,
  })

  // test ethereal
  // host: 'smtp.ethereal.email'
  // user: 'eleanore.kuhlman1@ethereal.email'
  // pass: 'j6HNRPgyAepFU69841'
  // port: 587
  // secure: false
  // from: '"Coderhouse 👻" <eleanore.kuhlman1@ethereal.email>'
  // to: 'eleanore.kuhlman1@ethereal.email'

  // test gmail
  // {
  //   service: 'gmail',
  //   auth: {
  //     user: 'coderhousebackend@gmail.com',
  //     pass: 'j6HNRPgyAepFU69841',
  // }
  // from: 'coderhousebackend@gmail.com'
  // to: 'coderhousebackend@gmail.com'
}
