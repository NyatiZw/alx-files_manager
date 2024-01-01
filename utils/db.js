// utilis/db.js

import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'locahost';
const DB_PORT = process.env.DB_HOST || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;


class DBClient {
	constructor() {
		this.connect();
	}

	async connect() {
		try {
			const client = await MongoClient.connect(url, { useUnifiedTopology: true });
			this.db = client.db(DB_DATABASE);
			this.usersCollection = this.db.collection('users');
			this.filesCollection = this.db.collection('files');
		} catch (err) {
			console.log(err.message);
			this.db = false;
		}
	}

	isAlive() {
		return Boolean(this.db);
	}

	async nbUsers() {
		const numberOfUsers = await this.usersCollection.countDocuments();
		return numberOfUsers;
	}

	async nbFiles() {
		const numberOfFiles = await this.filesCollection.countDocuments();
		return numberOfFiles;
	}
}

const dbClient = new DBClient();

export default dbClient;
