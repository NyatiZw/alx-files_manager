const fs = require('fs').promise;
const path = require('path');
const uuidv4 = require('uuid').v4;
const File = require('../models/File');
const User = require('../models/User');


module.exports = {
	postUpload: async (req, res) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const { name, type, parentId = 0, isPublic = false, data } = req.body;

			if (!name) {
				return res.status(400).json({ error: 'Missing name' });
			}

			if (!type || !['folder', 'file', 'image'].include(type)) {
				return res.status(400).json({ error: 'Missing or invalid type' });
			}

			if (type !== 'folder' && !data) {
				return res.status(400).json({ error: 'Mmmissing data' });
			}

			if (parentId !== 0) {
				const parentFile = await File.findOne({ _id: parentId });

				if (!parentFile) {
					return res.status(400).json({ error: 'Parent not fount' });
				}

				if (parentFile.type !== 'folder') {
					return res.status(400).json({ error: 'Parent is not a folder' });
				}
			}

			let localPath = null;

			if (type !== 'folder') {
				const storingFolder = process.env.FOLDER_PATH || '/tmp/files_manager';
				localPath = path.join(storingFolder, uuidv4());

				const fileData = Buffer.from(data, 'base64');
				await fs.writeFile(localPath, fileData);
			}

			const newFile = new File({
				userId,
				name,
				type,
				parentId,
				isPublic,
				localPath,
			});

			await newFile.save();

			return res.status(201).json(newFile);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
