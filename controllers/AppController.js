// controllers/AppController.js

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AppController {
	static async getStatus(req, res) {
		const redisStatus = redisClient.isAlive();
		const dbStatus = await dbClient.isAlive();

		const status = {
			redis: redisStatus,
			db: dbStatus,
		};

		const statusCode = redisStatus && dbStatus ? 200 : 500;

		res.status(statusCode).json(status);
	}

	static async getStats(req, res) {
		const usersCount = await dbClient.nbUsers();
		const filesCount = await dbClient.nbFiles();

		const stats = {
			users: usersCount,
			files: filesCount,
		};

		res.status(200).json(stats);
	}
}


module.exports = AppController;
