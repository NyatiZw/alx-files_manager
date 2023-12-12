// utils/redis.js

const redis = require('redis');

class RedisClient {
	constructor() {
		this.client = redis.createClient();

		// Display any errors in the console
		this.client.on('error', (err) => {
			console.error(`Redis Client Error: ${err}`);
		});
	}

	isAlive() {
		// Check if the connection to Redis is successful
		return this.client.connected;
	}

	async get(key) {
		return new Promise((resolve, reject) => {
			this.client.get(key, (err, reply) => {
				if (err) {
					reject(err);
				} else {
					resolve(reply);
				}
			});
		});
	}

	async set(key, value, duration) {
		return new Promise((resolve, reject) => {
			this.client.setex(key, duration, value, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}

	async del(key) {
		return new Promise((resolve, reject) => {
			this.client.del(key, (err, reply) => {
				if (err) {
					reject(err);
				} else {
					resolve(reply);
				}
			});
		});
	}
}


// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
