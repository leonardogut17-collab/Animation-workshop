import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ScreenContainer from '../components/ScreenContainer';
import { colors, radius } from '../theme';

const PROGRESS_DURATION = 3000; // ms para llenar la barra

/**
 * Ejercicio 2: componente de carga.
 * Al MONTARSE (useEffect con []), arranca dos animaciones a la vez:
 *  - Un spinner que gira infinitamente (withRepeat con -1).
 *  - Una barra de progreso que se llena de 0% a 100% y vuelve a empezar.
 * Al desmontarse, se cancelan las animaciones.
 */
function LoadingIndicator() {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const progress = useSharedValue(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Spinner infinito
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );

    // Pulso suave del punto central
    pulse.value = withRepeat(
      withSequence(withTiming(1.25, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      false,
    );

    // Barra de progreso: 0 → 1, pausa y reinicia
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PROGRESS_DURATION, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
      cancelAnimation(progress);
    };
  }, [rotation, pulse, progress]);

  // Actualiza el texto del porcentaje solo cuando cambia el número entero.
  useAnimatedReaction(
    () => Math.round(progress.value * 100),
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(setPercent, current);
      }
    },
  );

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.loader}>
      <View style={styles.spinnerWrapper}>
        <Animated.View style={[styles.spinner, spinnerStyle]} />
        <Animated.View style={[styles.dot, dotStyle]} />
      </View>

      <Text style={styles.loadingText}>Cargando… {percent}%</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  );
}

export default function LoadingScreen() {
  // Cambiar la "key" desmonta y vuelve a montar el componente,
  // así se ve que la animación arranca sola al montarse.
  const [mountKey, setMountKey] = useState(0);
  const [visible, setVisible] = useState(true);

  return (
    <ScreenContainer hint="El componente inicia el spinner y la barra de progreso automáticamente al montarse. Usa los botones para desmontarlo/montarlo de nuevo.">
      <View style={styles.center}>
        {visible ? (
          <LoadingIndicator key={mountKey} />
        ) : (
          <Text style={styles.unmounted}>Componente desmontado</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => setVisible((v) => !v)}
        >
          <Text style={styles.buttonText}>{visible ? 'Desmontar' : 'Montar'}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            setVisible(true);
            setMountKey((k) => k + 1);
          }}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const SPINNER = 96;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loader: { width: '100%', alignItems: 'center', gap: 24 },
  spinnerWrapper: {
    width: SPINNER,
    height: SPINNER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
    width: SPINNER,
    height: SPINNER,
    borderRadius: SPINNER / 2,
    borderWidth: 8,
    borderColor: colors.surfaceAlt,
    borderTopColor: colors.secondary,
    borderRightColor: colors.primary,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
  },
  loadingText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.secondary,
  },
  unmounted: { color: colors.textMuted, fontSize: 16 },
  buttons: { flexDirection: 'row', gap: 12, padding: 16 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
