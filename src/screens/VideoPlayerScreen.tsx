import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Share, Text } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { InterstitialAdManager } from '../services/adsService';
import { useRouter } from 'expo-router';

interface VideoPlayerScreenProps {
  videoId: string;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ videoId }) => {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // عرض إعلان بيني قبل تشغيل الفيديو
    InterstitialAdManager.showAd();

    return () => {
      // تنظيف عند مغادرة الشاشة
      setPlaying(false);
    };
  }, []);

  const [playing, setPlaying] = React.useState(true);

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
        play={playing}
        onChangeState={(event) => {
          if (event === 'ended') {
            setPlaying(false);
          }
        }}
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

        {/* إضافة زر الاشتراك المميز */}
        <TouchableOpacity
          onPress={() => router.push("/subscribe")}
          style={[styles.premiumButton, { backgroundColor: theme.colors.primary }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="احصل على اشتراك مميز"
          accessibilityHint="اشترك للتصفح بدون إعلانات"
        >
          <Ionicons name="star-outline" size={20} color="#FFFFFF" />
          <Text style={styles.premiumButtonText}>احصل على تجربة بدون إعلانات</Text>
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
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default VideoPlayerScreen;
