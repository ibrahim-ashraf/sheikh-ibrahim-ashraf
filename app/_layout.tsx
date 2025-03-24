import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { useTheme } from '../src/context/ThemeContext';

export default function Layout() {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="video/[id]"
          options={{
            title: 'فيديو',
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="playlist/[id]"
          options={{
            title: 'قائمة التشغيل',
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
