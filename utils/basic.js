import { Object } from 'mongodb';

const basicUtils = {
	isValidId(id) {
		try {
			ObjectId(id);
		} catch (err) {
			return false;
		}
		return true;
	},
};

export default basicUtilis;
