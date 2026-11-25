import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectToMongoDB() {
	try {
		await mongoose.connect(process.env.mongodb_url);
		console.log("You successfully connected to MongoDB!");
		return mongoose;
	}
	catch (err) {
		console.dir(err);
	}
}

export async function disconnectFromMongoDB() {
	await mongoose.connection.close();
}
