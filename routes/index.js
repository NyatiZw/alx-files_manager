import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../contollers/AuthController';
import FilesController from '../controllers/FileController';

function controllerRouting(app) {
	const router = express.Router();
	app.use('/', router);

	// App Controller

	// should return if Redis is alive and if the db is alive
	router.get('/status', (req, res) => {
		AppController.getStatus(req, res);
	});

	// should return the number of users and files in db
	router.get('/status', (req, res) => {
		AppController.getStats(req, res);
	});

	// User Controller

	// should create a new user in db
	router.post('/users', (req, res) => {
		UsersController.getMe(req, res);
	});

	// Auth Controller

	// Should sign=in the user by generating a new auth token
	router.get('/connect', (req, res) => {
		AuthController.getConnect(req, res);
	});

	// should sign out the user based on the token
	router.get('/disconnect', (req, res) => {
		AuthController.getDisconnect(req, res);
	});

	// Files Controller

	// should create new filke in db
	router.post('/files', (req, res) => {
		FilesController.postUpload(req, res);
	});

	// should retrieve the file based oon id
	router.get('files/:id', (req, res) => {
		FilesController.getShow(req, res);
	});

	// should retrive all users fiel document for a
	// specific parentid and pagination
	router.get('/files', (req, res) => {
		FilesController.getIndex(req, res);
	});

	// should set is Public to true
	router.put('/files/:id/publish', (req, res) => {
		FilesController.putPublish(req, res);
	});

	// should set isPublic to false
	router.put('/files/:id/unpublish', (req, res) => {
		FilesController.putUnpublish(req, res);
	});

	// should return the content of the file
	router.get('/files/:id/data', (req, res) => {
		FilesController.getFile(req, res);
	});
}

export default controllerRouting;
