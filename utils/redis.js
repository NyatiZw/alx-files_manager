// utils/redis.js
import redis from 'redis';
import { promisify } from 'util';


class RedisClient {
	constructor() {
		this.client = redis.createClient();
		this.getAsync = promisify(this.client.get).bind(this.client);

		// Display any errors in the console
		this.client.on('error', (error) => {
			console.log(`Redis Client Error: ${error.message}`);
		});

		this.client.on('connect', () => {
			console.log('Redis client connected to server');
		});
	}

	isAlive() {
		// Check if the connection to Redis is successful
		return this.client.connected;
	}

	async get(key) {
		const value = await this.getAsync(key);
		return value;
	}

	async set(key, value, duration) {
		this.client.setex(key, duration, value);
	}

	async del(key) {
		this.client.del(key);
	}
}

const redisClient = new RedisClient();

module.exports = redisClient;
