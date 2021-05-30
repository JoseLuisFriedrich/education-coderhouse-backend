import { Twilio } from 'twilio'
import * as msc from '../helpers/miscHelper'

export const send = async text => {
  const twilio = new Twilio(msc.arg(6, process.env.SMS_SID) || '', msc.arg(7, process.env.SMS_TOKEN) || '')

  twilio.messages
    .create({
      body: text,
      from: '+19495372662',
      to: '+5491156341378',
    })
    .then(message => console.log(message.sid))
    .catch(console.log)
}
