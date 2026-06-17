import { Stack, useLocalSearchParams } from 'expo-router';
import PlaylistVideosScreen from '../../src/screens/PlaylistVideosScreen';
import { useTheme } from '../../src/context/ThemeContext';

export default function PlaylistPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'قائمة التشغيل',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <PlaylistVideosScreen playlistId={id as string} />
    </>
  );
}
