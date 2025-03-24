import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Share } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerScreenProps {
  videoId: string;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ videoId }) => {
  const { theme } = useTheme();

  const shareVideo = async () => {
    try {
      await Share.share({
        message: `https://youtu.be/${videoId}`,
      });
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <YoutubeIframe
        height={220}
        width={Dimensions.get('window').width}
        videoId={videoId}
        play={true}
      />
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={shareVideo}
          style={styles.actionButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="مشاركة الفيديو"
          accessibilityHint="شارك رابط الفيديو مع الآخرين"
        >
          <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    padding: 8,
  },
});

export default VideoPlayerScreen;
