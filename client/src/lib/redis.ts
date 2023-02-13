import redis from 'redis';
import { REDIS_PASSWORD } from '$env/static/private';

const redisClient = redis.createClient({
	password: REDIS_PASSWORD,
	socket: {
		host: 'redis',
		port: 6379
	}
});

export default redisClient;
