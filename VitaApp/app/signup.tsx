import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import CustomModal from './components/CustomModal';
import { useAuth } from '../context/authContext';
import { signupUser } from '../services/dbService';
import PasswordInput from './components/PasswordInput';

const SignUp = () => {
	const router = useRouter();
	const { login } = useAuth();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({
		firstName: false,
		lastName: false,
		phoneNumber: false,
		password: false,
		confirmPassword: false,
	});
	const [showModal, setShowModal] = useState(false);

	const isValidDetails = (userDetails) => {
		const { firstName, lastName, phoneNumber, password, confirmPassword } =
			userDetails;
		let isValid = true;
		const newErrors = {
			firstName: false,
			lastName: false,
			phoneNumber: false,
			password: false,
			confirmPassword: false,
		};
		if (!firstName) {
			newErrors.firstName = true;
			isValid = false;
		}
		if (!lastName) {
			newErrors.lastName = true;
			isValid = false;
		}
		if (!phoneNumber) {
			newErrors.phoneNumber = true;
			isValid = false;
		}
		if (!password) {
			newErrors.password = true;
			isValid = false;
		}
		if (!confirmPassword) {
			newErrors.confirmPassword = true;
			isValid = false;
		}
		if (password !== confirmPassword) {
			newErrors.password = true;
			newErrors.confirmPassword = true;
			isValid = false;
		}
		setErrors(newErrors);
		return isValid;
	};

	const handleSignUp = async () => {
		const trimmedFirstName = firstName.trim();
		const trimmedLastName = lastName.trim();
		const trimmedPhoneNumber = phoneNumber.trim();
		const trimmedPassword = password.trim();
		const trimmedConfirmPassword = confirmPassword.trim();

		const isValid = isValidDetails({
			firstName: trimmedFirstName,
			lastName: trimmedLastName,
			phoneNumber: trimmedPhoneNumber,
			password: trimmedPassword,
			confirmPassword: trimmedConfirmPassword,
		});

		if (!isValid) {
			Alert.alert('Error', 'Please correct the highlighted fields');
			return;
		}

		try {
			const response = await signupUser({
				firstName: trimmedFirstName,
				lastName: trimmedLastName,
				phoneNumber: trimmedPhoneNumber,
				password: trimmedPassword,
			});

			if (response.status === 201) {
				const {
					userId,
					accessToken,
					refreshToken,
					firstName,
					lastName,
					phoneNumber,
				} = response.data;
				await login(
					userId,
					accessToken,
					refreshToken,
					firstName,
					lastName,
					phoneNumber
				);
				setShowModal(true);
			} else {
				Alert.alert(
					'Error',
					'Failed to create account. Please try again.'
				);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to create account. Please try again.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create an account</Text>

			<TextInput
				style={[styles.input, errors.firstName && styles.inputError]}
				placeholder='First Name'
				value={firstName}
				onChangeText={setFirstName}
			/>

			<TextInput
				style={[styles.input, errors.lastName && styles.inputError]}
				placeholder='Last Name'
				value={lastName}
				onChangeText={setLastName}
			/>

			<TextInput
				style={[styles.input, errors.phoneNumber && styles.inputError]}
				placeholder='Phone number'
				value={phoneNumber}
				keyboardType='phone-pad'
				onChangeText={setPhoneNumber}
			/>

			<PasswordInput
				value={password}
				placeholder='Password'
				onChange={setPassword}
				hasError={errors.password}
			/>

			<PasswordInput
				value={confirmPassword}
				placeholder='Confirm Password'
				onChange={setConfirmPassword}
				hasError={errors.confirmPassword}
			/>

			<Button
				title='Sign Up'
				buttonStyle={styles.signUpButton}
				onPress={handleSignUp}
			/>

			<View style={styles.loginContainer}>
				<Text>Already have an account? </Text>
				<TouchableOpacity onPress={() => router.navigate('/login')}>
					<Text style={styles.loginText}>Log In</Text>
				</TouchableOpacity>
			</View>
			<View>
				<CustomModal
					title='Successfully Registered'
					message='Congratulations, you have successfully created the VitaVoice account.'
					button='Home'
					onClose={() => {
						setShowModal(false);
						router.navigate('/home');
					}}
					visible={showModal}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#001C71',
	},
	input: {
		width: '100%',
		borderColor: '#0077FF',
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
	},
	inputError: {
		borderColor: 'red',
	},
	signUpButton: {
		backgroundColor: '#0077FF',
		width: '100%',
		padding: 15,
		borderRadius: 10,
	},
	loginContainer: {
		flexDirection: 'row',
		marginTop: 20,
	},
	loginText: {
		color: '#0077FF',
	},
});

export default SignUp;