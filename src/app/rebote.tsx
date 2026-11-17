import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ScreenContainer from '../components/ScreenContainer';
import { colors } from '../theme';


export default function BounceScreen() {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const tap = useTapGesture({
    maxDuration: 100000, // permite mantener presionado sin que falle el gesto
    onBegin: () => {
      'worklet';
      scale.value = withTiming(0.75, { duration: 120 });
      pressed.value = withTiming(1, { duration: 120 });
    },
    onFinalize: () => {
      'worklet';
      scale.value = withSpring(1, {
        damping: 4, // poco amortiguamiento = más rebote
        stiffness: 220,
        mass: 0.8,
      });
      pressed.value = withTiming(0, { duration: 250 });
    },
  });

  const shapeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(pressed.value, [0, 1], [colors.accent, colors.primary]),
  }));

  return (
    <ScreenContainer hint="Mantén presionada la figura: se encoge. Suéltala: regresa a su tamaño con un rebote.">
      <View style={styles.area}>
        <GestureDetector gesture={tap}>
          <Animated.View style={[styles.shape, shapeStyle]}>
            <Text style={styles.label}>¡Presióname!</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </ScreenContainer>
  );
}

const SIZE = 170;

const styles = StyleSheet.create({
  area: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shape: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  label: { color: colors.text, fontSize: 18, fontWeight: '800' },
});
