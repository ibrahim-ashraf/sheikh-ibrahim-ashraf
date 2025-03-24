import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchPlaylistVideos, PlaylistVideoItem } from '../services/youtubeApi';
import VideoCard from '../components/VideoCard';

interface PlaylistVideosScreenProps {
  playlistId: string;
}

const PlaylistVideosScreen: React.FC<PlaylistVideosScreenProps> = ({ playlistId }) => {
  const { theme } = useTheme();
  const [videos, setVideos] = useState<PlaylistVideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylistVideos();
  }, [playlistId]);

  const loadPlaylistVideos = async () => {
    try {
      const data = await fetchPlaylistVideos(playlistId);
      setVideos(data.items);
    } catch (error) {
      console.error('Error loading playlist videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const videoItemToVideoCard = (item: PlaylistVideoItem) => ({
    id: { videoId: item.snippet.resourceId.videoId },
    snippet: {
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
      publishedAt: item.snippet.publishedAt,
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.snippet.resourceId.videoId}
        renderItem={({ item }) => (
          <VideoCard video={videoItemToVideoCard(item)} />
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={loadPlaylistVideos}
        refreshing={loading}
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
});

export default PlaylistVideosScreen;
