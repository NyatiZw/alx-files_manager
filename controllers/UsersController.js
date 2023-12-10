const { MongoClient } = require('mongodb');
const crypto = require('crypto');


class UserController {
	static async postNew(req, res) {
		const { email, password } = req.body;
		if (!email) {
			return res.status(400).json({ error: 'Missing email' });
		}

		if (!password) {
			return res.status(400).json({ error: 'Missing password' });
		}

		const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

		const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

		try {
			await client.connect();

			const existingUser = await client.db(process.env.DB_DATABASE).collection('users').findOne({ email });
			if (existingUser) {
				return res.status(400).json({ error: 'Already exists' });
			}

			const result = await client.db(process.env.DB_DATABASE).collection('users').insertOne({
				email,
				password: hashedPassword,
			});

			const newUser = {
				id: result.insertedId,
				email,
			};

			return res.status(201).json(newUser);
		} catch (error) {
			console.error(`Error creating user: ${error.message}`);
			return res.status(500).json({ error: 'Internal Server Error' });
		} finally {
			await client.close();
		}
	}
}


module.exports = UsersController;
