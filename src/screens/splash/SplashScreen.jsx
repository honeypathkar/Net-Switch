import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import {
  requestMultiple,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { showAlert } from '../../utils/alert';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.sqrt(width ** 2 + height ** 2);

const SplashScreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  const initializeApp = async () => {
    if (Platform.OS === 'android') {
      try {
        const fineLocation = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        const coarseLocation = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
        const backgroundLocation =
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;

        const result = await requestMultiple([fineLocation, coarseLocation]);

        const fineGranted = result[fineLocation] === RESULTS.GRANTED;

        if (!fineGranted) {
          showAlert('Please grant location permission to continue.');
          return;
        }

        if (Platform.Version >= 29) {
          const backgroundResult = await request(backgroundLocation);
          console.log('🛑 Background Location Result:', backgroundResult);
        }

        navigation.replace('MainApp');
      } catch (err) {
        console.warn('❌ Permission error:', err);
      }
    } else {
      navigation.replace('MainApp');
    }
  };

  useEffect(() => {
    scale.value = withDelay(250, withTiming(1, { duration: 1000 }));
    logoOpacity.value = withDelay(
      1500,
      withTiming(1, { duration: 500 }, () => {
        runOnJS(initializeApp)();
      }),
    );
  }, []);

  const animatedStyleDot = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedStyleLogo = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyleDot]} />
      <Animated.View style={[styles.logoContainer, animatedStyleLogo]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          onError={e => console.log('Error loading logo:', e.nativeEvent.error)}
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'black',
    position: 'absolute',
  },
  logoContainer: {
    position: 'absolute',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 20,
  },
});
