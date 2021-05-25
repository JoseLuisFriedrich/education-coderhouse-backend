import winston from 'winston'

const transports = [
  new winston.transports.Console({ level: 'debug' }),
  // new winston.transports.File({ filename: '../bin/log_warn.log', level: 'warn' }),
  // new winston.transports.File({ filename: '../bin/log_error.log', level: 'error' }),
]

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => `[${info.timestamp}] -> [${info.level}] -> ${info.message}`)
)

const levels = { error: 0, warn: 1, info: 2, debug: 4 }
const colors = { error: 'red', warn: 'yellow', info: 'green', debug: 'magenta' }

winston.addColors(colors)

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default logger
