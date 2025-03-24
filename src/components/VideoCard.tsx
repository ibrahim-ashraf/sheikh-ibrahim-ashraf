import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { VideoItem } from '../services/youtubeApi';
import { useRouter } from 'expo-router';

interface VideoCardProps {
  video: VideoItem;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={() => router.push(`/video/${video.id.videoId}`)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`فيديو: ${video.snippet.title}`}
      accessibilityHint="انقر لمشاهدة الفيديو"
    >
      <Image
        source={{ uri: video.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={`صورة مصغرة لفيديو: ${video.snippet.title}`}
      />
      <View style={styles.details}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
          accessible={true}
          accessibilityRole="text"
        >
          {video.snippet.title}
        </Text>
        <Text
          style={[styles.date, { color: theme.colors.textSecondary }]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`تاريخ النشر: ${new Date(video.snippet.publishedAt).toLocaleDateString('ar-EG')}`}
        >
          {new Date(video.snippet.publishedAt).toLocaleDateString('ar-EG')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});

export default VideoCard;
