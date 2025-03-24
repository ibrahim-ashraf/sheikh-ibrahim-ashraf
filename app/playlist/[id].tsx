import { useLocalSearchParams } from 'expo-router';
import PlaylistVideosScreen from '../../src/screens/PlaylistVideosScreen';

export default function PlaylistPage() {
  const { id } = useLocalSearchParams();
  return <PlaylistVideosScreen playlistId={id as string} />;
}
