import redis from 'redis';
import promise from 'bluebird';

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

export const redisClient = () => {
	return new Promise((resolve, reject) => {
		
		const redisClient = redis.createClient();

		redisClient.on('connect', () => {
			resolve(redisClient);
		});

		redisClient.on('error', () => {
			reject("Redis Connection failed");
		});
	});
}