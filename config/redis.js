import Redis from "ioredis";
import dotenv from 'dotenv';
dotenv.config();





const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls:{}
});

redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

redis.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});

export default redis;

