import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchPlaylists, PlaylistItem } from '../services/youtubeApi';
import { useRouter } from 'expo-router';
import { AdBanner } from '../components/AdBanner';

const PlaylistsScreen = () => {
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await fetchPlaylists();
      console.log('Playlists loaded:', data.items); // للتأكد من وصول البيانات
      setPlaylists(data.items);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistPress = (playlistId: string) => {
    console.log('Opening playlist:', playlistId); // للتأكد من تنفيذ النقر
    router.push({
      pathname: '/playlist/[id]',
      params: { id: playlistId }
    });
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
      <FlatList
        data={playlists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.playlistCard, { backgroundColor: theme.colors.card }]}
            onPress={() => handlePlaylistPress(item.id)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`قائمة تشغيل: ${item.snippet.title}`}
            accessibilityHint="انقر لعرض محتوى قائمة التشغيل"
          >
            <Image
              source={{ uri: item.snippet.thumbnails.medium.url }}
              style={styles.thumbnail}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`صورة مصغرة لقائمة تشغيل: ${item.snippet.title}`}
            />
            <View style={styles.infoContainer}>
              <Text
                style={[styles.title, { color: theme.colors.text }]}
                numberOfLines={2}
                accessible={true}
                accessibilityRole="text"
              >
                {item.snippet.title}
              </Text>
              <Text
                style={[styles.description, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
                accessible={true}
                accessibilityRole="text"
              >
                {item.snippet.description || 'لا يوجد وصف'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={loadPlaylists}
        refreshing={loading}
        accessible={true}
        accessibilityLabel="قائمة قوائم التشغيل"
      />
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  playlistCard: {
    marginBottom: 16,
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
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default PlaylistsScreen;
