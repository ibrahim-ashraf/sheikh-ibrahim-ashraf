import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { VideoItem } from '../services/youtubeApi';
import { useRouter } from 'expo-router';

interface VideoCardProps {
  video: VideoItem;
  disabled?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, disabled }) => {
  const { theme } = useTheme();
  const router = useRouter();

  // التحقق من وجود الصورة المصغرة
  const thumbnailUrl = video.snippet?.thumbnails?.medium?.url ||
    'https://via.placeholder.com/480x360.png?text=Video+Unavailable';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          opacity: disabled ? 0.5 : 1
        }
      ]}
      onPress={() => !disabled && router.push(`/video/${video.id.videoId}`)}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`فيديو: ${video.snippet?.title || 'غير متوفر'}`}
      accessibilityHint={disabled ? "هذا الفيديو غير متوفر" : "انقر لمشاهدة الفيديو"}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={`صورة مصغرة لفيديو: ${video.snippet?.title || 'غير متوفر'}`}
      />
      <View style={styles.details}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {video.snippet?.title || 'فيديو غير متوفر'}
        </Text>
        {video.snippet?.publishedAt && (
          <Text
            style={[styles.date, { color: theme.colors.textSecondary }]}
          >
            {new Date(video.snippet.publishedAt).toLocaleDateString('ar-EG')}
          </Text>
        )}
        {disabled && (
          <Text style={[styles.unavailable, { color: theme.colors.primary }]}>
            هذا الفيديو غير متوفر
          </Text>
        )}
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
  unavailable: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default VideoCard;
