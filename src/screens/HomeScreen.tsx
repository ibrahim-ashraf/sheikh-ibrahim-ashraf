import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchLatestVideos, searchVideos, VideoItem } from '../services/youtubeApi';
import VideoCard from '../components/VideoCard';
import SearchBar from '../components/SearchBar';
import { AdBanner } from '../components/AdBanner';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();

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
        <>
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id.videoId}
            renderItem={({ item }) => <VideoCard video={item} />}
            contentContainerStyle={styles.listContent}
            refreshing={loading}
            onRefresh={loadVideos}
            accessible={true}
            accessibilityLabel="قائمة الفيديوهات"
            accessibilityHint="اسحب لأسفل للتحديث"
          />
          <TouchableOpacity
            onPress={() => router.push("/subscribe")}
            style={[styles.subscribeButton, { backgroundColor: theme.colors.primary }]}
            accessible={true}
            accessibilityLabel="احصل على اشتراك مميز"
            accessibilityHint="اشترك للتصفح بدون إعلانات"
          >
            <Ionicons name="star-outline" size={20} color="#FFFFFF" />
            <Text style={styles.subscribeButtonText}>احصل على تجربة بدون إعلانات</Text>
          </TouchableOpacity>
          <AdBanner />
        </>
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
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HomeScreen;
