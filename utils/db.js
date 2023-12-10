// utilis/db.js


const { MongoClient } = require('mongodb');

class DBClient {
	constructor() {
		this.host = process.env.DB_HOST || 'localhost';
		this.port = process.env.DB_PORT || 27017;
		this.database = process.env.DB_DATABASE || 'files_manager';
		this.url = `mongodb://${this.host}:${this.port}/${this.database}`;
		this.client = new MongoCLient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
		this.isAlive();
	}

	async isAlive() {
		try {
			await this.client.connect();
			console.log('MongoDB connection established');
			return true;
		} catch (error) {
			console.error(`MongoDB connection error: ${error.message}`);
			return false;
		}
	}

	async nbUsers() {
		try {
			const db = this.client.db(this.database);
			const UsersCollection = db.collection('users');
			const count = await usersCollection.countDocuments();
			return count;
		} catch (error) {
			console.error(`Error counting users: ${error.message}`);
			return -1;
		}
	}

	async nbFiles() {
		try {
			const db = this.client.db(this.database);
			const filesCollection = db.collection('files');
			const count = await filesCollection.countDocuments();
			return count;
		} catch (error) {
			console.error(`Error counting files: ${error.message}`);
			return -1;
		}
	}
}


module.exports = dbClient;
