import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useRotationGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ScreenContainer from '../components/ScreenContainer';
import { colors, radius } from '../theme';

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

/**
 * Ejercicio 3: gestos multitouch sobre una imagen.
 * Se combinan tres gestos que funcionan AL MISMO TIEMPO (useSimultaneousGestures):
 *  - Pan (1 o 2 dedos): mover.
 *  - Pinch (2 dedos): zoom in / zoom out.
 *  - Rotation (2 dedos): rotar.
 * Doble toque = restablecer.
 *
 * Para cada transformación guardamos el valor acumulado ("saved") y el
 * valor durante el gesto, así el siguiente gesto continúa desde donde quedó.
 */
export default function MultitouchScreen() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const rotation = useSharedValue(0); // radianes
  const savedRotation = useSharedValue(0);

  const pan = usePanGesture({
    averageTouches: true,
    onUpdate: (e) => {
      'worklet';
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    },
    onFinalize: () => {
      'worklet';
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    },
  });

  const pinch = usePinchGesture({
    onUpdate: (e) => {
      'worklet';
      scale.value = Math.min(Math.max(savedScale.value * e.scale, MIN_SCALE), MAX_SCALE);
    },
    onFinalize: () => {
      'worklet';
      savedScale.value = scale.value;
    },
  });

  const rotate = useRotationGesture({
    onUpdate: (e) => {
      'worklet';
      rotation.value = savedRotation.value + e.rotation;
    },
    onFinalize: () => {
      'worklet';
      savedRotation.value = rotation.value;
    },
  });

  const reset = () => {
    'worklet';
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
    savedX.value = 0;
    savedY.value = 0;
    savedScale.value = 1;
    savedRotation.value = 0;
  };

  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      'worklet';
      reset();
    },
  });

  const gesture = useSimultaneousGestures(pan, pinch, rotate, doubleTap);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const infoStyle = useAnimatedStyle(() => ({
    opacity: scale.value !== 1 || rotation.value !== 0 ? 1 : 0.6,
  }));

  return (
    <ScreenContainer hint="Usa dos dedos: pellizca para hacer zoom, gira para rotar y arrastra para mover. Doble toque o el botón para restablecer.">
      <GestureDetector gesture={gesture}>
        {/* El área completa captura los gestos, no solo la imagen. */}
        <View style={styles.area}>
          <Animated.Image
            source={require('../../assets/paisaje.png')}
            style={[styles.image, imageStyle]}
            resizeMode="cover"
          />
        </View>
      </GestureDetector>

      <Animated.View style={[styles.footer, infoStyle]}>
        <Pressable style={styles.button} onPress={() => reset()}>
          <Text style={styles.buttonText}>Restablecer</Text>
        </Pressable>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: radius.md,
  },
  footer: {
    padding: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
