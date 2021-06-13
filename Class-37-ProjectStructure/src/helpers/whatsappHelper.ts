import { Twilio } from 'twilio'
import * as msc from './miscHelper'
import logger from './logHelper'

export const send = async text => {
  const sid = msc.arg(6, process.env.SMS_SID)
  const token = msc.arg(7, process.env.SMS_TOKEN)

  const twilio = new Twilio(sid, token)
  twilio.messages
    .create({
      body: text,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5491156341378',
    })
    .then(message => logger.log('info', message.sid))
    .catch(logger.log)
}

// SMS
// {
//   body: text,
//   from: '+19495372662',
//   to: '+5491156341378',
// }
