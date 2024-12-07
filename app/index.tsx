import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native';

const weatherAssets = [
	{
		weather: 'Sunny',
		image: require('../assets/images/sunny.png'),
		lottie: require('../assets/lotties/sunny.json'),
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
	const [isChristmas, setIsChristmas] = useState(false);

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

	const [timeLeft, setTimeLeft] = useState('');

	const getBackgroundColor = (condition) => {
		switch (condition) {
			case 'Sunny':
				return 'bg-orange-300';
			case 'Rainy':
				return 'bg-gray-300';
			default:
				return 'bg-blue-300';
		}
	};

	useEffect(() => {
		const currentYear = new Date().getUTCFullYear();
		const targetDate = new Date(Date.UTC(currentYear, 11, 25));

		console.log('Target Date:', targetDate);

		const interval = setInterval(() => {
			const now = new Date();
			const distance = targetDate.getTime() - now.getTime();

			console.log('Distance:', distance);

			if (distance < 0) {
				clearInterval(interval);
				setTimeLeft('Merry Christmas!');
				return;
			}

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// const days = 0;
			// const hours = 0;
			// const minutes = 0;
			// const seconds = 0;

			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

			if (days == 0 && hours == 0 && minutes == 0 && seconds == 0)
				setIsChristmas(true);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (loading)
		return (
			<View className='items-center justify-center flex-1 w-screen h-screen'>
				<ActivityIndicator size='large' />
			</View>
		);
	if (error) return <Text>Error: {error}</Text>;

	if (isChristmas) {
		return (
			<View className='items-center justify-center flex-1 w-screen h-screen '>
				<View>
					<LottieView
						autoPlay
						loop
						ref={animation}
						style={{ width: 200, height: 200 }}
						source={require('../assets/lotties/flair.json')}
					/>
					<LottieView
						autoPlay
						loop
						ref={animation}
						style={{ width: 200, height: 200, position: 'absolute', top: 0 }}
						source={require('../assets/lotties/santa-claus.json')}
					/>
				</View>
				<Pressable
					onPress={() => setIsChristmas(false)}
					className='px-4 py-3 mt-4 bg-red-600 rounded-lg'
				>
					<Text className='font-bold text-white'>🎉{'  '}Hurray!</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<ScrollView
			className={`${getBackgroundColor(
				weatherData.weather.condition
			)} w-full h-full`}
		>
			{weatherData && (
				<View className='relative w-full pt-16'>
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
					<View className='mx-6 mt-4'>
						<View className='flex flex-row justify-between p-4 bg-white rounded-lg'>
							<View className='flex gap-y-4'>
								<View className='flex-row items-center'>
									<View className='flex items-center justify-center w-12 h-12 mr-4 bg-gray-100 rounded-lg'>
										<Feather name='wind' size={20} color='black' />
									</View>
									<View>
										<Text className='text-xl font-semibold'>Wind</Text>
										<Text className='text-gray-800 '>
											{weatherData.weather.wind_speed} km/h,{' '}
											{weatherData.weather.wind_direction}
										</Text>
									</View>
								</View>
								<View className='flex-row items-center'>
									<View className='flex items-center justify-center w-12 h-12 mr-4 bg-gray-100 rounded-lg'>
										<Entypo name='air' size={24} color='black' />
									</View>
									<View>
										<Text className='text-xl font-semibold'>Humidity</Text>
										<Text className='text-gray-800 '>
											{weatherData.weather.humidity}
										</Text>
									</View>
								</View>
							</View>
							<View className='flex gap-y-4'>
								<View className='flex-row items-center'>
									<View className='flex items-center justify-center w-12 h-12 mr-4 bg-gray-100 rounded-lg'>
										<FontAwesome name='compress' size={20} color='black' />
									</View>
									<View>
										<Text className='text-xl font-semibold'>Pressure</Text>
										<Text className='text-gray-800 '>
											{weatherData.weather.atm_pressure} hPa
										</Text>
									</View>
								</View>
								<View className='flex-row items-center'>
									<View className='flex items-center justify-center w-12 h-12 mr-4 bg-gray-100 rounded-lg'>
										<Entypo name='drop' size={20} color='black' />
									</View>
									<View>
										<Text className='text-xl font-semibold'>Precipitation</Text>
										<Text className='text-gray-800 '>
											{weatherData.weather.precipitation_probability} %
										</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					{/* time until christmas */}
					<View className='w-full p-6'>
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
								<Text className='text-xl'>{timeLeft}</Text>
							</View>
						</View>
					</View>
				</View>
			)}
			{/* static */}
			<View className='p-6 bg-white rounded-t-lg'>
				<Text className='text-3xl font-semibold'>
					For you to visit in {weatherData.location.city}
				</Text>
				<Text className='text-sm'>Based on the weather</Text>
				<View className='mt-4'>
					<View className='p-4 mb-4 bg-white border border-gray-300 rounded-lg'>
						<View className='flex flex-row'>
							<View className='w-12 h-12 mr-4 bg-gray-500 rounded-lg'></View>
							<View>
								<Text className='text-xl font-semibold'>Patan</Text>
								<Text>
									<Text className='font-semibold'>Distance:</Text> 1km
								</Text>
							</View>
						</View>
					</View>
					<View className='p-4 mb-4 bg-white border border-gray-300 rounded-lg'>
						<View className='flex flex-row'>
							<View className='w-12 h-12 mr-4 bg-gray-500 rounded-lg'></View>
							<View>
								<Text className='text-xl font-semibold'>Nanglo Restaurant</Text>
								<Text>
									<Text className='font-semibold'>Distance:</Text> 2.3km
								</Text>
							</View>
						</View>
					</View>
					<View className='p-4 mb-4 bg-white border border-gray-300 rounded-lg'>
						<View className='flex flex-row'>
							<View className='w-12 h-12 mr-4 bg-gray-500 rounded-lg'></View>
							<View>
								<Text className='text-xl font-semibold'>Pashupatinath</Text>
								<Text>
									<Text className='font-semibold'>Distance:</Text> 5.5km
								</Text>
							</View>
						</View>
					</View>
					<View className='p-4 mb-4 bg-white border border-gray-300 rounded-lg'>
						<View className='flex flex-row'>
							<View className='w-12 h-12 mr-4 bg-gray-500 rounded-lg'></View>
							<View>
								<Text className='text-xl font-semibold'>Dharahara</Text>
								<Text>
									<Text className='font-semibold'>Distance:</Text> 10km
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
