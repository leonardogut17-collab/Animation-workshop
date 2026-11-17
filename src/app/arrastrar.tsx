import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ScreenContainer from '../components/ScreenContainer';
import { colors } from '../theme';

const SIZE = 110;
const MAX_ROTATION = 35; // grados

/**
 * Ejercicio 1: Drag & Drop con rotación.
 * - La posición se guarda en translateX / translateY.
 * - Mientras se arrastra, el desplazamiento horizontal (dx) se convierte en
 *   rotación: hacia la izquierda gira a la izquierda (negativo), hacia la
 *   derecha gira a la derecha (positivo).
 * - Al soltar, la rotación vuelve a 0 con un resorte y la figura se queda
 *   donde la dejaste (limitada al área visible).
 */
export default function DragRotateScreen() {
  const [area, setArea] = useState({ width: 0, height: 0 });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const maxX = useSharedValue(0);
  const maxY = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea({ width, height });
    // La figura empieza centrada, así que puede moverse la mitad del espacio libre.
    maxX.value = (width - SIZE) / 2;
    maxY.value = (height - SIZE) / 2;
  };

  const pan = usePanGesture({
    onActivate: () => {
      'worklet';
      startX.value = translateX.value;
      startY.value = translateY.value;
      scale.value = withSpring(1.1);
    },
    onUpdate: (e) => {
      'worklet';
      // Mantener la figura dentro del área.
      translateX.value = Math.min(Math.max(startX.value + e.translationX, -maxX.value), maxX.value);
      translateY.value = Math.min(Math.max(startY.value + e.translationY, -maxY.value), maxY.value);

      // Rotación proporcional al movimiento horizontal.
      rotation.value = interpolate(
        e.translationX,
        [-150, 0, 150],
        [-MAX_ROTATION, 0, MAX_ROTATION],
        Extrapolation.CLAMP,
      );
    },
    onFinalize: () => {
      'worklet';
      rotation.value = withSpring(0, { damping: 8, stiffness: 120 });
      scale.value = withSpring(1);
    },
  });

  const shapeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  // Etiqueta que indica hacia dónde está girando.
  const leftLabel = useAnimatedStyle(() => ({ opacity: rotation.value < -3 ? 1 : 0.25 }));
  const rightLabel = useAnimatedStyle(() => ({ opacity: rotation.value > 3 ? 1 : 0.25 }));

  return (
    <ScreenContainer hint="Arrastra la figura por la pantalla. Si la mueves a la izquierda gira a la izquierda; a la derecha, gira a la derecha.">
      <View style={styles.area} onLayout={onLayout}>
        <View style={styles.labels} pointerEvents="none">
          <Animated.Text style={[styles.label, leftLabel]}>⟲ Izquierda</Animated.Text>
          <Animated.Text style={[styles.label, rightLabel]}>Derecha ⟳</Animated.Text>
        </View>

        {area.width > 0 && (
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.shape, shapeStyle]}>
              <Text style={styles.arrow}>▲</Text>
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 15,
  },
  shape: {
    width: SIZE,
    height: SIZE,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  arrow: {
    color: colors.text,
    fontSize: 40,
  },
});
