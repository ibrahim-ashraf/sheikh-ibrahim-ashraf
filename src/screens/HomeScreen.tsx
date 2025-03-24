import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchLatestVideos, searchVideos, VideoItem } from '../services/youtubeApi';
import VideoCard from '../components/VideoCard';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await fetchLatestVideos();
      setVideos(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await searchVideos(query);
      setVideos(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.videoId}
          renderItem={({ item }) => <VideoCard video={item} />}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadVideos}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoCard: {
    margin: 8,
    borderRadius: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default HomeScreen;
