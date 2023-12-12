const User = require('../models/User');
const crypto = require('crypto');

module.exports = {
	postNew: async (req, res) => {
		try {
			const { email, password } = req.body;

			if (!email) {
				return res.status(400).json({ error: 'Missing email' });
			}

			if (!password) {
				return res.status(400).json({ error: 'Missing password' });
			}

			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({ error: 'Already exists' });
			}

			const newUser = new User({
				email,
				password: hashedPassword,
			});

			await newUser.save();

			const responseUser = { email: newUser.email, id: newUser._id };
			return res.status(201).json(responseUser);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
