import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  /** Instrucción breve que se muestra arriba del ejercicio. */
  hint: string;
  children: ReactNode;
};

/**
 * Contenedor común de cada ejercicio: una tarjeta con la instrucción
 * y un área de juego que ocupa el resto de la pantalla.
 */
export default function ScreenContainer({ hint, children }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.hint}>
        <Text style={styles.hintText}>{hint}</Text>
      </View>
      <View style={styles.playground}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    gap: 16,
  },
  hint: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  playground: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
