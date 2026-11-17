import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer, DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer';
import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

// Cada ejercicio es una ruta (archivo) dentro de src/app.
// El Drawer se arma a partir de esta lista.
const SCREENS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Inicio', icon: 'home-outline' },
  { name: 'arrastrar', title: '1. Arrastrar y rotar', icon: 'move-outline' },
  { name: 'cargando', title: '2. Animación de carga', icon: 'sync-outline' },
  { name: 'multitouch', title: '3. Gestos multitouch', icon: 'hand-left-outline' },
  { name: 'rebote', title: '4. Rebote', icon: 'basketball-outline' },
  { name: 'carrusel', title: '5. Carrusel animado', icon: 'albums-outline' },
  { name: 'acelerometro', title: '6. Acelerómetro', icon: 'phone-portrait-outline' },
];

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Reanimated Lab</Text>
        <Text style={styles.drawerSubtitle}>Ejercicios de animación</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    // GestureHandlerRootView debe envolver toda la app para que funcionen los gestos.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.text,
          drawerActiveBackgroundColor: colors.primary,
          drawerInactiveTintColor: colors.textMuted,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        {SCREENS.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: screen.title,
              drawerIcon: ({ color, size }) => (
                <Ionicons name={screen.icon} color={color as string} size={size} />
              ),
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  drawerSubtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },
});
