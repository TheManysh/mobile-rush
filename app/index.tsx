import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from 'expo-image';

const weatherAssets = [
	{
		weather: 'Sunny',
		image: require('../assets/images/sunny.png'),
		lottie: require('../assets/lotties/sun-thunder-rain.json'),
	},
	{
		weather: 'Rainy',
		image: require('../assets/images/rainy.png'),
		lottie: require('../assets/lotties/sun-rain.json'),
	},
	{
		weather: 'Snowy',
		image: require('../assets/images/snowy.png'),
		lottie: require('../assets/lotties/snow.json'),
	},
];

export default function HomeScreen() {
	const animation = useRef(null);
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lottie, setLottie] = useState(null);
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [timeLeft, setTimeLeft] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					'https://mr-api-three.vercel.app/weather'
				);
				const data = response.data;
				setWeatherData(data);

				const currentWeather = weatherAssets.find(
					(asset) => asset.weather === data.weather.condition
				);
				if (currentWeather) {
					setLottie(currentWeather.lottie);
					setBackgroundImage(currentWeather.image);
				}
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Calculate the target date taking into account the user's timezone
		const now = new Date();
		const currentYear = now.getFullYear();
		const targetDate = new Date(`December 25, ${currentYear} 00:00:00`);

		// Adjust for timezone
		const offset = targetDate.getTimezoneOffset() * 60000;
		const adjustedTargetTime = targetDate.getTime() + offset;

		const interval = setInterval(() => {
			const currentTime = new Date().getTime();
			const adjustedCurrentTime = currentTime + offset;
			const distance = adjustedTargetTime - adjustedCurrentTime;

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

			if (distance < 0) {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (loading) return <Text>Loading...</Text>;
	if (error) return <Text>Error: {error}</Text>;

	return (
		<SafeAreaView className='flex w-full h-full bg-blue-300'>
			<ScrollView>
				{weatherData && (
					<View className='relative w-full'>
						<View className=''>
							<View className='flex flex-row items-center justify-center mb-4'>
								<FontAwesome5 name='location-arrow' size={12} color='white' />
								<Text className='ml-2 font-bold text-white'>
									{weatherData.location.city}
								</Text>
							</View>
							<View className='flex items-center w-50 h-50'>
								<LottieView
									autoPlay
									loop
									ref={animation}
									style={{ width: 200, height: 200 }}
									source={lottie}
								/>
								<Text className='text-5xl font-bold text-white'>
									{weatherData.weather.temperature}°C
								</Text>
								<Text className='text-xl font-bold text-white'>
									{weatherData.weather.condition}
								</Text>
							</View>
						</View>
						{/* Additional weather details here */}
						<View className='bg-white'>
							<View>
								<View>
									<View className='text-2xl font-bold text-gray-800'></View>
									<Text></Text>
								</View>
							</View>
						</View>
						{/* time until christmas */}
						<View className='w-full p-4'>
							<View className='flex flex-row items-center justify-start p-4 bg-white rounded-lg'>
								<View className='w-16 h-16 mr-4'>
									<LottieView
										autoPlay
										loop
										ref={animation}
										style={{ width: '100%', height: '100%' }}
										source={require('../assets/lotties/tree.json')}
									/>
								</View>
								<View>
									<Text className='text-2xl font-bold text-gray-800'>
										Time until Christmas
									</Text>
									<Text>{timeLeft}</Text>
								</View>
							</View>
						</View>
					</View>
				)}
				{/* static */}
				<View className='px-4'>
					<Text className='text-3xl font-semibold text-white'>
						For you to visit in {weatherData.location.city}
					</Text>
					<View>
						<View className='flex flex-row'>
							<View className='w-12 h-12 bg-gray-500'></View>
							<Text>Beach</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
