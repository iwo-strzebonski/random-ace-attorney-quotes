import cors from 'cors'
import dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import swaggerUi from 'swagger-ui-express'
import { Redis } from '@upstash/redis'

import swaggerOptions from './config/swagger'
import { RegisterRoutes } from './routes'
import swaggerDocument from './swagger.json' assert { type: "json" }

export const app = express()

dotenv.config()

console.debug(process.env.REDIS_URL)

app.use(cors())
app.use(
  urlencoded({
    extended: true
  })
)
app.use(json())
app.use(express.static('public'))

try {
  app.use('/_docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { swaggerOptions, explorer: true }))
} catch (err) {
  console.error('Unable to read swagger.json', err)
}

export const redis = Redis.fromEnv()

console.debug(await redis.ping())

RegisterRoutes(app)
