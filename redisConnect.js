import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('connect', () => console.log("Redis Client Coonected"));

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;