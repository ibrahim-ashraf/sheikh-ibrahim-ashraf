import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity, ScrollView, ActivityIndicator, Share } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchChannelInfo, ChannelInfo, CHANNEL_ID } from '../services/youtubeApi';
import { openRatingPage } from '../services/ratingService';
import { AdBanner } from '../components/AdBanner';
import { useRouter } from 'expo-router';
import { useSubscription } from '../context/SubscriptionContext';
import Constants from 'expo-constants';

const AboutScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [channelInfo, setChannelInfo] = useState<ChannelInfo['items'][0] | null>(null);
  const { setUserInfo, isPremium } = useSubscription();

  useEffect(() => {
    loadChannelInfo();
  }, []);

  const loadChannelInfo = async () => {
    try {
      const data = await fetchChannelInfo();
      setChannelInfo(data.items[0]);
    } catch (error) {
      console.error('Error loading channel info:', error);
    }
  };

  const socialLinks = [
    { icon: 'logo-youtube', url: `https://youtube.com/channel/${CHANNEL_ID}`, color: '#FF0000', label: 'قناة اليوتيوب' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/IbrahimAshrafFB', color: '#1877F2', label: 'صفحة فيسبوك' },
    { icon: 'logo-twitter', url: 'https://x.com/IbrahimAshrafX', color: '#000000', label: 'حساب X' },
    { icon: 'paper-plane', url: 'https://t.me/IbrahimAshrafTG_C', color: '#0088cc', label: 'قناة تيليجرام' },
    {
      icon: 'star',
      url: '',
      color: '#FFD700',
      label: 'قيّم التطبيق',
      onPress: openRatingPage
    },
    {
      icon: 'person',
      url: '',
      color: theme.colors.primary,
      label: 'الملف الشخصي',
      onPress: () => router.push('/profile')
    },
  ];

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'تطبيق الشيخ إبراهيم أشرف - استمع وشاهد فيديوهات الشيخ\nhttps://play.google.com/store/apps/details?id=com.meftahaloloom.sheikhibrahimashraf',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://sheikh-ibrahim-ashraf.netlify.app/privacy-policy');
  };

  if (!channelInfo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Image
          source={{ uri: channelInfo.snippet.thumbnails.medium.url }}
          style={styles.channelImage}
        />
        <Text style={[styles.channelName, { color: theme.colors.text }]}>
          {channelInfo.snippet.title}
        </Text>
        <Text style={[styles.subscriberCount, { color: theme.colors.textSecondary }]}>
          {parseInt(channelInfo.statistics.subscriberCount).toLocaleString('ar-EG')} مشترك
          {' • '}
          {parseInt(channelInfo.statistics.videoCount).toLocaleString('ar-EG')} فيديو
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {channelInfo.snippet.description}
        </Text>

        <View style={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={link.onPress || (() => Linking.openURL(link.url))}
              style={[styles.socialButton, { backgroundColor: link.color }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              accessibilityHint={`انقر ${link.label}`}
            >
              <Ionicons name={link.icon as any} size={24} color="white" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={openPrivacyPolicy}
          style={[styles.button, { backgroundColor: theme.colors.card }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="سياسة الخصوصية وشروط الاستخدام"
          accessibilityHint="اقرأ سياسة الخصوصية وشروط استخدام التطبيق"
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            سياسة الخصوصية وشروط الاستخدام
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/subscribe")}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="الاشتراك المميز"
          accessibilityHint="اشترك لإزالة الإعلانات"
        >
          <View style={styles.buttonInner}>
            <Ionicons name="star-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              الاشتراك
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={shareApp}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="شارك التطبيق"
          accessibilityHint="شارك رابط التطبيق مع الأصدقاء"
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            شارك التطبيق
          </Text>
        </TouchableOpacity>

        <AdBanner />

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
            التطبيق: {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  channelImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  channelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subscriberCount: {
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  appInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default AboutScreen;
