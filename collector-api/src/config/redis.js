import dotenv from 'dotenv';
dotenv.config();

import Redis from "ioredis"


const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PASSWORD=process.env.REDIS_PASSWORD
const REDIS_PORT= process.env.REDIS_PORT

console.log( REDIS_HOST , REDIS_PASSWORD)
if(!REDIS_HOST || !REDIS_PASSWORD || !REDIS_PORT) throw new Error("Redis environment variable not loaded")

export const redis = new Redis({
 host: REDIS_HOST,
  port:REDIS_PORT,
  password:REDIS_PASSWORD 
})