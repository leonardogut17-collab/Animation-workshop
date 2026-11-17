# Reanimated Lab — Ejercicios de animación con React Native + Expo

App móvil con **Expo SDK 58**, **React Native Reanimated 4**, **React Native Gesture Handler 3** y **Expo Router (Drawer)**.

| # | Ejercicio | Archivo | Qué usa |
|---|-----------|---------|---------|
| 1 | Arrastrar y rotar | `src/app/arrastrar.tsx` | `usePanGesture`, `interpolate`, `withSpring` |
| 2 | Animación de carga | `src/app/cargando.tsx` | `useEffect` al montar, `withRepeat`, `withSequence`, `useAnimatedReaction` |
| 3 | Gestos multitouch | `src/app/multitouch.tsx` | `usePinchGesture`, `useRotationGesture`, `usePanGesture`, `useSimultaneousGestures` |
| 4 | Rebote | `src/app/rebote.tsx` | `useTapGesture` (`onBegin`/`onFinalize`), `withSpring` con `damping` bajo |
| 5 | Carrusel animado | `src/app/carrusel.tsx` | `useAnimatedScrollHandler`, `interpolate` (escala, rotateZ, rotateY, opacidad) |
| 6 | Acelerómetro | `src/app/acelerometro.tsx` | `expo-sensors` (`Accelerometer`), `withSequence` + `withRepeat` |
| 7 | Drawer Navigation | `src/app/_layout.tsx` | `Drawer` de `expo-router/drawer` |

## Estructura

```
src/
├── app/                  ← cada archivo es una pantalla (Expo Router)
│   ├── _layout.tsx       ← Drawer + GestureHandlerRootView
│   ├── index.tsx         ← Inicio
│   ├── arrastrar.tsx
│   ├── cargando.tsx
│   ├── multitouch.tsx
│   ├── rebote.tsx
│   ├── carrusel.tsx
│   └── acelerometro.tsx
├── components/
│   └── ScreenContainer.tsx
└── theme.ts
assets/paisaje.png        ← imagen del ejercicio multitouch
```

## Cómo ejecutarlo

1. Instala dependencias (necesitas Node 20 o superior):
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npx expo start
   ```
3. Abre la app **Expo Go** (versión para SDK 58) en tu teléfono y escanea el código QR.
   - Todas las librerías usadas vienen incluidas en Expo Go, no necesitas un development build.
   - El ejercicio del acelerómetro se debe probar en un **teléfono real** (en el emulador usa el botón «Simular sacudida»).

## Generar APK (opcional, con EAS Build)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

El proyecto ya incluye `eas.json` con el perfil `preview` configurado para generar un `.apk` instalable.

## Comandos útiles

```bash
npm run typecheck     # revisa tipos con TypeScript
npx expo-doctor       # revisa compatibilidad de dependencias
```
