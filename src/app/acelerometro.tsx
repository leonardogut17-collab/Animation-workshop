import { Accelerometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ScreenContainer from '../components/ScreenContainer';
import { colors, radius } from '../theme';



const SHAKE_THRESHOLD = 1.8;
const COOLDOWN_MS = 1000; 
const UPDATE_INTERVAL_MS = 100;


export default function AccelerometerScreen() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [shakes, setShakes] = useState(0);
  const lastShake = useRef(0);

  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const shake = useCallback(() => {
    const t = { duration: 60, easing: Easing.linear };
    translateX.value = withSequence(
      withTiming(-18, t),
      withRepeat(withTiming(18, t), 6, true),
      withTiming(0, t),
    );
    rotation.value = withSequence(
      withTiming(-12, t),
      withRepeat(withTiming(12, t), 6, true),
      withTiming(0, t),
    );
    setShakes((n) => n + 1);
  }, [translateX, rotation]);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    Accelerometer.isAvailableAsync().then((isAvailable) => {
      setAvailable(isAvailable);
      if (!isAvailable) return;

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = Accelerometer.addListener((m) => {
        setData(m);
        const magnitude = Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z);
        const now = Date.now();
        if (magnitude > SHAKE_THRESHOLD && now - lastShake.current > COOLDOWN_MS) {
          lastShake.current = now;
          shake();
        }
      });
    });

    return () => subscription?.remove();
  }, [shake]);

  const shapeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <ScreenContainer hint="Sacude físicamente tu teléfono: la figura tiembla. (Usa un dispositivo real; en el emulador puedes usar el botón «Simular».)">
      <View style={styles.area}>
        <Animated.View style={[styles.shape, shapeStyle]}>
          <Text style={styles.emoji}>📳</Text>
        </Animated.View>
        <Text style={styles.counter}>Sacudidas detectadas: {shakes}</Text>
      </View>

      <View style={styles.panel}>
        {available === false ? (
          <Text style={styles.warning}>
            El acelerómetro no está disponible en este dispositivo ({Platform.OS}).
          </Text>
        ) : (
          <View style={styles.row}>
            {(['x', 'y', 'z'] as const).map((axis) => (
              <View key={axis} style={styles.axis}>
                <Text style={styles.axisLabel}>{axis.toUpperCase()}</Text>
                <Text style={styles.axisValue}>{data[axis].toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
        <Pressable style={styles.button} onPress={shake}>
          <Text style={styles.buttonText}>Simular sacudida</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  shape: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  emoji: { fontSize: 64 },
  counter: { color: colors.text, fontSize: 16, fontWeight: '700' },
  panel: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 8 },
  axis: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  axisLabel: { color: colors.textMuted, fontWeight: '700' },
  axisValue: { color: colors.secondary, fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  warning: { color: colors.warning, textAlign: 'center' },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
