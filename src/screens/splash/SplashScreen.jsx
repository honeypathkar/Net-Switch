import { StyleSheet, View, Dimensions, Image } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.sqrt(width ** 2 + height ** 2);

const SplashScreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(250, withTiming(1, { duration: 1000 }));
    logoOpacity.value = withDelay(1500, withTiming(1, { duration: 500 }));

    setTimeout(() => {
      navigation.replace('MainApp');
    }, 2500);
  }, [navigation, scale, logoOpacity]);

  const animatedStyleDot = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedStyleLogo = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyleDot]} />
      <Animated.View style={[styles.logoContainer, animatedStyleLogo]}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
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
