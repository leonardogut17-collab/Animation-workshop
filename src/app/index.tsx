import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

const EXERCISES = [
  { href: '/arrastrar', title: 'Arrastrar y rotar', desc: 'Una figura que gira según la dirección en que la arrastras.' },
  { href: '/cargando', title: 'Animación de carga', desc: 'Spinner infinito + barra de progreso al montar el componente.' },
  { href: '/multitouch', title: 'Gestos multitouch', desc: 'Zoom, mover y rotar una imagen con dos dedos.' },
  { href: '/rebote', title: 'Rebote', desc: 'Se encoge al presionar y rebota al soltar.' },
  { href: '/carrusel', title: 'Carrusel animado', desc: 'Tarjetas con escala, rotación y transición.' },
  { href: '/acelerometro', title: 'Acelerómetro', desc: 'Sacude el teléfono y la figura tiembla.' },
] as const;

export default function Home() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bienvenido 👋</Text>
      <Text style={styles.subtitle}>
        Abre el menú lateral (☰ o desliza desde el borde izquierdo) o toca un ejercicio.
      </Text>

      {EXERCISES.map((ex, i) => (
        <Link key={ex.href} href={ex.href} asChild>
          <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{ex.title}</Text>
              <Text style={styles.cardDesc}>{ex.desc}</Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 15, marginBottom: 8, lineHeight: 21 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardDesc: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
