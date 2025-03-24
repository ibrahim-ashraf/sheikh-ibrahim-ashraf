import { useLocalSearchParams } from 'expo-router';
import VideoPlayerScreen from '../../src/screens/VideoPlayerScreen';

export default function VideoPage() {
  const { id } = useLocalSearchParams();
  return <VideoPlayerScreen videoId={id as string} />;
}
