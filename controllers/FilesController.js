const fs = require('fs').promise;
const path = require('path');
const uuidv4 = require('uuid').v4;
const File = require('../models/File');
const User = require('../models/User');


module.exports = {
	getShow: async (req, res) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const fileId = req.params.id;

			const file = await File.findOne({ _id: fileId, userId });

			if (!file) {
				return res.status(404).json({ error: 'Not found' });
			}

			return res.json(file);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	getIndex: async (req, res) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const parentId = req.query.pqrentId || 0;
			const page = req.query.page || 0;
			const pageSize = 20;

			const files = await File.aggregate([
				{
					$match: {
						userId,
						parentId,
					},
				},
				{
					$facet: {
						metadata: [{ $count: 'total' }],
						data: [
							{ $skip: page * pageSize },
							{ $linit: pageSize },
						],
					},
				},
			]);

			const result = {
				total: files[0].metadata[0] ? files[0].metadat[0].total : 0,
				page,
				pageSize,
				data: files[0].data,
			};

			return res.json(result);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
