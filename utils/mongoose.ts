import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
	mongoose.set('strictQuery', true);

	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI not found');
	}

	if (isConnected) {
		return console.log('=> using existing database connection');
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI);

		isConnected = true;

		console.log('=> mongodb connected');
	} catch (e) {
		console.error('Failed to connect to database', e);
	}
};
