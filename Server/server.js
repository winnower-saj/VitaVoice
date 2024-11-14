const dotenv = require('dotenv');
const app = require('./app');
const connectMongoDB = require('./config/mongoDB');

dotenv.config();

const HOST = '10.0.0.147';
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
