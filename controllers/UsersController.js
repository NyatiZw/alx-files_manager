const redisClient = require('../redisClient');
const User = require('../models(User');

module.exports = {
	getMe: async (req, res) => {
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

			const user = await User.findById(userId, { email: 1, _id: 1 });

			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			return res.json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
