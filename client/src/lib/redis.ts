import Redis from 'ioredis';
import { REDIS_PASSWORD } from '$env/static/private';

const redisClient = new Redis({
	password: REDIS_PASSWORD,
	host: 'redis',
	port: 6379
});

export default redisClient;
