import React, { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import AppIntroduction from './components/AppIntroduction';
import { AuthProvider, useAuth } from '../context/authContext';
import { getUserSession } from '../services/authService';
import LoginSignUp from './index';
import Login from './login';
import SignUp from './signup';
import Home from './home';
import Profile from './profile';
import Notifications from './notifications';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const preloadImages = async (imageAssets) => {
	const cacheImages = imageAssets.map((image) => Asset.loadAsync(image));
	return Promise.all(cacheImages);
};

const RootLayoutContent = () => {
	const [appState, setAppState] = useState(AppState.currentState);
	const router = useRouter();
	const { login, user } = useAuth();
	const [isAppReady, setIsAppReady] = useState(false);
	const [isLoadDataComplete, setIsLoadDataComplete] = useState(false);
	const [hasOpenedAppBefore, setHasOpenedAppBefore] = useState(false);
	const [isFontsLoaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		const handleAppStateChange = (nextAppState) => {
			if (
				appState === 'background' &&
				nextAppState === 'active' &&
				user
			) {
				while (router.canGoBack()) {
					router.back();
				}
				router.replace('/home');
			}
			setAppState(nextAppState);
		};

		const subscription = AppState.addEventListener(
			'change',
			handleAppStateChange
		);
		return () => subscription.remove();
	}, [appState, user]);

	const loadUserData = async () => {
		const session = await getUserSession();
		if (session?.accessToken) {
			await login(
				session.userId,
				session.accessToken,
				session.refreshToken,
				session.firstName,
				session.lastName,
				session.phoneNumber
			);
		}
	};

	const loadData = async () => {
		try {
			await preloadImages([
				require('../assets/images/bell.png'),
				require('../assets/images/lotus.png'),
				require('../assets/images/assistant.png'),
				require('../assets/images/wellbeing.png'),
				require('../assets/images/logo-blue.png'),
				require('../assets/images/check.png'),
				require('../assets/images/profile.png'),
				require('../assets/images/notifications.png'),
			]);
			// Check if the app has been opened before
			const hasOpenedBefore = await AsyncStorage.getItem(
				'hasOpenedAppBefore'
			);
			setHasOpenedAppBefore(hasOpenedBefore === 'true');
			await loadUserData();
			setIsLoadDataComplete(true);
		} catch (e) {
			console.warn(e);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (isFontsLoaded && isLoadDataComplete) {
			setIsAppReady(true);
		}
	}, [isFontsLoaded, isLoadDataComplete]);

	if (!isAppReady) {
		return null;
	}

	if (!hasOpenedAppBefore && !user) {
		return (
			<AppIntroduction
				onSkip={async () => {
					await AsyncStorage.setItem('hasOpenedAppBefore', 'true');
					setHasOpenedAppBefore(true);
				}}
			/>
		);
	}

	// If user is not logged in, show authentication stack
	if (!user) {
		return (
			<AuthStack.Navigator>
				<AuthStack.Screen
					name='index'
					component={LoginSignUp}
					options={{ headerShown: false }}
				/>
				<AuthStack.Screen
					name='login'
					component={Login}
					options={{ headerShown: false }}
				/>
				<AuthStack.Screen
					name='signup'
					component={SignUp}
					options={{ headerShown: false }}
				/>
			</AuthStack.Navigator>
		);
	}

	// Drawer Navigator for logged-in users
	return (
		<Drawer.Navigator
			initialRouteName='home'
			screenOptions={{
				drawerType: 'slide',
				swipeEnabled: true,
			}}
		>
			<Drawer.Screen
				name='home'
				component={Home}
				options={{ headerShown: false }}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name='profile'
				component={Profile}
				options={{ headerShown: false }}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name='notifications'
				component={Notifications}
				options={{ headerShown: false }}
				initialParams={{ user }}
			/>
		</Drawer.Navigator>
	);
};

const RootLayout = () => (
	<AuthProvider>
		<RootLayoutContent />
	</AuthProvider>
);

export default RootLayout;