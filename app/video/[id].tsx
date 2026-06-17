import { Stack, useLocalSearchParams } from 'expo-router';
import VideoPlayerScreen from '../../src/screens/VideoPlayerScreen';
import { useTheme } from '../../src/context/ThemeContext';

export default function VideoPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'فيديو',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <VideoPlayerScreen videoId={id as string} />
    </>
  );
}
