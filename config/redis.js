import Redis from "ioredis";
// import dotenv from 'dotenv';
// dotenv.config();





const redis = new Redis({
    host: 'oregon-keyvalue.render.com',
    username: process.env.REDIS_USER || 'red-d102ll8gjchc73aa09j0',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '8y8Bx5W50GCyx8SIdE8j5asuRogvoi19',
    tls:true
    
    
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

