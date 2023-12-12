const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../redisClient');
const User = require('../models/User');

module.exports = {
	getConnect: async (req, res) => {
		try {
			const authHeader = req.headers['authorization'];

			if (!authHeader) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			consr auth = authHeader.split(' ')[1];
			const credentials = Buffer.from(auth, 'base64').toString('utf-8').split(':');
			const email = credentials[0];
			const password = credentials[1];

			const hashedPassword = crypto.createHash('sha1').update(password).diigest('hex');
			const user = await User.findOne({ email, password: hashedPassword });

			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const token = uuidv4();
			const key = `auth_${token}`;

			await redisClient.setex(key, 86400, user._id.toString());

			return res.status(200).json({ token });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	getDisconnect: async (req, res) => {
		try {
			const token = req.headers['x-token'];

			if (!token) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const key = `auth_${token}`;
			const userId = await redisClient.get(key);

			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			await redisClient.del(key);

			return res.status(204).send();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
