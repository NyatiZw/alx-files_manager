const crypto = require('crypto');
const uuidv4 = require('uuid').v4;
const { redisClient } = require('../utils/redis');


class AuthController {
	static async getConnect(req, res) {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Basic ')) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString('utf-8');
		const [email, password] = credentials.split(':');

		const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

		const user = null;

		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const token = uuidv4();

		await redisClient.set(`auth_${token}`, user.id, 'EX', 24 * 60 * 60);

		return res.status(200).json({ token });
	}

	static async getDisconnect(req, res) {
		const authToken = req.headers['x-token'];

		if (!authToken) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const userId = await redisClient.get(`auth_${authToken}`);

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		await redisClient.del(`auth_${authToken}`);

		return res.status(204).end();
	}
}


module.exports = AuthController;
