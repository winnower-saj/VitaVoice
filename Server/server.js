import dotenv from 'dotenv';
import app from './app.js';
import connectMongoDB from './config/mongoDB.js';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectMongoDB();

		// Start the server
		app.listen(PORT, HOST, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Error starting server:', error.message);
		process.exit(1); // Exit the process with an error code
	}
};

startServer();
