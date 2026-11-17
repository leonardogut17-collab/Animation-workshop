import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ScreenContainer from '../components/ScreenContainer';
import { colors, radius } from '../theme';

const ITEMS = [
  { emoji: '🚀', title: 'Espacio', desc: 'Explora galaxias lejanas.', color: '#7C5CFF' },
  { emoji: '🌊', title: 'Océano', desc: 'Sumérgete en lo profundo.', color: '#0EA5E9' },
  { emoji: '🌋', title: 'Volcán', desc: 'Siente el calor de la Tierra.', color: '#F97316' },
  { emoji: '🌲', title: 'Bosque', desc: 'Respira aire puro.', color: '#10B981' },
  { emoji: '🏔️', title: 'Montaña', desc: 'Llega a la cima.', color: '#EC4899' },
];

type CardProps = {
  item: (typeof ITEMS)[number];
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
};

/**
 * Cada tarjeta calcula su propia animación según qué tan lejos está del centro.
 * inputRange = [anterior, actual, siguiente] posición de scroll.
 */
function CarouselCard({ item, index, scrollX, itemWidth }: CardProps) {
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth];

    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
    const rotateZ = interpolate(scrollX.value, inputRange, [8, 0, -8], Extrapolation.CLAMP);
    const rotateY = interpolate(scrollX.value, inputRange, [35, 0, -35], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [30, 0, 30], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { perspective: 800 },
        { translateY },
        { scale },
        { rotateY: `${rotateY}deg` },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  return (
    <View style={{ width: itemWidth, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[styles.card, { backgroundColor: item.color, width: itemWidth * 0.86 }, style]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
        <Text style={styles.cardIndex}>
          {index + 1} / {ITEMS.length}
        </Text>
      </Animated.View>
    </View>
  );
}

function Dot({ index, scrollX, itemWidth }: { index: number; scrollX: SharedValue<number>; itemWidth: number }) {
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth];
    return {
      width: interpolate(scrollX.value, inputRange, [8, 26, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * Ejercicio 5: carrusel de tarjetas.
 * - ScrollView horizontal con pagingEnabled (una tarjeta por página).
 * - useAnimatedScrollHandler guarda el scroll en un SharedValue (hilo de UI).
 * - Cada tarjeta interpola escala, rotación (Z y 3D en Y), desplazamiento y opacidad.
 */
export default function CarouselScreen() {
  const [itemWidth, setItemWidth] = useState(0);
  const [current, setCurrent] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      if (itemWidth > 0) {
        scheduleOnRN(setCurrent, Math.round(e.contentOffset.x / itemWidth));
      }
    },
  });

  const goTo = (index: number) => {
    const target = Math.max(0, Math.min(ITEMS.length - 1, index));
    scrollRef.current?.scrollTo({ x: target * itemWidth, animated: true });
    setCurrent(target);
  };

  const onLayout = (e: LayoutChangeEvent) => setItemWidth(e.nativeEvent.layout.width);

  return (
    <ScreenContainer hint="Desliza horizontalmente entre las tarjetas o usa los botones. Observa la escala, la rotación y la transición.">
      <View style={styles.area} onLayout={onLayout}>
        {itemWidth > 0 && (
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {ITEMS.map((item, index) => (
              <CarouselCard key={item.title} item={item} index={index} scrollX={scrollX} itemWidth={itemWidth} />
            ))}
          </Animated.ScrollView>
        )}
      </View>

      <View style={styles.dots}>
        {itemWidth > 0 &&
          ITEMS.map((item, index) => (
            <Dot key={item.title} index={index} scrollX={scrollX} itemWidth={itemWidth} />
          ))}
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, current === 0 && styles.disabled]}
          disabled={current === 0}
          onPress={() => goTo(current - 1)}
        >
          <Text style={styles.buttonText}>‹ Anterior</Text>
        </Pressable>
        <Pressable
          style={[styles.button, current === ITEMS.length - 1 && styles.disabled]}
          disabled={current === ITEMS.length - 1}
          onPress={() => goTo(current + 1)}
        >
          <Text style={styles.buttonText}>Siguiente ›</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1 },
  card: {
    height: '78%',
    borderRadius: radius.lg,
    padding: 24,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  emoji: { fontSize: 72, position: 'absolute', top: 24, left: 24 },
  cardTitle: { color: '#fff', fontSize: 30, fontWeight: '800' },
  cardDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 16, marginTop: 6 },
  cardIndex: { color: 'rgba(255,255,255,0.7)', marginTop: 16, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingTop: 4 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  buttons: { flexDirection: 'row', gap: 12, padding: 16 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.35 },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
