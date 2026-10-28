import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchPlaylistVideos, PlaylistVideoItem, VideoItem } from '../services/youtubeApi';
import VideoCard from '../components/VideoCard';

interface PlaylistVideosScreenProps {
  playlistId: string;
}

const PlaylistVideosScreen: React.FC<PlaylistVideosScreenProps> = ({ playlistId }) => {
  const { theme } = useTheme();
  const [videos, setVideos] = useState<PlaylistVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

  const loadPlaylistVideos = useCallback(async () => {
    try {
      const data = await fetchPlaylistVideos(playlistId);
      setVideos(data.items);
    } catch (error) {
      console.error('Error loading playlist videos:', error);
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    loadPlaylistVideos();
  }, [loadPlaylistVideos]);

  const videoItemToVideoCard = (item: PlaylistVideoItem): VideoItem => ({
    id: { videoId: item.snippet.resourceId.videoId },
    snippet: item.snippet.title ? {
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnails: item.snippet.thumbnails || { medium: { url: '' } },
      publishedAt: item.snippet.publishedAt || new Date().toISOString(),
    } : undefined
  });

  const isVideoAvailable = (item: PlaylistVideoItem): boolean => {
    return Boolean(item.snippet?.title && item.snippet?.thumbnails?.medium?.url);
  };

  const getAvailableVideos = () => {
    return videos.filter(isVideoAvailable);
  };

  const getUnavailableCount = () => {
    return videos.length - getAvailableVideos().length;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showAlert && getUnavailableCount() > 0 && (
        <TouchableOpacity
          style={[styles.alertContainer, { backgroundColor: theme.colors.card }]}
          onPress={() => setShowAlert(false)}
        >
          <Text style={[styles.alertText, { color: theme.colors.text }]}>
            تم إخفاء {getUnavailableCount()} من الفيديوهات غير المتوفرة
          </Text>
          <Text style={[styles.hideText, { color: theme.colors.primary }]}>
            إغلاق
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={getAvailableVideos()}
        keyExtractor={(item) => item.snippet.resourceId.videoId}
        renderItem={({ item }) => (
          <VideoCard
            video={videoItemToVideoCard(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={loadPlaylistVideos}
        refreshing={loading}
        accessible={true}
        accessibilityLabel="قائمة التشغيل"
        accessibilityHint="اسحب لأسفل للتحديث"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  hideText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default PlaylistVideosScreen;
