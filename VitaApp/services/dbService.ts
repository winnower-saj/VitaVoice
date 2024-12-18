import axios from 'axios';

const Config = {
	API_URL: 'http://10.0.0.125:3000',
};

// Sign up a user by sending thier data to the API
const signupUser = async (userData: {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
}) => {
	try {
		const response = await axios.post(
			`${Config.API_URL}/auth/signup`,
			userData
		);

		return response;
	} catch (error) {
		throw error;
	}
};

// Login a user by sending their phone number and password to the API
const loginUser = async (userData: {
	phoneNumber: string;
	password: string;
}) => {
	try {
		const response = await axios.post(
			`${Config.API_URL}/auth/login`,
			userData
		);

		return response;
	} catch (error) {
		throw error;
	}
};

// Logout a user by sending their refresh token to the API
const logoutUser = async (refreshToken: string) => {
	try {
		const response = await axios.post(`${Config.API_URL}/auth/logout`, {
			token: refreshToken,
		});

		return response.data;
	} catch (error) {
		throw error;
	}
};

// Delete a user by sending their userId and token to the API
const deleteUser = async (userId: string, refreshToken: string) => {
	try {
		const response = await axios.delete(`${Config.API_URL}/auth/delete`, {
			data: { userId, token: refreshToken },
		});

		return response.data;
	} catch (error) {
		throw error;
	}
};

// Update users information
const updateUserProfile = async (userData: {
	userId: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
}) => {
	try {
		const response = await axios.patch(
			`${Config.API_URL}/auth/update-profile`,
			userData
		);

		return response;
	} catch (error) {
		throw error;
	}
};

//Compare and update password
const updatePassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string
) => {
	try {
		const response = await axios.patch(
			`${Config.API_URL}/auth/update-password`,
			{
				userId,
				currentPassword,
				newPassword,
			}
		);
		return response.data;
	} catch (error) {
		console.error(
			'Error updating password:',
			error.response?.data || error.message
		);
		throw new Error(
			error.response?.data.message ||
				'Password update failed. Please try again.'
		);
	}
};

// Fetch medication count
const fetchMedicationCount = async (userId: string) => {
	try {
		const response = await axios.get(
			`${Config.API_URL}/auth/medication-count/${userId}`
		);
		return response.data; // Assuming response.data contains the count
	} catch (error) {
		throw new Error(
			error.response?.data.message || 'Failed to fetch medication count.'
		);
	}
};

// Fetch conversation count
const fetchConversationCount = async (userId: string) => {
	try {
		const response = await axios.get(
			`${Config.API_URL}/auth/conversation-count/${userId}`
		);
		return response.data; // Assuming response.data contains the count
	} catch (error) {
		throw new Error(
			error.response?.data.message ||
				'Failed to fetch conversation count.'
		);
	}
};

// Increment conversation count
const incrementConversation = async (userId: string) => {
	try {
		const response = await axios.post(
			`${Config.API_URL}/auth/increment-conversation/${userId}`
		);
		return response.data; // Assuming response.data contains the updated count and message
	} catch (error) {
		throw new Error(
			error.response?.data.message ||
				'Failed to increment conversation count.'
		);
	}
};

// Increment medication count
const incrementMedication = async (userId: string) => {
	try {
		const response = await axios.post(
			`${Config.API_URL}/auth/increment-medication/${userId}`
		);
		return response.data; // Assuming response.data contains the updated count and message
	} catch (error) {
		throw new Error(
			error.response?.data.message ||
				'Failed to increment medication count.'
		);
	}
};

const refreshAccessToken = async (refreshToken: any) => {
	try {
		const response = await fetch(`${Config.API_URL}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: refreshToken }),
		});

		if (response.ok) {
			const data = await response.json();
			return data.accessToken;
		}
		throw new Error('Failed to refresh access token');
	} catch (e) {
		console.error('Error refreshing token:', e);
		return null;
	}
};
const saveExpoPushTokenToBackend = async (userId, token) => {
	try {
		const response = await axios.post(`${Config.API_URL}/auth/save-token`, {
			userId: userId,
			expoPushToken: token,
		});
	} catch (error) {
		console.error(
			'Error saving push token to backend:',
			error.message,
			error
		);
	}
};

export {
	signupUser,
	loginUser,
	logoutUser,
	deleteUser,
	refreshAccessToken,
	updateUserProfile,
	updatePassword,
	saveExpoPushTokenToBackend,
	fetchConversationCount,
	fetchMedicationCount,
	incrementConversation,
	incrementMedication,
};
